// Dependencies

import React, { Component } from 'react'

import * as TimeUnits from '../constants/TimeUnits'

// Components

import { Center } from 'components/Flex'

import TreeMap from './graphs/TreeMap'

import LineType from 'components/graphs/GraphRadioBox'
import Format from 'components/graphs/Format'
import TimeFormatPicker from 'components/graphs/TimeFormatPicker'

import LineGraph from 'components/graphs/LineGraph'

import _ from 'lodash'
import deepmerge from 'deepmerge'

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import moment from 'moment'

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';


import DashBoard from 'material-ui/svg-icons/action/dashboard'
import FlatButton from 'material-ui/FlatButton'
import SvgIcon from 'material-ui/SvgIcon'

export default class App extends Component {
  constructor () {
    super()

    this.state = {
      LineType: null,
      Format: null,
      TimeType: TimeUnits.HOUR,
      NA: true,
      Asia: false,
      Europe: false
    }
  }

  getImpressionOfSamePlatformAndFormat(impressions, specifiedFormat, specifiedPlatform) {
    return impressions.filter(({ format, platform }) =>
      format === specifiedFormat &&
      platform === specifiedPlatform)
  }

  getAggregatedImpressions(impressions) {
    return impressions.reduce((acc, impressRecord) => {
      return acc.concat([ {
        ...impressRecord,
        impressions: acc.length > 0 ? acc[acc.length -1].impressions + impressRecord.impressions : impressRecord.impressions
      }])
    }, [])
  }

  aggregateByTimeUnit(timeUnit, impressions) {
    if (impressions.length === 0) return []

    let timeSliceDuration = 10

    switch(timeUnit) {
      case TimeUnits.MINUTES:
        timeSliceDuration = 10
        break;
      case TimeUnits.HOUR:
        timeSliceDuration = 60
        break;
      case TimeUnits.DAY:
        timeSliceDuration = 60 * 24
        break;
      case TimeUnits.WEEK:
        timeSliceDuration = 60 * 24 * 7
        break;
      default:
        console.error("Uh oh... what kind of time unit did you pass in... I don't recognize it")
    }
    timeSliceDuration = timeSliceDuration * 60 * 1000 // Translate into ms

    // Grab first timestamp
    const firstTimeStamp = _.first(impressions).timestamp

    let payload = [impressions[0]],
      lastTimestamp = firstTimeStamp

    for (var i = 1; i < impressions.length -1; i++) {
      const currentTimeStamp = impressions[i].timestamp

      if (currentTimeStamp - lastTimestamp > timeSliceDuration) {
        lastTimestamp = currentTimeStamp
        payload.push({
          ...impressions[i]
        })
      } else {
        let lastImpression = _.last(payload).impressions

        payload[payload.length - 1] = {
          ...payload[payload.length - 1],
          impressions: payload[payload.length - 1].impressions + impressions[i].impressions
        }
      }
    }

    return payload
  }

  getMultipleLines(dataSets) {
    function concatMerge(destinationArray, sourceArray, mergeOptions) {
      return destinationArray.concat(sourceArray)
    }

    let lines = _.chain(dataSets)
      .map(dataSet => {
        return _.groupBy(dataSet, ({ timestamp }) => timestamp)
      }) // Array of objects, where object's keys are timestamps
      .reduce((acc, cur) => {
        return deepmerge.all([acc, cur], { arrayMerge: concatMerge })
      }, {})
      .values()
      .map(arrayOfImpressionData => {
        return arrayOfImpressionData.reduce((acc, cur) => ({
          ...acc,
          [cur.format + cur.platform]: cur.impressions,
          timestamp: cur.timestamp
        }), {})
      })
      .value()

      return lines
  }

  determineXAxis() {
    const desktopVideos = this
          .getImpressionOfSamePlatformAndFormat(this.props.impressions['NA'], 'video', 'desktop')

    const aggregatedDesktopVideos = this.getAggregatedImpressions(desktopVideos)

    const desktopBanners = this
          .getImpressionOfSamePlatformAndFormat(this.props.impressions['NA'],'banner', 'desktop')

    const mobileVideos = this
          .getImpressionOfSamePlatformAndFormat(this.props.impressions['NA'],'video','mobile')

    const mobileBanners = this.getImpressionOfSamePlatformAndFormat(this.props.impressions['NA'],'banner','mobile')
  }

  graphType(event, value) {
    this.setState({LineType : value})
  }

  formatType(event, value) {
    this.setState({Format : value})
  }

  timeType(event, value) {
    console.log(value)
    this.setState({ TimeType: value })
  }

  componentDidMount() {
    var that = this
    this.props.fetchImpressions('NA').then(function (result) {
      that.determineXAxis()
    })
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) }
  }

  getLineGraphData(props) {
    let lines = [
      this.getImpressionOfSamePlatformAndFormat(props.impressions['NA'], this.state.Format, 'desktop'),
      this.getImpressionOfSamePlatformAndFormat(props.impressions['NA'], this.state.Format, 'mobile'),
      this.getImpressionOfSamePlatformAndFormat(props.impressions['NA'], this.state.Format, 'app')
    ]

    // aggregate impressions if needed.
    if (this.state.LineType === 'Aggregate') {
      lines = lines.map(this.getAggregatedImpressions)
    }

    // Aggregate by the correct time unit
    lines = lines.map(this.aggregateByTimeUnit.bind(this, this.state.TimeType))

    return this.getMultipleLines(lines)
  }

  handleChange(value) {
    switch (value) {
      case "NA":
        this.setState({"NA": true, "Asia": false, "Europe": false, "datacenter": value})
        break
      case "EU":
        this.setState({"NA": false, "Asia": false, "Europe": true, "datacenter": value})
        break
      case "AS":
        this.setState({"NA": false, "Asia": true, "Europe": false, "datacenter": value})
        break
      }
}
  render () {
    // if (this.props.impressions && this.props.impressions['NA']) {
    //   return (
    //     <div>
    //       <LineType onChange={this.graphType.bind(this)}/>
    //       <Format onChange={this.formatType.bind(this)}/>
    //       <TimeFormatPicker onChange={this.timeType.bind(this)} />
    //       <LineGraph
    //         data={this.getLineGraphData(this.props)}
    //         lines={this.state.Format ? [
    //           { dataKey: this.state.Format + 'desktop', color: 'rgba(0,188,212,1)' },
    //           { dataKey: this.state.Format + 'mobile', color: 'rgba(103,58,183,1)'},
    //           { dataKey: this.state.Format + 'app', color: 'rgba(255,152,0,1)'}
    //         ] : []}
    //         XAxis="timestamp"
    //         width={1500}
    //         height={1000}
    //         dataKey="impressions" />
    //         <TreeMap servers={this.props.servers} fetchRequests={this.props.fetchRequests} dc="NA"/>
    //     </div>
    //   )
    // } else {
    //   return <div>"Loading..."</div>
    // }
    const iconStyles = {
      marginRight: 24,
      width: 100,
      height: "auto"
    };
    return (
      <Toolbar width="100">
        <DashBoard style={iconStyles} />
        <FlatButton label="North America" primary = {this.state.NA} onClick = {() => {this.handleChange('NA')}}/>
        <FlatButton label="Asia" primary = {this.state.Asia} onClick = {() => {this.handleChange('AS')}}/>
        <FlatButton label="Europe" primary = {this.state.Europe} onClick = {() => {this.handleChange("EU")}} />
      </Toolbar>
    )
  }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
}

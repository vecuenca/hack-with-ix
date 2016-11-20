// Dependencies

import React, { Component } from 'react'

// Components

import { Center } from 'components/Flex'


import LineType from 'components/graphs/GraphRadioBox'
import LineGraph from 'components/graphs/LineGraph'
import Format from 'components/graphs/Format'

import _ from 'lodash'
import deepmerge from 'deepmerge'

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import moment from 'moment'

export default class App extends Component {
  constructor () {
    super()

    this.state = {
      LineType: null,
      Format: null
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
    console.log(value)
    this.setState({LineType : value})
  }

  formatType(even, value) {
    console.log(value)
    this.setState({Format : value})
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
    const lines = [
      this.getImpressionOfSamePlatformAndFormat(props.impressions['NA'], this.state.Format, 'desktop'),
      this.getImpressionOfSamePlatformAndFormat(props.impressions['NA'], this.state.Format, 'mobile'),
      this.getImpressionOfSamePlatformAndFormat(props.impressions['NA'], this.state.Format, 'app')
    ]

    if (this.state.LineType === 'Discrete') {
      return this.getMultipleLines(lines)
    } else {
      return this.getMultipleLines(lines.map(this.getAggregatedImpressions))
    }
  }

  render () {
    if (this.props.impressions && this.props.impressions['NA'] ) {
      return (
        <div>
          <LineType onChange={this.graphType.bind(this)}/>
          <Format onChange={this.formatType.bind(this)}/>
          <LineGraph
            data={this.getLineGraphData(this.props)}
            lines={this.state.Format ? [
              { dataKey: this.state.Format + 'desktop', color: 'rgba(0,188,212,1)' },
              { dataKey: this.state.Format + 'mobile', color: 'rgba(103,58,183,1)'},
              { dataKey: this.state.Format + 'app', color: 'rgba(255,152,0,1)'}
            ] : []}
            XAxis="timestamp"
            width={1000}
            height={1000}
            dataKey="impressions" />
        </div>
      )
    } else {
      return <div>"Loading..."</div>
    }

  }
}

App.childContextTypes = {
           muiTheme: React.PropTypes.object.isRequired,
       }

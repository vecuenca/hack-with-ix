import React, {Component} from 'react';
import PieGraph from './../components/graphs/PieChart'
import Row from './../components/Flex/Row'
import Col from './../components/Flex/Col'

import * as TimeUnits from '../constants/TimeUnits'

import CircularProgress from 'material-ui/CircularProgress';
import TotalSpend from '../components/impression/TotalSpend'
import TotalImpressions from '../components/impression/TotalImpresion'

import LineType from 'components/graphs/GraphRadioBox'
import Format from 'components/graphs/Format'
import TimeFormatPicker from 'components/graphs/TimeFormatPicker'


import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import LineGraph from 'components/graphs/LineGraph'

import moment from 'moment'
import _ from 'lodash'
import deepmerge from 'deepmerge'

class ImpressionAnalytics extends Component {

  constructor() {
    super()

    this.state = {
      LineType: 'Aggregate',
      Format: 'video',
      TimeType: TimeUnits.HOUR
    }
  }

  formatPlatformImpressions () {
    var data = [];
    const platforms = ['app', 'desktop', 'mobile']

    var that = this;
    platforms.forEach(function(platform) {
      var impressions = 0;

      that.props.impressions[that.props.datacenter].forEach(function (arr) {
        if (arr.platform === platform) {
          impressions += arr.impressions;
        }
      });

      data.push({
        name: platform,
        value: impressions
      });
    });
      
    return data;
  }

  formatFormatImpressions () {
    var data = [];
    const formats = ['banner', 'video'];

    var that = this;
    formats.forEach(function(format) {
      var impressions = 0;

      that.props.impressions[that.props.datacenter].forEach(function (arr) {
        if (arr.format === format) {
          impressions += arr.impressions;
        }
      });

      data.push({
        name: format,
        value: impressions
      });
    });
      
    return data;
  }

  componentDidMount() {
    if (this.props.datacenter) {
      this.props.fetchImpressions(this.props.datacenter);
    }
  }

  graphType(event, value) {
    this.setState({LineType : value})
  }

  formatType(event, value) {
    this.setState({Format : value})
  }

  timeType(event, value) {
    this.setState({ TimeType: value })
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
    
    let timeSliceDuration = 10,
      formatter = ''

    switch(timeUnit) {
      case TimeUnits.MINUTES:
        timeSliceDuration = 10
        formatter = 'MMM Do HH:mm '
        break;
      case TimeUnits.HOUR:
        timeSliceDuration = 60
        formatter = 'MMM Do HH:mm'
        break;
      case TimeUnits.DAY:
        timeSliceDuration = 60 * 24
        formatter = 'MMM Do'
        break;
      case TimeUnits.WEEK:
        formatter = 'MMM Do'
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
          impressions: payload[payload.length - 1].impressions + impressions[i].impressions,
          timestamp: moment(impressions[i].timestamp).format(formatter).toString()
        }
      }
    }

    return payload
  }

  getImpressionOfSamePlatformAndFormat(impressions, specifiedFormat, specifiedPlatform) {
    return impressions.filter(({ format, platform }) =>
      format === specifiedFormat &&
      platform === specifiedPlatform)
  }

  getLineGraphData(props) {
    let lines = [
      this.getImpressionOfSamePlatformAndFormat(props.impressions[props.datacenter], this.state.Format, 'desktop'),
      this.getImpressionOfSamePlatformAndFormat(props.impressions[props.datacenter], this.state.Format, 'mobile'),
      this.getImpressionOfSamePlatformAndFormat(props.impressions[props.datacenter], this.state.Format, 'app')
    ]

    // aggregate impressions if needed.
    if (this.state.LineType === 'Aggregate') {
      lines = lines.map(this.getAggregatedImpressions)
    }

    // Aggregate by the correct time unit
    lines = lines.map(this.aggregateByTimeUnit.bind(this, this.state.TimeType))

    return this.getMultipleLines(lines)
  }

  render() {
    if (this.props.impressions && this.props.datacenter && this.props.impressions[this.props.datacenter ] ) {

      const platformData = this.formatPlatformImpressions();
      const formatData = this.formatFormatImpressions();

      return (
        <div>
          <div style={style.graphArea}>
            <LineGraph
                data={this.getLineGraphData(this.props)}
                lines={this.state.Format ? [
                  { dataKey: this.state.Format + 'desktop', color: 'rgba(0,188,212,1)' },
                  { dataKey: this.state.Format + 'mobile', color: 'rgba(103,58,183,1)'},
                  { dataKey: this.state.Format + 'app', color: 'rgba(255,152,0,1)'}
                ] : []}
                height={800}
                XAxis="timestamp"
                dataKey="impressions" />
            <div style={style.facets}>
              <LineType onChange={this.graphType.bind(this)}/>
              <Format onChange={this.formatType.bind(this)}/>
              <TimeFormatPicker onChange={this.timeType.bind(this)} />
            </div>
          </div>
            <PieGraph data={platformData}/>
            <PieGraph data={formatData}/>
              <TotalSpend 
                impressions={this.props.impressions}
              />  
              <TotalImpressions
                impressions={this.props.impressions}
              />
        </div>
      );
    } else {
      return (
        <CircularProgress />
      )
    }
  }
}

const style = {
  graphArea: {
    display: 'flex'
  },
  facets: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '200px'
  }
}

ImpressionAnalytics.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
}


export default ImpressionAnalytics;
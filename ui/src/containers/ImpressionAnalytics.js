import React, {Component} from 'react';

import PieGraph from './../components/graphs/PieChart'
import LineGraph from 'components/graphs/LineGraph'

import Row from './../components/Flex/Row'
import Col from './../components/Flex/Col'
import LineType from 'components/graphs/GraphRadioBox'
import Format from 'components/graphs/Format'

import TimeFormatPicker from 'components/graphs/TimeFormatPicker'

import TreeMap from './../components/graphs/TreeMap'

import deepmerge from 'deepmerge'
import _ from 'lodash'
import * as TimeUnits from '../constants/TimeUnits'






class ImpressionAnalytics extends Component {
  constructor() {
    super();
  }


  formatPlatformImpressions () {
    var data = [];
    const platforms = ['app', 'desktop', 'mobile']

    var that = this;
    platforms.forEach(function(platform) {
      var impressions = 0;

      that.props.impressions['NA'].forEach(function (arr) {
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

      that.props.impressions['NA'].forEach(function (arr) {
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
    var that = this
    this.props.fetchImpressions('NA').then(function (result) {
      that.determineXAxis()
    })
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

  getLineGraphData(props) {
    let lines = [
      this.getImpressionOfSamePlatformAndFormat(props.impressions['NA'], this.props.Format, 'desktop'),
      this.getImpressionOfSamePlatformAndFormat(props.impressions['NA'], this.props.Format, 'mobile'),
      this.getImpressionOfSamePlatformAndFormat(props.impressions['NA'], this.props.Format, 'app')
    ]

    // aggregate impressions if needed.
    if (this.props.LineType === 'Aggregate') {
      lines = lines.map(this.getAggregatedImpressions)
    }

    // Aggregate by the correct time unit
    lines = lines.map(this.aggregateByTimeUnit.bind(this, this.props.TimeType))
    
    return this.getMultipleLines(lines)
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

  

  render() {
    if (this.props.impressions && this.props.impressions['NA'] ) {

      const platformData = this.formatPlatformImpressions();
      const formatData = this.formatFormatImpressions();

      console.log(this.props)

      return (
        <div>
          <div>
            <LineType onChange={this.props.graphType.bind(this)}/>
            <Format onChange={this.props.formatType.bind(this)}/>
            <TimeFormatPicker onChange={this.props.timeType.bind(this)} />
            <LineGraph
              data={this.getLineGraphData(this.props)}
              lines={this.props.Format ? [
                { dataKey: this.props.Format + 'desktop', color: 'rgba(0,188,212,1)' },
                { dataKey: this.props.Format + 'mobile', color: 'rgba(103,58,183,1)'},
                { dataKey: this.props.Format + 'app', color: 'rgba(255,152,0,1)'}
              ] : []}
              XAxis="timestamp"
              width={1500}
              height={1000}
              dataKey="impressions" />
            <TreeMap servers={this.props.servers} fetchRequests={this.props.fetchRequests} dc="AS"/>
          </div>
          <div>
            <h1>Impression Analytics</h1>
            <Row>
              <PieGraph data={platformData}/>
              <PieGraph data={formatData}/>
              <Col>
                <TotalSpend 
                  impressions={this.props.impressions}
                />  
                <TotalImpressions
                  impressions={this.props.impressions}
                />
              </Col>
            </Row>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      )
    }
  }
}

class TotalSpend extends Component {
  calculateTotalSpend() {
    var total = 0;
    this.props.impressions['NA'].forEach(function (i) {
      total += i.spend;
    });
    return total;
  }

  render() {
    if (this.props.impressions && this.props.impressions['NA'] ) {
      const totalSpend = Math.round(this.calculateTotalSpend());

      return (
        <div>{ totalSpend } total cpm spent</div>
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }
  }
}

class TotalImpressions extends Component {
  calculateTotalImpressions() {
    var total = 0;
    this.props.impressions['NA'].forEach(function(i) {
      total += i.impressions;
    });
    return total;
  }

  render() {
    if (this.props.impressions && this.props.impressions['NA'] ) {
      const totalImpressions = this.calculateTotalImpressions();

      return (
        <div>{ totalImpressions } total impressions served</div>
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }
  }
}


export default ImpressionAnalytics;
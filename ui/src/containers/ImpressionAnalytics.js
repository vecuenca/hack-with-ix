import React, {Component} from 'react';
import PieGraph from './../components/graphs/PieChart'
import Row from './../components/Flex/Row'
import Col from './../components/Flex/Col'

import * as TimeUnits from '../constants/TimeUnits'

import CircularProgress from 'material-ui/CircularProgress';
import TotalSpend from '../components/impression/TotalSpend'
import TotalImpressions from '../components/impression/TotalImpresion'
import MostPopularPlatform from '../components/impression/MostPopularPlatform'

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
    let aggregatedImpressions = [],
      sum = 0
    
    impressions.forEach((record, i) => {
      sum += record.impressions

      aggregatedImpressions.push({
        ...record,
        impressions: sum
      })
    })

    // console.log(aggregatedImpressions)

    return aggregatedImpressions

    // return impressions.reduce((acc, impressRecord) => {
    //   return acc.concat([ {
    //     ...impressRecord,
    //     impressions: acc.length > 0 ? acc[acc.length -1].impressions + impressRecord.impressions : impressRecord.impressions
    //   }])
    // }, [])
  }

  formatTimestamp(timeUnit, impressions) {
    if (impressions.length === 0) return []

    let formatter = ''

    switch(timeUnit) {
      case TimeUnits.MINUTES:
        formatter = 'MMM Do HH:mm '
        break;
      case TimeUnits.HOUR:
        formatter = 'MMM Do HH:mm'
        break;
      case TimeUnits.DAY:
        formatter = 'MMM Do'
        break;
      case TimeUnits.WEEK:
        formatter = 'MMM Do'
        break;
      default:
        console.error("Uh oh... what kind of time unit did you pass in... I don't recognize it")
    }
    
    return impressions.map(record => {
      return {
        ...record,
        timestamp: moment(record.timestamp).format(formatter).toString()
      }
    })
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
    lines = lines.map(this.formatTimestamp.bind(this, this.state.TimeType))

    return this.getMultipleLines(lines)
  }

  render() {
    if (this.props.impressions && this.props.datacenter && this.props.impressions[this.props.datacenter ] ) {

      const platformData = this.formatPlatformImpressions();
      const formatData = this.formatFormatImpressions();

      return (
        <div>
          <div className="intro--section">
            <h2 className="title">Key Performance Indicators</h2>
            <div className="triple--value-prop">
              <TotalSpend
                impressions={this.props.impressions}
                datacenter={this.props.datacenter}
              />
              <MostPopularPlatform
                impressions={this.props.impressions}
                datacenter={this.props.datacenter}>
              </MostPopularPlatform>
              <TotalImpressions
                impressions={this.props.impressions}
                datacenter={this.props.datacenter}
              />
            </div>
          </div>
          <h2 style={{ textAlign: 'center' }}>Impression over Time</h2>
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
              <div className="line--field-set">
                <div className="line--label">
                  <label htmlFor="">Legend</label>
                </div>
                <div style={style.legend}>
                  <div style={style.legendColor1}></div>
                  <label>Desktop</label>
                </div>
                <div style={style.legend}>
                  <div style={style.legendColor2}></div>
                  <label htmlFor="">Mobile</label>
                </div>
                <div style={style.legend}>
                  <div style={style.legendColor3}></div>
                  <label htmlFor="">Application</label>
                </div>
              </div>
            </div>
          </div>
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
    display: 'flex',
    marginBottom: '50px'
  },
  facets: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '200px'
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '5px',
    marginBottom: '5px'
  },
  legendColor1: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    marginRight: '16px',
    backgroundColor: 'rgba(0,188,212,1)'
  },
  legendColor2: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    marginRight: '16px',
    backgroundColor: 'rgba(103,58,183,1)'
  },
  legendColor3: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    marginRight: '16px',
    backgroundColor: 'rgb(255, 152, 0)'
  }
}

ImpressionAnalytics.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
}


export default ImpressionAnalytics;

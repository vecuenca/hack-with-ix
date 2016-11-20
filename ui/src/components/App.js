// Dependencies

import React, { Component } from 'react'

// Components

import { Center } from 'components/Flex'

import TreeMap from './graphs/TreeMap'

import LineType from 'components/graphs/GraphRadioBox'
import LineGraph from 'components/graphs/LineGraph'
import Format from 'components/graphs/Format'



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
    const desktopVideos = this
          .getImpressionOfSamePlatformAndFormat(props.impressions['NA'], this.state.Format, 'desktop')

    const aggregatedDesktopVideos = this.getAggregatedImpressions(desktopVideos)

    // console.log(desktopVideos.map(({ timestamp }) => moment(timestamp).toDate()))

    if (this.state.LineType === 'Discrete') {
      return desktopVideos
    } else {
      return this.getAggregatedImpressions(desktopVideos)
    }
  }

  render () {

    if (this.props.impressions && this.props.impressions['NA']) {
      return (
        <div>
          <LineType onChange={this.graphType.bind(this)}/>
          <Format onChange={this.formatType.bind(this)}/>
          <LineGraph
            data={this.getLineGraphData(this.props)}
            XAxis="timestamp"
            width={1000}
            height={1000}
            dataKey="impressions" />
            <TreeMap servers={this.props.servers} fetchRequests={this.props.fetchRequests} dc="AS"/>
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

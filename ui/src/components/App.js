// Dependencies

import React, { Component } from 'react'

import * as TimeUnits from '../constants/TimeUnits'

// Components

import { Center } from 'components/Flex'

import ImpressionAnalytics from './../containers/ImpressionAnalytics'


import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import moment from 'moment'

export default class App extends Component {
  constructor () {
    super()

    this.state = {
      LineType: null,
      Format: null,
      TimeType: TimeUnits.HOUR
    }
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) }
  }

  graphType(event, value) {
    console.log(value)
    this.setState({LineType : value})
  }

  formatType(event, value) {
    console.log(value)
    this.setState({Format : value})
  }

  timeType(event, value) {
    console.log(value)
    this.setState({ TimeType: value })
  }

  render () {
    return (
      <div>
        <ImpressionAnalytics
          impressions={this.props.impressions}
          servers={this.props.servers}
          format={this.state.Format}
          LineType={this.state.LineType}
          TimeType={this.state.TimeType}
          fetchImpressions={this.props.fetchImpressions.bind(this)}
          fetchRequests={this.props.fetchRequests.bind(this)}
          graphType={this.graphType.bind(this)}
          formatType={this.formatType.bind(this)}
          timeType={this.timeType.bind(this)}
        />
      </div>    
    )
  }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
}

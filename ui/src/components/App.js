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
      NA: true,
      Asia: false,
      Europe: false,
      datacenter: null
    }
  }

  componentDidMount() {
    var that = this
    this.props.fetchImpressions('NA')
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) }
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
      if (!this.props.servers[value]) {
        this.props.fetchImpressions(value)
      }
  }
  
  render () {
    const iconStyles = {
      marginRight: 24,
      width: 100,
      height: "auto"
    };

    return (
      <div style={{ width: '100%' }}>
        <Toolbar style={{ width: '100%' }}>
          <DashBoard style={iconStyles} />
          <FlatButton label="North America" primary = {this.state.NA} onClick = {() => {this.handleChange('NA')}}/>
          <FlatButton label="Asia" primary = {this.state.Asia} onClick = {() => {this.handleChange('AS')}}/>
          <FlatButton label="Europe" primary = {this.state.Europe} onClick = {() => {this.handleChange("EU")}} />
        </Toolbar>
        {
          this.props.impressions && this.state.datacenter && this.props.impressions[this.state.datacenter] ? 
            <div style={{ width: '100%' }}>
              <LineType onChange={this.graphType.bind(this)}/>
              <Format onChange={this.formatType.bind(this)}/>
              <TimeFormatPicker onChange={this.timeType.bind(this)} />
              <LineGraph
                data={this.getLineGraphData(this.props)}
                lines={this.state.Format ? [
                  { dataKey: this.state.Format + 'desktop', color: 'rgba(0,188,212,1)' },
                  { dataKey: this.state.Format + 'mobile', color: 'rgba(103,58,183,1)'},
                  { dataKey: this.state.Format + 'app', color: 'rgba(255,152,0,1)'}
                ] : []}
                XAxis="timestamp"
                width={1500}
                height={1000}
                dataKey="impressions" />
                <TreeMap servers={this.props.servers} fetchRequests={this.props.fetchRequests} dc="NA"/>
            </div>
            :
            <div>"Loading..."</div>
        }
      </div>
    )
  }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
}

// Dependencies

import React, { Component } from 'react'

import * as TimeUnits from '../constants/TimeUnits'

// Components

import _ from 'lodash'

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


import Tabs from '../components/common/Tabs'
import Tab from '../components/common/Tab'

import FlatButton from 'material-ui/FlatButton';

import withData from '../hocs/withData'

class App extends Component {
  constructor () {
    super()

    this.handleDataCenterChange = this.handleDataCenterChange.bind(this)
    this.onClickImpressions = this.onClickImpressions.bind(this)
    this.onClickPerformance = this.onClickPerformance.bind(this)

    this.state = {
      datacenter: 'NA'
    }
  }

  componentDidMount() {
    var that = this
    this.props.fetchImpressions('NA')
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) }
  }

  handleDataCenterChange = value => {
    this.props.fetchImpressions(value).then(impressions => {
      this.setState({ datacenter: value })
    })
  };

  getDataCenterSelector() {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p>Data Center:</p>      
        <div style={{ display: 'flex', alignItems: 'center' }} >
          <FlatButton primary={this.state.datacenter === "NA"} label="NA" onClick={this.handleDataCenterChange.bind(this, "NA")}></FlatButton>
          <FlatButton primary={this.state.datacenter === "EU"} label="EU" onClick={this.handleDataCenterChange.bind(this, "EU")}></FlatButton>
          <FlatButton primary={this.state.datacenter === "AS"} label="AS" onClick={this.handleDataCenterChange.bind(this, "AS")}></FlatButton>
        </div>
      </div>
    )
  }

  onClickImpressions() {
    this.props.history.push('/impressions')
  }

  onClickPerformance() {
    this.props.history.push('/performance')
  }

  render () {
    return (
      <div style={{ width: '100%' }}>
        <div className="app--header">
          <Tabs value={this.props.location.pathname} rightItem={this.getDataCenterSelector()}>
            <Tab label="Impressions" value="/impressions" onClick={this.onClickImpressions}  />
            <Tab label="Server Performance" value="/performance" onClick={this.onClickPerformance} />
          </Tabs>
        </div>
        {
            React.cloneElement(this.props.children, { ...this.props, datacenter: this.state.datacenter, selectedTreeMapRegion: this.state.selectedTreeMapRegion },
            this.props.children.props.children)
        }
      </div>
    )
  }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
}

export default withData(App)
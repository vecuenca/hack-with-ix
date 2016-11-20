// Dependencies

import React, { Component } from 'react'

// Components

import { Center } from 'components/Flex'

import TreeMap from './graphs/TreeMap'

export default class App extends Component {
  constructor () {
    super()
  }



  render () {
    return (
      <Center>
        <h1>Hello there! Time to get started.</h1>
        <button onClick={this.props.fetchServers}>hai</button>
        <TreeMap servers={this.props.servers} fetchRequests={this.props.fetchRequests} dc="AS"/>
      </Center>
    )
  }
}

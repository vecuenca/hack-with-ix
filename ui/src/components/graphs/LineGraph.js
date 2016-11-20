import React, { Component } from 'react'


import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, Brush } from 'recharts'


export default class LineGraph extends Component {
  render() {
    return (
      <LineChart width={this.props.width} height={this.props.height} data={this.props.data} syncId={this.props.syncId}
          margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <XAxis dataKey={this.props.XAxis}/>
          <YAxis/>
          <CartesianGrid strokeDasharray="2 3"/>
          <Tooltip/>
          <Line type='monotone' dataKey={this.props.dataKey} stroke='#8884d8' fill='#8884d8' />
      </LineChart>
    )
  }
}

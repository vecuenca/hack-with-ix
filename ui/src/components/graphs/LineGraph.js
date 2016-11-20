import React, { Component } from 'react'


import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, Brush, Legend } from 'recharts'


export default class LineGraph extends Component {
  render() {
    return (
      <LineChart width={this.props.width} height={this.props.height} data={this.props.data} syncId={this.props.syncId}
          margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <XAxis dataKey={this.props.XAxis}/>
          <YAxis/>
          <CartesianGrid strokeDasharray="2 3"/>
          <Tooltip/>
          {
            this.props.lines.map(({ dataKey, color }) => {
              return <Line type='monotone' dataKey={dataKey} stroke={color} fill={color} />
            })
          }
          <Brush></Brush>
          <Legend></Legend>
      </LineChart>
    )
  }
}
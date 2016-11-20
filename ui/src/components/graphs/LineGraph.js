import React, { Component } from 'react'


import { LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Line, Brush, Legend } from 'recharts'


export default class LineGraph extends Component {
  render() {
    return (
      <ResponsiveContainer width={this.props.width} height={this.props.height}>
        <LineChart data={this.props.data} syncId={this.props.syncId}
            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
            <XAxis dataKey={this.props.XAxis}/>
            <YAxis tickFormatter = {(input) => {return input/1000000 + "M"}}/>
            <CartesianGrid strokeDasharray="2 3"/>
            <Tooltip/>
            {
              this.props.lines.map(({ dataKey, color }) => {
                return <Line type='monotone' dataKey={dataKey} stroke={color} fill={color} />
              })
            }
            <Brush></Brush>
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

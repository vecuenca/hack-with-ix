import React, { Component } from 'react'
import { PieChart, Pie, Sector, Cell } from 'recharts'

// format of data
const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 600},
                  {name: 'Group C', value: 300}, {name: 'Group D', value: 200}];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;   
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
 
  return (
    <text name={name} x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
      { name }
    </text>
  );
};

export default class PieGraph extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <PieChart width={1000} height={1000} onMouseEnter={this.onPieEnter}>
        <Pie
        data={this.props.data}
        cx={300} 
        cy={200} 
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={150} 
        fill="#8884d8"
        >
        {
          data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
        }
        </Pie>
      </PieChart>
    );
  }
}
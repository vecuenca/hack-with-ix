// Dependencies

import React, { Component } from 'react'
import { Treemap } from 'recharts'

const data = [
          {
            name: 'serverHealth',
            children: [
              { name: 'NA0001', size: 1302, fill: "GREY" },
              { name: 'NA0002', size: 24593, fill: "RED" },
              { name: 'NA0003', size: 652, fill: "ORANGE" },
              { name: 'NA0004', size: 636, fill: "YELLOW" },
              { name: 'NA0005', size: 67203, fill: "GREEN" },
            ],
          }
        ];


class DemoTreemapItem extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { root, depth, x, y, width, height, rank, name, fill, selected } = this.props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          stroke={selected === name ? "BLUE" : "BLACK"}
          strokeWidth={selected === name ? 5 : 2}
          strokeOpacity={selected === name ? 1 : 0.5}
        />
        {
          <text
            x={x + width / 2}
            y={y + height / 2 + 9}
            textAnchor="middle"
            fill={selected === name ? "WHITE" : "BLACK"}
            stroke="none"
            fontSize={18}
          >
            {name}
          </text>
        }
      </g>
    );
  }
}

export default class TreeMap extends Component {

  onNodeClick(node) {
    console.log(node);
  }
  
  render () {
    return (
        <Treemap
            width={730}
            height={250}
            data={data}
            dataKey="size"
            ratio={4/3}
            stroke="BLACK"
            content={<DemoTreemapItem selected="NA0005" />}
            onClick={this.onNodeClick}
        />
    )
  }
}

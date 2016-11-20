// Dependencies

import React, { Component } from 'react'
import { Treemap } from 'recharts'
import CircularProgressLoad from '../CircularProgressLoad'


class TreemapItem extends Component {

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

{/*const data = [
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

{
  "message": "OK",
  "data": [
    {
      "dc":"NA",
      "id":"NA0001",
      "online":1427745960000,
      "status":"GREEN"
    },
    {
      "dc":"NA",
      "id":"NA0002",
      "online":1427747460000,
      "status":"GREEN"
    },
    {
      "dc":"EU",
      "id":"EU0004",
      "online":1455361020000,
      "status":"ORANGE"
    }
  ]
}*/}

function formatData(rawData, fetchRequests) { 

  if (rawData == null) {
    return [];
  }


  const promises = rawData.map((d) => {

    return fetchRequests(d.dc, d.id).then(res => {
      return {
        name: d.id,
        fill: d.status,
        size: res,
        dc: d.dc,
      }
    });


  });

 return Promise.all(promises).then(function(res) {
   return res;
 });
 
}



export default class TreeMap extends Component {

  constructor(props) {
    super(props);
  }

  onNodeClick(node) {
    this.setState({selectedTreeMapRegion: node.name})
  }

  render () {
    if (Object.keys(this.props.servers).length === 0) {
      return (<CircularProgressLoad text="Loading Server Health..." />)
    }
    if (this.state != null && this.state.treeMapResults != null) {
      const resultsData = this.state.treeMapResults.filter((result) => {
        return result.dc === this.props.datacenter
      })
      return (
          <Treemap
              width={730}
              height={250}
              data={resultsData}
              dataKey="size"
              ratio={4/3}
              stroke="BLACK"
              content={<TreemapItem selected={this.state.selectedTreeMapRegion} />}
              onClick={this.onNodeClick.bind(this)}
          />
      )
    } else {
      formatData(this.props.servers, this.props.fetchRequests).then(r => {
          this.setState({treeMapResults: r})
      })

      return (
        <CircularProgressLoad text="Loading Server Health..." />
      )
    }
  }
}

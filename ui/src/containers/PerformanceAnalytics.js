import React, {Component} from 'react';
import PieGraph from './../components/graphs/PieChart'
import LineGraph from './../components/graphs/LineGraph'
import moment from 'moment'
import TreeMap from './../components/graphs/TreeMap'

class PerformanceAnalytics extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPerformance('NA', 'ALL');
    //this.props.fetchPerformancePaginate('NA', 'ALL', moment().add(-7, 'days').valueOf());
  }

  getResponseData() {
    var data = [
      {name: '< 0.01s', value: 0},
      {name: '0.01-0.1s', value: 0},
      {name: '0.1-1s', value: 0},
      {name: '> 1s', value: 0},
    ];

    //console.log(this.props);
    this.props.performance['NA']['ALL'].forEach(function(perf) {
      for (var i = 0; i < 4; i++) {
        data[i].value += perf.timing[i];
      }
    });

    return data;
  }


  render() {
    if (this.props.performance && this.props.performance['NA']) {
      const responseData = this.getResponseData();
      
      //console.log(this.props.performancePage['NA']);

      return (
        <div>
            <h1>Performance Analytics</h1>
            <TreeMap servers={this.state.servers} datacenter={this.state.datacenter} />
            <PieGraph data={responseData}/>
            <LineGraph
              data={this.props.performance['NA'].ALL}
              XAxis="timestamp"
              lines={[{ dataKey: "requests", color: 'rgba(0,188,212,1)' }]} 
              width={1500}
              height={1000}
              dataKey="requests" />
        </div>
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      )
    }
  }
}

export default PerformanceAnalytics;
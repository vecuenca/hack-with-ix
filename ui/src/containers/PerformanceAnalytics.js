import React, {Component} from 'react';
import PieGraph from './../components/graphs/PieChart'

class PerformanceAnalytics extends Component {
  componentDidMount() {
    this.props.fetchPerformance('NA', 'ALL');
  }

  getResponseData() {
    var data = [
      {name: '< 0.01s', value: 0},
      {name: '0.01-0.1s', value: 0},
      {name: '0.1-1s', value: 0},
      {name: '> 1s', value: 0},
    ];

    console.log(this.props);
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
      
      return (
        <div>
            <h1>Performance Analytics</h1>
            <PieGraph data={responseData}/>
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
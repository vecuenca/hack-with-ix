import React, {Component} from 'react';
import PieGraph from './../components/graphs/PieChart'
import LineGraph from './../components/graphs/LineGraph'
import moment from 'moment'
import TreeMap from './../components/graphs/TreeMap'
import { Row, Col } from 'react-flexbox-grid'

import ValueProp from '../components/common/ValueProp'

class PerformanceAnalytics extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTreeMapRegion: null
    }
  }

  componentDidMount() {
    this.props.fetchPerformance('NA', 'ALL');
    //this.props.fetchPerformancePaginate('NA', 'ALL', moment().add(-7, 'days').valueOf());
  }

  calculateAverageLag() {
    if (!this.state.selectedTreeMapRegion) return null 

    var avgLag = 0;
    var arr = this.props.performance[this.props.datacenter][this.state.selectedTreeMapRegion];
    arr.forEach(function (perf) {
      avgLag += perf.lag;
    });
    return avgLag / arr.length;
  }

  calculateAverageResponseTime() {
    var avgResp = 0;
    if (this.state.selectedTreeMapRegion == null) {
      return null;
    }
    var arr = this.props.performance[this.props.datacenter][this.state.selectedTreeMapRegion];
    arr.forEach(function (perf) {
      avgResp += perf.mean;
    });
    return avgResp / arr.length;
  }

  calculateAverageNumWarningMessages() {
    var avgWarnings = 0;
    if (this.state.selectedTreeMapRegion == null) {
      return null;
    }
    var arr = this.props.performance[this.props.datacenter][this.state.selectedTreeMapRegion];
    arr.forEach(function (perf) {
      avgWarnings += perf.warns;
    });
    return avgWarnings / arr.length;
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
  test(treeRegion) {
    console.log(treeRegion)
    this.props.fetchPerformance(this.props.datacenter, treeRegion).then(() => {
      this.setState({selectedTreeMapRegion: treeRegion});
    })
  }

  render() {
    if (this.props.performance && this.props.performance['NA']) {
      const responseData = this.getResponseData();

      //console.log(this.props.performancePage['NA']);

      var onlineTime;

      if (this.state.selectedTreeMapRegion) {
        console.log(this.props.performance[this.props.datacenter], '1')
        console.log(this.props.performance[this.props.datacenter][this.state.selectedTreeMapRegion], '2')
        const server = this.props.servers.find((ele) => {
          return ele.id === this.state.selectedTreeMapRegion;
        })

        if (server != null) {
          onlineTime = server.online;
          console.log(onlineTime);
        }
      }




      return (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ textAlign: 'center' }}>Server Status</h2>
            <h3 style={{ textAlign: 'center', color: '#929292' }}>Select a server to view it's performance</h3>
            <Row center="xs">
              <TreeMap servers={this.props.servers} callback={this.test.bind(this)} datacenter={this.props.datacenter} fetchRequests={this.props.fetchRequests} />
            </Row>
          </div>
          {
            this.state.selectedTreeMapRegion ?
              <div>
                <div className="intro--section">
                  <h2 className="title">Performance Overview {`for ${this.state.selectedTreeMapRegion}`} </h2>
                  <div className="triple--value-prop">
                    <ValueProp bigValue={this.calculateAverageLag()} postText="Average Lag"></ValueProp>
                    <ValueProp bigValue={this.calculateAverageResponseTime()} postText="Average response time"></ValueProp>
                    <ValueProp bigValue={this.calculateAverageNumWarningMessages()} postText="Average warning messages"></ValueProp>
                  </div>
                </div>
                <Row>
                  	<h2>Server: {this.state.selectedTreeMapRegion}</h2>
                	<h3>Online since: {moment(onlineTime, "x").fromNow()}</h3>
                </Row>
                 <PieGraph data={responseData}/>
                  {
                    this.state.selectedTreeMapRegion ? 
                      <LineGraph
                        data={this.props.performance[this.props.datacenter][this.state.selectedTreeMapRegion]}
                        XAxis="timestamp"
                        lines={[{ dataKey: "requests", color: 'rgba(0,188,212,1)' }]} 
                        width={1500}
                        height={1000}
                        dataKey="requests" /> :
                      undefined
                  }
                  {
                    this.state.selectedTreeMapRegion ? 
                      <LineGraph
                        data={this.props.performance[this.props.datacenter][this.state.selectedTreeMapRegion]}
                        XAxis="timestamp"
                        lines={[{ dataKey: "warns", color: 'rgba(0,188,212,1)' }]} 
                        width={1500}
                        height={1000}
                        dataKey="warns" /> :
                      undefined
                  }
              </div>
              :
              undefined
          }
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
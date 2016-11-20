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
    return Math.round(avgLag / arr.length) + "ms";
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
    return Math.round((avgResp / arr.length) * 100) / 100;
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
    return Math.round(avgWarnings / arr.length);
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
            <h2 style={{ textAlign: 'center', marginTop: '40px', marginBottom: 0 }}>Server Status</h2>
            <h3 style={{ textAlign: 'center', color: '#929292', marginTop: '10px' }}>Select a server to view it's performance</h3>
            <Row center="xs">
              <TreeMap servers={this.props.servers} callback={this.test.bind(this)} datacenter={this.props.datacenter} fetchRequests={this.props.fetchRequests} />
            </Row>
          </div>
          {
            this.state.selectedTreeMapRegion ?
              <div>
                <div className="intro--section">
                  <h2 className="title" style={{ marginBottom: 0 }}>Performance Overview {`for ${this.state.selectedTreeMapRegion}`} </h2>
                  <h3 style={{ color: '#929292', marginTop: '10px' }}>Online since: {moment(onlineTime, "x").fromNow()}</h3>
                  <div className="triple--value-prop">
                    <ValueProp bigValue={this.calculateAverageLag()} postText="Average Lag"></ValueProp>
                    <ValueProp bigValue={this.calculateAverageResponseTime()} postText={<span>Average response<br />time</span>}></ValueProp>
                    <ValueProp bigValue={this.calculateAverageNumWarningMessages()} postText={<span>Average warning<br />messages</span>}></ValueProp>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
					<div style={{ flex: '1 1 0%', marginRight: '10px' }}>
						<h2>Requests over time</h2>
						<LineGraph
							data={this.props.performance[this.props.datacenter][this.state.selectedTreeMapRegion]}
							XAxis="timestamp"
							lines={[{ dataKey: "requests", color: 'rgba(0,188,212,1)' }]}
							height={500} 
							dataKey="requests" />
					</div>
					<div style={{ flex: '1 1 0%', marginLeft: '10px' }}>
						<h2>Warnings over time</h2>
						<LineGraph
							data={this.props.performance[this.props.datacenter][this.state.selectedTreeMapRegion]}
							XAxis="timestamp"
							lines={[{ dataKey: "warns", color: 'rgba(0,188,212,1)' }]} 
							height={500}
			                dataKey="warns" />
					</div>
                </div>

                <h2>Responses breakdown</h2>
                <PieGraph data={responseData}/>
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
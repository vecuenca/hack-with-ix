import React, {Component} from 'react';
import PieGraph from './../components/graphs/PieChart'
import Row from './../components/Flex/Row'
import Col from './../components/Flex/Col'

class ImpressionAnalytics extends Component {

  formatPlatformImpressions () {
    var data = [];
    const platforms = ['app', 'desktop', 'mobile']

    var that = this;
    platforms.forEach(function(platform) {
      var impressions = 0;

      that.props.impressions['NA'].forEach(function (arr) {
        if (arr.platform === platform) {
          impressions += arr.impressions;
        }
      });

      data.push({
        name: platform,
        value: impressions
      });
    });
      
    return data;
  }

  formatFormatImpressions () {
    var data = [];
    const formats = ['banner', 'video'];

    var that = this;
    formats.forEach(function(format) {
      var impressions = 0;

      that.props.impressions['NA'].forEach(function (arr) {
        if (arr.format === format) {
          impressions += arr.impressions;
        }
      });

      data.push({
        name: format,
        value: impressions
      });
    });
      
    return data;
  }

  componentDidMount() {
    this.props.fetchImpressions('NA');
  }

  render() {
    if (this.props.impressions && this.props.impressions['NA'] ) {

      const platformData = this.formatPlatformImpressions();
      const formatData = this.formatFormatImpressions();

      return (
        <div>
          <h1>Impression Analytics</h1>
          <Row>
            <PieGraph data={platformData}/>
            <PieGraph data={formatData}/>
            <Col>
              <TotalSpend 
                impressions={this.props.impressions}
              />  
              <TotalImpressions
                impressions={this.props.impressions}
              />
            </Col>
          </Row>
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

class TotalSpend extends Component {
  calculateTotalSpend() {
    var total = 0;
    this.props.impressions['NA'].forEach(function (i) {
      total += i.spend;
    });
    return total;
  }

  render() {
    if (this.props.impressions && this.props.impressions['NA'] ) {
      const totalSpend = Math.round(this.calculateTotalSpend());

      return (
        <div>{ totalSpend } total cpm spent</div>
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }
  }
}

class TotalImpressions extends Component {
  calculateTotalImpressions() {
    var total = 0;
    this.props.impressions['NA'].forEach(function(i) {
      total += i.impressions;
    });
    return total;
  }

  render() {
    if (this.props.impressions && this.props.impressions['NA'] ) {
      const totalImpressions = this.calculateTotalImpressions();

      return (
        <div>{ totalImpressions } total impressions served</div>
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }
  }
}


export default ImpressionAnalytics;
import React, {Component} from 'react';
import PieGraph from './../components/graphs/PieChart'

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

  componentDidMount() {
    this.props.fetchImpressions('NA');
  }

  render() {
    console.log(this.props);
    if (this.props.impressions && this.props.impressions['NA'] ) {
      const data = this.formatPlatformImpressions();
      return (
          <div>
            <h1>Impression Analytics</h1>
            <PieGraph data={data}/>
          </div>
      )
    } else {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      )
    }
  }
}

export default ImpressionAnalytics;
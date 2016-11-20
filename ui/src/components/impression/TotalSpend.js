import React, {Component} from 'react';

class TotalSpend extends Component {
  calculateTotalSpend() {
    var total = 0;
    var counter = 0;
    this.props.impressions['NA'].forEach(function (i) {
      counter+=1;
      total += i.spend;
    });
    return total/counter;
  }
  calculateTotalImpressions() {
    var total = 0;
    this.props.impressions['NA'].forEach(function(i) {
      total += i.impressions;
    });
    return total;
  }

  render() {
    if (this.props.impressions && this.props.impressions['NA'] ) {
      const totalSpend = Math.round(this.calculateTotalSpend());
      const totalImpressions = Math.round(this.calculateTotalImpressions());

      const totalMONEY = (totalSpend * (totalImpressions / 1000))/ 100;

      return (
        <div> Approximately {Math.round(totalMONEY/1000000)}M$ Dollars Spent on advertising!</div>
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

export default TotalSpend

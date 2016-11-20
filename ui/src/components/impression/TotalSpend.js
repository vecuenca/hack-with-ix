import React, {Component} from 'react';

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

export default TotalSpend
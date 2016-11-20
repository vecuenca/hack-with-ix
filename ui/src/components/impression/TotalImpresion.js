import React, {Component} from 'react';

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
        <div>Approximately { Math.round(totalImpressions / 1000000)}M total impressions served!</div>
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

export default TotalImpressions

import React, {Component} from 'react';

class TotalSpend extends Component {
  calculateTotalSpend() {
    var total = 0;
    var counter = 0;
    this.props.impressions[this.props.datacenter].forEach(function (i) {
      counter+=1;
      total += i.spend;
    });
    return total/counter;
  }
  calculateTotalImpressions() {
  var total = 0;
    this.props.impressions[this.props.datacenter].forEach(function(i) {
      total += i.impressions;
    });
    return total;
  }

  render() {
    if (this.props.impressions && this.props.impressions[this.props.datacenter] ) {
      const totalSpend = Math.round(this.calculateTotalSpend());
      const totalImpressions = Math.round(this.calculateTotalImpressions());

      const totalMONEY = (totalSpend * (totalImpressions / 1000))/ 100;

      return (
        <div style={style.root}>
          <p style={style.bigValue}>{Math.round(totalMONEY/1000000)}M</p>
          <p style={style.postText}>Dollars Spent<br /> on advertising</p>
        </div>
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

const style = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
  },
  preText: {
    fontSize: '15px',
    color: '#929292'
  },
  postText: {
    fontSize: '15px',
    color: '#929292',
    marginTop: '5px'
  },
  bigValue: {
    fontSize: '40px',
    margin: 0,
    color: 'rgba(0,0,0,.8)'
  }
}

export default TotalSpend

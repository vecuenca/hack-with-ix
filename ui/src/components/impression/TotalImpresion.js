import React, {Component} from 'react';

class TotalImpressions extends Component {
  calculateTotalImpressions() {
    var total = 0;
    this.props.impressions[this.props.datacenter].forEach(function(i) {
      total += i.impressions;
    });
    return total;
  }

  render() {
    if (this.props.impressions && this.props.impressions[this.props.datacenter] ) {
      const totalImpressions = this.calculateTotalImpressions();

      return (
        <div style={style.root}>
          <p style={style.bigValue}>{Math.round(totalImpressions / 1000000)}M</p>
          <p style={style.postText}>total impressions<br /> served</p>
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

export default TotalImpressions

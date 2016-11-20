import React, {Component} from 'react';

class ValueProp extends Component {
  render() {
    if (this.props.bigValue) {
      return (
        <div style={style.root}>
          <p style={style.bigValue}>{this.props.bigValue}</p>
          <p style={style.postText}>{this.props.postText}</p>
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

export default ValueProp

import React, {Component} from 'react';

class MostPopularPlatform extends Component {
  
  getMostPopularPlatform() {

    var desktopCounter = 0,
        mobileCounter = 0,
        appCounter = 0

    this.props.impressions[this.props.datacenter].forEach(function (i) {
      if (i.platform === 'desktop') {
          desktopCounter+=1
      } else if (i.platform === 'mobile') {
          mobileCounter+=1
      } else if (i.platform === 'app') {
          appCounter+=1
      } else {
          console.error("... unknown platform")
      }
    });
    
    if (desktopCounter >= mobileCounter && desktopCounter >= appCounter) {
        return "Desktop"
    } else if (mobileCounter >= desktopCounter && mobileCounter >= appCounter) {
        return "Mobile"
    } else if (appCounter >= desktopCounter && appCounter >= mobileCounter) {
        return "Application"
    } else {
        console.error("... unknown platform")
        return "oops :D"
    }
    
  }
  

  render() {
    if (this.props.impressions && this.props.impressions[this.props.datacenter] ) {
      return (
        <div style={style.root}>
          <p style={style.bigValue}>{this.getMostPopularPlatform()}</p>
          <p style={style.postText}>Most popular<br /> platform</p>
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

export default MostPopularPlatform

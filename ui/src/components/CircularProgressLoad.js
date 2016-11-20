import React, { Component } from 'react'
import CircularProgress from 'material-ui/CircularProgress';

export default class CircularProgressLoad extends Component {
    
 render() {
  return (
    <div>
      <CircularProgress size={80} thickness={5} />
      <h3>{this.props.text}</h3>
    </div>
  )
 }
}
// Dependencies

import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import { Row, Col } from 'react-flexbox-grid'; 

export default class IconPanel extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
        <div>
            <Paper style={{backgroundColor:this.props.bgColor}} zDepth={2}>
                <Row center="xs">
                  <Col>
                    <FontIcon className="material-icons" style={{marginTop: 7, color:this.props.iconColor}}>{this.props.icon}</FontIcon>
                    <p style={{fontWeight:"bold"}}>{this.props.text}</p>
                  </Col>
                </Row>
            </Paper>
        </div>
    )
  }
}

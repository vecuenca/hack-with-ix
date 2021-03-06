import React, {Component} from 'react'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import ActionFavorite from 'material-ui/svg-icons/action/favorite'
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border'

const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
};

export default class LineType extends Component {
  render () {
    return (
      <div className="line--field-set">
          <div className="line--label">
            <label>Line Type</label>
        </div>

          <RadioButtonGroup name="Line Type" defaultSelected="Aggregate" onChange={this.props.onChange}>
            <RadioButton value="Aggregate" label="Aggregate" styles = {styles.radioButton}/>
            <RadioButton value="Discrete" label="Discrete" styles = {styles.radioButton}/>
          </RadioButtonGroup>
      </div>
    )
  }
}

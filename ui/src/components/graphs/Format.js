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

export default class Format extends Component {
  render () {
    return (
      <div className="line--field-set">
          <div className="line--label">
            <label>Format</label>
          </div>

          <RadioButtonGroup name="Formats" defaultSelected="video" onChange={this.props.onChange}>
            <RadioButton value="video" label="Video" styles = {styles.radioButton}/>
            <RadioButton value="banner" label="Banner" styles = {styles.radioButton}/>
          </RadioButtonGroup>
      </div>
    )
  }
}

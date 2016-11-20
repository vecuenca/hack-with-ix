

import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

import * as TimeUnits from '../../constants/TimeUnits' 

const TimeFormatPicker = ({ onChange }) => {
    return (
        <div>
            <fieldset>
            <legend> <u>Time Unit</u> </legend>
            <RadioButtonGroup name="Line Type" defaultSelected="hour" onChange={onChange}>
                <RadioButton value={TimeUnits.MINUTES} label="Ten Minutes" styles = {styles.radioButton}/>
                <RadioButton value={TimeUnits.HOUR} label="Hour" styles = {styles.radioButton}/>
                <RadioButton value={TimeUnits.DAY} label="Day" styles = {styles.radioButton}/>
                <RadioButton value={TimeUnits.WEEK} label="Week" styles = {styles.radioButton}/>
            </RadioButtonGroup>
            </fieldset>
      </div>
    );
};

const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
};

export default TimeFormatPicker;
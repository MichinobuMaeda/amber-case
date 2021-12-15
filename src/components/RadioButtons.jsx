import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

export class RadioButtonsItem {
  constructor({ label, value }) {
    this.label = label;
    this.value = value;
  }
}

const RadioButtons = ({
  'aria-label': ariaLabel, legend, items, value, onChange,
}) => (
  <FormControl component="fieldset" aria-label={ariaLabel}>
    {legend && <FormLabel component="legend">{legend}</FormLabel>}
    <RadioGroup
      value={value}
      onChange={(e) => onChange(e.target.value)}
      row
    >
      {items.map((item) => (
        <FormControlLabel
          key={item.value}
          control={<Radio />}
          value={item.value}
          label={item.label}
        />
      ))}
    </RadioGroup>
  </FormControl>
);

RadioButtons.propTypes = {
  'aria-label': PropTypes.string,
  legend: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.instanceOf(RadioButtonsItem)).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

RadioButtons.defaultProps = {
  'aria-label': null,
  legend: null,
  onChange: null,
};

export default RadioButtons;

/* eslint-disable @typescript-eslint/lines-between-class-members */
import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

export class RadioButtonsItem {
  label: string = '';
  value: string = '';
}

const propTypes = {
  'aria-label': PropTypes.string,
  legend: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.instanceOf(RadioButtonsItem).isRequired).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const RadioButtons = ({
  'aria-label': ariaLabel, legend, items, value, onChange,
}: InferProps<typeof propTypes>) => (
  <FormControl component="fieldset" aria-label={ariaLabel ?? 'RadioButtons'}>
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

RadioButtons.propTypes = propTypes;

RadioButtons.defaultProps = {
  'aria-label': undefined,
  legend: null,
};

export default RadioButtons;

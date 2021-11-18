import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const Danger = ({
  'aria-label': ariaLabel, icon, label, onClick,
}) => (
  <Button
    onClick={onClick}
    aria-label={ariaLabel}
    variant="contained"
    startIcon={icon}
    color="error"
    sx={{ ma: '0.5em' }}
  >
    {label}
  </Button>
);

Danger.propTypes = {
  'aria-label': PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.element,
  onClick: PropTypes.func,
};

Danger.defaultProps = {
  'aria-label': null,
  label: null,
  icon: null,
  onClick: null,
};

export default Danger;

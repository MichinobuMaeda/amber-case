import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

const EditButton = ({ 'aria-label': ariaLabel, onClick }) => (
  <IconButton
    aria-label={ariaLabel}
    onClick={onClick}
    color="secondary"
  >
    <Edit />
  </IconButton>
);

EditButton.propTypes = {
  'aria-label': PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

EditButton.defaultProps = {
  onClick: null,
};

export default EditButton;

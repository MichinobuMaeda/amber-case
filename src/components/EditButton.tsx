import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';

const propTypes = {
  'aria-label': PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const EditButton = ({
  'aria-label': ariaLabel, onClick,
}: InferProps<typeof propTypes>) => (
  <IconButton
    aria-label={ariaLabel}
    onClick={onClick}
    color="secondary"
  >
    <Edit />
  </IconButton>
);

EditButton.propTypes = propTypes;

export default EditButton;

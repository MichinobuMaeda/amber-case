import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

const propTypes = {
  show: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

const ShowPasswordButton = ({
  show, onClick,
}: InferProps<typeof propTypes>) => (
  <InputAdornment position="end">
    <IconButton
      onClick={() => { onClick(!show); }}
      edge="end"
    >
      {show ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  </InputAdornment>
);

ShowPasswordButton.propTypes = propTypes;

ShowPasswordButton.defaultProps = {
  show: false,
};

export default ShowPasswordButton;

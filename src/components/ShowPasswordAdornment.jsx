import React from 'react';
import PropTypes from 'prop-types';
import { InputAdornment, IconButton } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';

const ShowPasswordAdornment = ({ position, show, onClick }) => (
  <InputAdornment position={position}>
    <IconButton
      onClick={() => { onClick(!show); }}
      edge={position}
    >
      {show ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  </InputAdornment>
);

ShowPasswordAdornment.propTypes = {
  position: PropTypes.string,
  show: PropTypes.bool,
  onClick: PropTypes.func,
};

ShowPasswordAdornment.defaultProps = {
  position: 'end',
  show: false,
  onClick: null,
};

export default ShowPasswordAdornment;

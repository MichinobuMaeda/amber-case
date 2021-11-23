import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

const ShowPasswordButton = ({ position, show, onClick }) => (
  <InputAdornment position={position}>
    <IconButton
      onClick={() => { onClick(!show); }}
      edge={position}
    >
      {show ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  </InputAdornment>
);

ShowPasswordButton.propTypes = {
  position: PropTypes.string,
  show: PropTypes.bool,
  onClick: PropTypes.func,
};

ShowPasswordButton.defaultProps = {
  position: 'end',
  show: false,
  onClick: null,
};

export default ShowPasswordButton;

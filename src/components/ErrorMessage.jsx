import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@mui/material';

const InfoMessage = ({ text }) => (
  <Alert severity="error" sx={{ my: '0.5em' }}>{text}</Alert>
);

InfoMessage.propTypes = {
  text: PropTypes.string.isRequired,
};

export default InfoMessage;

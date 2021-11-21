import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const PageTitle = ({ icon, title }) => (
  <Typography variant="h2" component="div">
    <span style={{ marginRight: '0.25em' }}>{icon}</span>
    {title}
  </Typography>
);

PageTitle.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string.isRequired,
};

PageTitle.defaultProps = {
  icon: null,
};

export default PageTitle;

import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const PageTitle = ({ 'data-testid': dataTestid, icon, title }) => (
  <Typography data-testid={dataTestid} variant="h2" component="div" sx={{ mb: 2.0 }}>
    <span style={{ marginRight: '0.25em' }}>{icon}</span>
    {title}
  </Typography>
);

PageTitle.propTypes = {
  'data-testid': PropTypes.string.isRequired,
  icon: PropTypes.element,
  title: PropTypes.string.isRequired,
};

PageTitle.defaultProps = {
  icon: null,
};

export default PageTitle;

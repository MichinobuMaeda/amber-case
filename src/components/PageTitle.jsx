import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const PageTitle = ({ 'data-testid': dataTestid, icon, title }) => {
  const Icon = icon;

  return (
    <Typography data-testid={dataTestid} variant="h5" component="div" sx={{ mb: 4 }}>
      {Icon && <Icon sx={{ pt: 0.5 }} />}
      {title}
    </Typography>
  );
};

PageTitle.propTypes = {
  'data-testid': PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  icon: PropTypes.object,
  title: PropTypes.string.isRequired,
};

PageTitle.defaultProps = {
  icon: null,
};

export default PageTitle;

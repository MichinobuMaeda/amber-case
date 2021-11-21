import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

const MyEmailPanel = ({ 'data-testid': dataTestid }) => (
  <Grid container spacing={2} data-testid={dataTestid}>
    <Grid item xs={12}>
      My E-mail
    </Grid>
  </Grid>
);

MyEmailPanel.propTypes = {
  'data-testid': PropTypes.string,
};

MyEmailPanel.defaultProps = {
  'data-testid': null,
};

export default MyEmailPanel;

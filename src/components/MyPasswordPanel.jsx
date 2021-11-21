import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

const MyPasswordPanel = ({ 'data-testid': dataTestid }) => (
  <Grid container spacing={2} data-testid={dataTestid}>
    <Grid item xs={12}>
      My password
    </Grid>
  </Grid>
);

MyPasswordPanel.propTypes = {
  'data-testid': PropTypes.string,
};

MyPasswordPanel.defaultProps = {
  'data-testid': null,
};

export default MyPasswordPanel;

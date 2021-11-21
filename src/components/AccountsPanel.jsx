import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

const AccountsPanel = ({ 'data-testid': dataTestid }) => (
  <Grid container spacing={2} data-testid={dataTestid}>
    <Grid item xs={12}>
      Accounts
    </Grid>
  </Grid>
);

AccountsPanel.propTypes = {
  'data-testid': PropTypes.string,
};

AccountsPanel.defaultProps = {
  'data-testid': null,
};

export default AccountsPanel;

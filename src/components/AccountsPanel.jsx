import React from 'react';
import { Grid } from '@mui/material';

const AccountsPanel = () => (
  <Grid container spacing={2} data-testid="accounts-panel">
    <Grid item xs={12}>
      Accounts
    </Grid>
  </Grid>
);

export default AccountsPanel;

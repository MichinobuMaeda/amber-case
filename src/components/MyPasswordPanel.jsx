import React from 'react';
import { Grid } from '@mui/material';

const MyPasswordPanel = () => (
  <Grid container spacing={2} data-testid="myPassword-panel">
    <Grid item xs={12}>
      My password
    </Grid>
  </Grid>
);

export default MyPasswordPanel;

import React from 'react';
import { Grid } from '@mui/material';

const MyEmailPanel = () => (
  <Grid container spacing={2} data-testid="myEmail-panel">
    <Grid item xs={12}>
      My E-mail
    </Grid>
  </Grid>
);

export default MyEmailPanel;

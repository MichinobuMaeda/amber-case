import React from 'react';
import Grid from '@mui/material/Grid';
// import { useTranslation } from 'react-i18next';

import '../conf/i18n';
// import { AppContext, guard } from '../api';

// eslint-disable-next-line arrow-body-style
const HomePage = () => {
  // const { t } = useTranslation();
  // const context = useContext(AppContext);

  return (
    <Grid container spacing={2} data-testid="home-page">
      <Grid item xs={12}>
        Home
      </Grid>
    </Grid>
  );
};

export default HomePage;

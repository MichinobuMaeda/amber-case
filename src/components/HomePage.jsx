import React from 'react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
// import { AppContext } from '../api';

const HomePage = () => {
  const { t } = useTranslation();
  // const context = useContext(AppContext);

  return (
    <Grid container spacing={2} data-testid="home-page">
      <Grid item xs={12}>
        <p style={{ float: 'right', marginTop: 0 }}><Link href="#/policy">{t('Policy')}</Link></p>
      </Grid>
    </Grid>
  );
};

export default HomePage;

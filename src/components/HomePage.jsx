import React from 'react';
import { Grid, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
// import { ServiceContext } from '../api';

const HomePage = () => {
  const { t } = useTranslation();
  // const service = useContext(ServiceContext);

  return (
    <Grid container spacing={2} data-testid="home-page">
      <Grid item xs={12}>
        <p style={{ float: 'right', marginTop: 0 }}><Link href="#/policy">{t('Policy')}</Link></p>
      </Grid>
    </Grid>
  );
};

export default HomePage;

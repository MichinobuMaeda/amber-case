import React from 'react';
import { Policy } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import PageTitle from './PageTitle';

const PolicyPage = () => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2} data-testid="policy-page">
      <Grid item xs={12}>
        <PageTitle icon={<Policy />} title={t('Policy')} />
      </Grid>
    </Grid>
  );
};

export default PolicyPage;

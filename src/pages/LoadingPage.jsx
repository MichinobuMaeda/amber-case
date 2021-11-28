import React, { useContext } from 'react';
import Grid from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { AppContext } from '../api';
import Guard from '../components/Guard';

const LoadingPage = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);

  return (
    <Guard require="loading" redirect>
      <Grid
        data-testid="loading-page"
        container
        spacing={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        {context.conf.error ? (
          <Stack spacing={1} alignItems="center">
            <Typography variant="body1">{t('failed to load config')}</Typography>
            <Typography variant="body1">{t('check connection')}</Typography>
            <Typography variant="body1">{t('retry failed or call admin')}</Typography>
          </Stack>
        ) : (
          <>
            <Stack spacing={1} alignItems="center">
              <p><CircularProgress /></p>
              <Typography variant="body1">{t('loading config')}</Typography>
            </Stack>
          </>
        )}
      </Grid>
    </Guard>
  );
};

export default LoadingPage;

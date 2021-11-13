import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../conf/i18n';

const LoadingErrorPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      data-testid="LoadingErrorPage"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Stack spacing={4} alignItems="center">
        <Typography variant="body1">{t('failed to load config')}</Typography>
        <Typography variant="body1">{t('check connection')}</Typography>
        <Typography variant="body1">{t('retry failed or call admin')}</Typography>
      </Stack>
    </Box>
  );
};

export default LoadingErrorPage;

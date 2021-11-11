import React from 'react';
import {
  Box, Stack, Typography, CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../conf/i18n';

const LoadingPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      data-testid="LoadingPage"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Stack spacing={4} alignItems="center">
        <CircularProgress />
        <Typography variant="body1">{t('loading config')}</Typography>
      </Stack>
    </Box>
  );
};

export default LoadingPage;

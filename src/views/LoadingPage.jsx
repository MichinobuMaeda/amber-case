import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Stack, Typography, CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../conf/i18n';

const LoadingPage = ({ error }) => {
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
        {error ? (
          <>
            <Typography variant="body1">{t('failed to load config')}</Typography>
            <Typography variant="body1">{t('check connection')}</Typography>
            <Typography variant="body1">{t('retry failed or call admin')}</Typography>
          </>
        ) : (
          <Typography variant="body1">{t('loading config')}</Typography>
        )}
      </Stack>
    </Box>
  );
};

LoadingPage.propTypes = {
  error: PropTypes.bool,
};

LoadingPage.defaultProps = {
  error: false,
};

export default LoadingPage;

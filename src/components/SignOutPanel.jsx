import React, { useContext } from 'react';
import { Grid, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { ServiceContext, handleSignOut } from '../api';

const SignOutPanel = () => {
  const { t } = useTranslation();
  const service = useContext(ServiceContext);
  const navigate = useNavigate();

  const onClickSignOut = async () => {
    await handleSignOut(service);
    navigate('/', { replace: true });
  };

  return (
    <Grid container spacing={2} data-testid="signOut-panel">
      <Grid item xs={12}>
        <Alert severity="warning">{t('sign-out confirmation')}</Alert>
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={onClickSignOut}
          aria-label="sign-out"
          startIcon={<Logout />}
          color="error"
          // variant={buttonVariant}
        >
          {t('Sign-out')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default SignOutPanel;

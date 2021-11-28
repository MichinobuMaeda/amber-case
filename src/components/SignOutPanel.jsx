import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { AppContext, handleSignOut } from '../api';

const SignOutPanel = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const onClickSignOut = async () => {
    await handleSignOut(context);
    navigate('/signin');
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

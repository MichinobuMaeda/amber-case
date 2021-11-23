import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MarkEmailRead from '@mui/icons-material/MarkEmailRead';
import Send from '@mui/icons-material/Send';
import Cached from '@mui/icons-material/Cached';
import Logout from '@mui/icons-material/Logout';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
// import { buttonVariant } from '../conf';
import {
  AppContext, handleSendEmailVerification,
  handleReloadAuthUser, handleSignOut,
} from '../api';
import PageTitle from './PageTitle';

const EmailVerificationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [completion, setCompletion] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const onSubmit = async () => {
    try {
      await handleSendEmailVerification(context);
      setCompletion(true);
    } catch (e) {
      setErrorStatus(true);
    }
  };

  const onClickSignOut = async () => {
    await handleSignOut(context);
    navigate(-1);
  };

  return (
    <Grid container spacing={2} data-testid="emailVerification-page">
      <Grid item xs={12}>
        <PageTitle icon={<MarkEmailRead />} title={t('E-mail verification')} />
      </Grid>
      {!completion && (
      <Grid item xs={12}>
        <Alert severity="info">
          {t('email verification is required')}
        </Alert>
      </Grid>
      )}
      {!completion && (
      <Grid item xs={12}>
        <Button
          onClick={onSubmit}
          aria-label="send"
          startIcon={<Send />}
          // variant={buttonVariant}
        >
          {t('Send')}
        </Button>
      </Grid>
      )}
      {completion && (
      <Grid item xs={12}>
        <Alert severity="success">
          {t('send email verification')}
        </Alert>
      </Grid>
      )}
      {completion && (
      <Grid item xs={12}>
        <Alert severity="info">
          {t('reload app to complete email verification')}
        </Alert>
      </Grid>
      )}
      {completion && (
      <Grid item xs={12}>
        <Button
          onClick={() => handleReloadAuthUser(context)}
          aria-label="reload"
          startIcon={<Cached />}
          // variant={buttonVariant}
        >
          {t('Update')}
        </Button>
      </Grid>
      )}
      {errorStatus && (
      <Grid item xs={12}>
        <Alert severity="error">
          {t('failed to send email') + t('retry failed or call admin')}
        </Alert>
      </Grid>
      )}
      <Grid item xs={12}>
        <Alert severity="info">
          {t('sign out fo retry')}
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={onClickSignOut}
          aria-label="sign-out"
          startIcon={<Logout />}
          color="secondary"
          // variant={buttonVariant}
        >
          {t('Sign-out')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default EmailVerificationPage;

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Alert, Button } from '@mui/material';
import {
  MarkEmailRead, Send, Cached, Logout,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
// import { buttonVariant } from '../conf';
import {
  ServiceContext, handleSendEmailVerification,
  handleReloadAuthUser, handleSignOut,
} from '../api';
import PageTitle from './PageTitle';

const EmailVerificationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const service = useContext(ServiceContext);
  const [completion, setCompletion] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const onSubmit = async () => {
    try {
      await handleSendEmailVerification(service);
      setCompletion(true);
    } catch (e) {
      setErrorStatus(true);
    }
  };

  const onClickSignOut = async () => {
    await handleSignOut(service);
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
          onClick={() => handleReloadAuthUser(service)}
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

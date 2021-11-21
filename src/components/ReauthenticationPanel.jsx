import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Alert, TextField, Button,
} from '@mui/material';
import { Send, Check } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import {
  ServiceContext,
  handelReauthenticateLinkToEmail,
  handleReauthenticateWithPassword,
} from '../api';
import ShowPasswordAdornment from './ShowPasswordAdornment';

const ReauthenticationPanel = ({ 'data-testid': dataTestid }) => {
  const { t } = useTranslation();
  const service = useContext(ServiceContext);
  const [sendEmailCompletion, setSendEmailCompletion] = useState(false);
  const [sendEmailErrorStatus, setSendEmailErrorStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const onClickSend = async () => {
    try {
      await handelReauthenticateLinkToEmail(service, window);
      setSendEmailCompletion(true);
    } catch (e) {
      setSendEmailErrorStatus(true);
    }
  };

  const onClikckPasswordConfiremation = async () => {
    try {
      await handleReauthenticateWithPassword(service, password);
    } catch (e) {
      setPasswordError(true);
    }
  };

  return (
    <Grid container spacing={2} data-testid={dataTestid}>
      <Grid item xs={12}>
        <Alert severity="info">
          {t('reauthentication required')}
        </Alert>
      </Grid>
      <Grid item xs={12} sm={8} md={6}>
        {t('receive email link for reauthentication')}
      </Grid>
      <Grid item xs={12} sm="auto">
        <Button
          onClick={onClickSend}
          aria-label="sendReauthLinkEmail"
          startIcon={<Send />}
        >
          {t('Send')}
        </Button>
      </Grid>
      {sendEmailCompletion && (
      <Grid item xs={12}>
        <Alert severity="success">
          {t('send email for reauthentication')}
        </Alert>
      </Grid>
      )}
      {sendEmailErrorStatus && (
      <Grid item xs={12}>
        <Alert severity="error">
          {t('failed to send email') + t('retry failed or call admin')}
        </Alert>
      </Grid>
      )}
      <Grid item xs={12} sm={8} md={6}>
        <TextField
          id={`${dataTestid}-password`}
          type={showPassword ? 'text' : 'password'}
          label={t('password')}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: <ShowPasswordAdornment show={showPassword} onClick={setShowPassword} />,
          }}
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <Button
          onClick={onClikckPasswordConfiremation}
          aria-label="passwordConfiremation"
          startIcon={<Check />}
          disabled={!password}
          // variant={buttonVariant}
        >
          {t('Confirm')}
        </Button>
      </Grid>
      {passwordError && (
      <Grid item xs={12}>
        <Alert severity="error">
          {t('check password for reauthentication')}
        </Alert>
      </Grid>
      )}
    </Grid>
  );
};

ReauthenticationPanel.propTypes = {
  'data-testid': PropTypes.string,
};

ReauthenticationPanel.defaultProps = {
  'data-testid': null,
};

export default ReauthenticationPanel;

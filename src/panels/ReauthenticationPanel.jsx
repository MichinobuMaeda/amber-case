import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Send from '@mui/icons-material/Send';
import Check from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import AppContext from '../api/AppContext';
import {
  handelReauthenticateLinkToEmail,
  handleReauthenticateWithPassword,
} from '../api/authentication';
import ShowPasswordButton from '../components/ShowPasswordButton';

const ReauthenticationPanel = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const [sendEmailCompletion, setSendEmailCompletion] = useState(false);
  const [sendEmailErrorStatus, setSendEmailErrorStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const onClickSend = async () => {
    try {
      await handelReauthenticateLinkToEmail(context, window);
      setSendEmailCompletion(true);
    } catch (e) {
      setSendEmailErrorStatus(true);
    }
  };

  const onClikckPasswordConfiremation = async () => {
    try {
      await handleReauthenticateWithPassword(context, password);
    } catch (e) {
      setPasswordError(true);
    }
  };

  return (
    <Grid container spacing={2} data-testid="reauthentication-panel">
      <Grid item xs={12}>
        <Alert severity="info">
          {t('reauthentication required')}
        </Alert>
      </Grid>
      <Grid item xs={12} sm={9} md={8} lg={6}>
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
      <Grid item xs={12} sm={9} md={8} lg={6}>
        <TextField
          id="reauthentication-panel-password"
          type={showPassword ? 'text' : 'password'}
          label={t('Password')}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: <ShowPasswordButton show={showPassword} onClick={setShowPassword} />,
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

export default ReauthenticationPanel;

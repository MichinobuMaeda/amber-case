import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SaveAlt from '@mui/icons-material/SaveAlt';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateReuired, validateEmail, firebaseConfig } from '../conf';
import AppContext from '../api/AppContext';
import { setMyEmail } from '../api/authentication';

const MyEmailPanel = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const confirmationErrorMessage = t('do not match the confirmation input');

  const getValidationError = (text) => {
    if (!validateReuired(text)) { return t('input is required'); }
    if (!validateEmail(text)) { return t('correct your email address'); }
    return null;
  };

  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [confirmation, setConfirmation] = useState('');
  const [confirmationError, setConfirmationError] = useState('');
  const [successStatus, setSuccessStatus] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const onEmailChange = (text) => {
    setEmail(text.trim());
    setValidationError(getValidationError(text));
    setConfirmationError(confirmation === text.trim() ? '' : confirmationErrorMessage);
    setSuccessStatus(false);
    setErrorStatus(false);
  };

  const onConfirmationChange = (text) => {
    setConfirmation(text.trim());
    setConfirmationError(email === text.trim() ? '' : confirmationErrorMessage);
  };

  const onSubmit = async () => {
    try {
      await setMyEmail(context, email);
      setSuccessStatus(true);
      navigate('/', { replace: true });
    } catch (e) {
      setErrorStatus(true);
    }
  };

  return (
    <Grid container spacing={2} data-testid="myEmail-panel" alignItems="center">
      <Grid item xs={12}>
        <Alert severity="warning">
          {t('please verify email after change')}
        </Alert>
      </Grid>
      <Grid item xs={12} container spacing={1}>
        <Grid item xs="auto">
          {t('Current E-mail')}
          :
        </Grid>
        <Grid item xs="auto">
          {context.auth.currentUser.email}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={9} md={8} lg={6}>
        <TextField
          id="myEmail-email"
          value={email}
          label={t('New E-mail')}
          onChange={(e) => onEmailChange(e.target.value)}
          error={!!validationError}
          helperText={validationError}
        />
      </Grid>
      <Grid item xs={12} sm="auto" />
      <Grid item xs={12} sm={9} md={8} lg={6}>
        <TextField
          id="myEmail-confirmation"
          value={confirmation}
          label={t('Confirmation')}
          onChange={(e) => onConfirmationChange(e.target.value)}
          error={!!confirmationError}
          helperText={confirmationError}
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <Button
          disabled={!!validationError
            || !!confirmationError
            || email.trim() === (context.auth.currentUser.email || '')}
          onClick={onSubmit}
          aria-label="save"
          startIcon={<SaveAlt />}
        >
          {t('Save')}
        </Button>
      </Grid>
      {successStatus && (
      <Grid item xs={12}>
        <Alert severity="success">
          {t('completed saving data')}
        </Alert>
      </Grid>
      )}
      {errorStatus && (
      <Grid item xs={12}>
        <Alert severity="error">
          {t('failed to save data') + t('retry failed or call admin')}
        </Alert>
      </Grid>
      )}
      {firebaseConfig.apiKey === 'FIREBASE_API_KEY' && (
      <Grid item xs={12}>
        <Button
          onClick={() => { context.setReauthenticationTimeout(0); }}
          aria-label="test"
          color="secondary"
        >
          Test
        </Button>
        <span style={{ margin: '1em' }}>{context.reauthenticationTimeout}</span>
      </Grid>
      )}
    </Grid>
  );
};

export default MyEmailPanel;

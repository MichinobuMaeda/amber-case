import React, { useState, useContext } from 'react';
import {
  Grid, Alert, TextField, Button,
} from '@mui/material';
import { SaveAlt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateReuired, validateEmail } from '../conf';
import { ServiceContext, setMyEmail } from '../api';

const MyEmailPanel = () => {
  const { t } = useTranslation();
  const service = useContext(ServiceContext);
  const navigate = useNavigate();
  const confirmationErrorMessage = t('do not match the confirmation input');
  const currentEmail = () => service.auth.currentUser.email;

  const getValidationError = (text) => {
    if (!validateReuired(text)) { return t('input is required'); }
    if (!validateEmail(text)) { return t('correct your email address'); }
    return null;
  };

  const [email, setEmail] = useState(
    getValidationError(currentEmail()) ? '' : currentEmail(),
  );
  const [validationError, setValidationError] = useState(
    getValidationError(currentEmail()),
  );
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
      await setMyEmail(service, email);
      setSuccessStatus(true);
      navigate('/', { replace: true });
    } catch (e) {
      setErrorStatus(true);
    }
  };

  return (
    <Grid container spacing={2} data-testid="myEmail-panel">
      <Grid item xs={12}>
        <Alert severity="warning">
          {t('please verify email after change')}
        </Alert>
      </Grid>
      <Grid item xs={12} sm={8} md={6}>
        <TextField
          id="myEmail-email"
          value={email}
          label={t('E-mail')}
          onChange={(e) => onEmailChange(e.target.value)}
          error={!!validationError}
          helperText={validationError}
        />
      </Grid>
      <Grid item xs={12} sm="auto" />
      <Grid item xs={12} sm={8} md={6}>
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
          disabled={!!validationError || !!confirmationError || email.trim() === currentEmail()}
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
    </Grid>
  );
};

export default MyEmailPanel;

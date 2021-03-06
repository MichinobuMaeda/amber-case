import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SaveAlt from '@mui/icons-material/SaveAlt';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateReuired, validatePassword } from '../conf';
import AppContext from '../api/AppContext';
import { setMyPassword } from '../api/authentication';
import ShowPasswordButton from '../components/ShowPasswordButton';

const MyPasswordPanel = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const confirmationErrorMessage = t('do not match the confirmation input');

  const getValidationError = (text: string): string => {
    if (!validateReuired(text)) { return t('input is required'); }
    if (!validatePassword(text)) { return t('correct your password'); }
    return '';
  };

  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState(getValidationError(''));
  const [confirmation, setConfirmation] = useState('');
  const [confirmationError, setConfirmationError] = useState('');
  const [successStatus, setSuccessStatus] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onEmailChange = (text: string) => {
    setPassword(text.trim());
    setValidationError(getValidationError(text));
    setConfirmationError(confirmation === text.trim() ? '' : confirmationErrorMessage);
    setSuccessStatus(false);
    setErrorStatus(false);
  };

  const onConfirmationChange = (text: string) => {
    setConfirmation(text.trim());
    setConfirmationError(password === text.trim() ? '' : confirmationErrorMessage);
  };

  const onSubmit = async () => {
    try {
      await setMyPassword(context, password);
      setSuccessStatus(true);
    } catch (e) {
      setErrorStatus(true);
    }
  };

  return (
    <Grid container spacing={2} data-testid="myPassword-panel" alignItems="center">
      <Grid item xs={12} sm={9} md={8} lg={6}>
        <TextField
          id="myPassword-email"
          type={showPassword ? 'text' : 'password'}
          label={t('Password')}
          onChange={(e) => onEmailChange(e.target.value)}
          error={!!validationError}
          helperText={validationError}
          InputProps={{
            endAdornment: <ShowPasswordButton show={showPassword} onClick={setShowPassword} />,
          }}
        />
      </Grid>
      <Grid item xs={12} sm="auto" />
      <Grid item xs={12} sm={9} md={8} lg={6}>
        <TextField
          id="myPassword-confirmation"
          type={showPassword ? 'text' : 'password'}
          label={t('Confirmation')}
          onChange={(e) => onConfirmationChange(e.target.value)}
          error={!!confirmationError}
          helperText={confirmationError}
          InputProps={{
            endAdornment: <ShowPasswordButton show={showPassword} onClick={setShowPassword} />,
          }}
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <Button
          disabled={!!validationError || !!confirmationError}
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

export default MyPasswordPanel;

import React, { useContext, useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Login from '@mui/icons-material/Login';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import {
  validateReuired, validateEmail,
} from '../conf';
import AppContext from '../api/AppContext';
import { handleSignInWithPassword } from '../api/authentication';
import ShowPasswordButton from '../components/ShowPasswordButton';

const propTypes = {
  email: PropTypes.string,
  errorMessage: PropTypes.string,
  onEmailChange: PropTypes.func.isRequired,
};

const SignInWithPasswordPanel = ({
  email, errorMessage, onEmailChange,
}: InferProps<typeof propTypes>) => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);

  const onSubmit = async () => {
    try {
      await handleSignInWithPassword(context, email!, password);
    } catch (e) {
      setErrorStatus(true);
    }
  };

  return (
    <Grid container spacing={2} data-testid="signInWithPassword-panel" alignItems="center">
      <Grid item xs={12} sm={9} md={8} lg={6}>
        <TextField
          id="signInWithPassword-email"
          value={email}
          label={t('E-mail')}
          onChange={(e) => onEmailChange(e.target.value)}
          error={!!errorMessage}
          helperText={errorMessage}
        />
      </Grid>
      <Grid item xs={12} sm="auto" />
      <Grid item xs={12} sm={9} md={8} lg={6}>
        <TextField
          id="signInWithPassword-password"
          label={t('Password')}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: <ShowPasswordButton show={showPassword} onClick={setShowPassword} />,
          }}
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <Button
          disabled={!validateReuired(email)
            || !validateEmail(email)
            || !validateReuired(password)}
          onClick={onSubmit}
          aria-label="sign-in"
          startIcon={<Login />}
        >
          {t('Sign-in')}
        </Button>
      </Grid>
      {errorStatus && (
      <Grid item xs={12}>
        <Alert severity="error">
          {t('failed to sign in') + t('check your email and password')}
        </Alert>
      </Grid>
      )}
    </Grid>
  );
};

SignInWithPasswordPanel.propTypes = propTypes;

SignInWithPasswordPanel.defaultProps = {
  email: null,
  errorMessage: null,
};

export default SignInWithPasswordPanel;

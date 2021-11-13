import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Login } from '@mui/icons-material';
import { Button, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateReuired, validateEmail } from '../conf';
import { ServiceContext, handleSignInWithPassword } from '../api';
import EmailField from './EmailField';
import PasswordField from './PasswordField';

const SignInWithPassword = ({ email, onEmailChange }) => {
  const { t } = useTranslation();
  const service = useContext(ServiceContext);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async () => {
    try {
      await handleSignInWithPassword(service, email, password);
    } catch (e) {
      setErrorMessage(t('failed to sign in') + t('check your email and password'));
    }
  };

  return (
    <>
      <div data-testid="SignInWithPassword" />
      <div style={{ marginBottom: '1em' }}>
        <EmailField
          id="email"
          data-testid="email"
          value={email}
          label={t('E-mail')}
          onChange={onEmailChange}
        />
      </div>
      <div style={{ marginBottom: '1em' }}>
        <PasswordField
          id="password"
          data-testid="password"
          value={password}
          label={t('password')}
          onChange={setPassword}
        />
      </div>
      {validateEmail(email) && validateReuired(password) && (
      <Button
        onClick={onSubmit}
        aria-label="sign-in"
        variant="contained"
        startIcon={<Login />}
        sx={{ mb: '1em' }}
      >
        {t('Sign-in')}
      </Button>
      )}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </>
  );
};

SignInWithPassword.propTypes = {
  email: PropTypes.string,
  onEmailChange: PropTypes.func.isRequired,
};

SignInWithPassword.defaultProps = {
  email: null,
};

export default SignInWithPassword;

import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Login } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateReuired, validateEmail } from '../conf';
import { ServiceContext, handleSignInWithPassword } from '../api';
import {
  EmailField, PasswordField, PrimaryButton, ErrorMessage,
} from '../components';

const SignInWithPasswordPanel = ({ email, onEmailChange }) => {
  const { t } = useTranslation();
  const service = useContext(ServiceContext);
  const [password, setPassword] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);

  const onSubmit = async () => {
    try {
      await handleSignInWithPassword(service, email, password);
    } catch (e) {
      setErrorStatus(true);
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
      <PrimaryButton
        onClick={onSubmit}
        aria-label="sign-in"
        startIcon={<Login />}
        label={t('Sign-in')}
      />
      )}
      {errorStatus && <ErrorMessage text={t('failed to sign in') + t('check your email and password')} />}
    </>
  );
};

SignInWithPasswordPanel.propTypes = {
  email: PropTypes.string,
  onEmailChange: PropTypes.func.isRequired,
};

SignInWithPasswordPanel.defaultProps = {
  email: null,
};

export default SignInWithPasswordPanel;

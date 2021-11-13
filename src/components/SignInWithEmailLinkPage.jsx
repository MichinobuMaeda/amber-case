import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Send } from '@mui/icons-material';
import { Button, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateEmail, firebaseConfig } from '../conf';
import {
  ServiceContext, handelSendSignInLinkToEmail, handleSignInWithPassword,
} from '../api';
import EmailField from './EmailField';

const SignInWithEmailLinkPage = ({ email, onEmailChange }) => {
  const { t } = useTranslation();
  const service = useContext(ServiceContext);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async () => {
    try {
      await handelSendSignInLinkToEmail(service, window, email);
      setNoticeMessage(t('send email link'));
    } catch (e) {
      setErrorMessage(t('failed to send email') + t('retry failed or call admin'));
    }
  };

  return (
    <>
      <div data-testid="SignInWithEmailLinkPage" />
      <div style={{ marginBottom: '1em' }}>
        <EmailField
          id="email"
          data-testid="email"
          value={email}
          label={t('E-mail')}
          onChange={onEmailChange}
        />
      </div>
      {validateEmail(email) && (
      <Button
        onClick={onSubmit}
        variant="contained"
        aria-label="send"
        startIcon={<Send />}
        sx={{ mb: '1em' }}
      >
        {t('Send')}
      </Button>
      )}
      {noticeMessage && <Alert severity="success">{noticeMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {firebaseConfig.apiKey === 'FIREBASE_API_KEY' && !email && (
      <Button
        onClick={() => handleSignInWithPassword(service, 'primary@example.com', 'password')}
        aria-label="test"
        sx={{ mb: '1em' }}
      >
        Test
      </Button>
      )}
    </>
  );
};

SignInWithEmailLinkPage.propTypes = {
  email: PropTypes.string,
  onEmailChange: PropTypes.func.isRequired,
};

SignInWithEmailLinkPage.defaultProps = {
  email: '',
};

export default SignInWithEmailLinkPage;

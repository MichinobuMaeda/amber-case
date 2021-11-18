import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Send } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateEmail, firebaseConfig } from '../conf';
import {
  ServiceContext, handelSendSignInLinkToEmail, handleSignInWithPassword,
} from '../api';
import {
  EmailField, PrimaryButton, SecondaryButton, SuccessMessage, ErrorMessage,
} from '../components';

const SignInWithEmailLinkPanel = ({ email, onEmailChange }) => {
  const { t } = useTranslation();
  const service = useContext(ServiceContext);
  const [completion, setCompletion] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const onSubmit = async () => {
    try {
      await handelSendSignInLinkToEmail(service, window, email);
      setCompletion(true);
    } catch (e) {
      setErrorStatus(true);
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
      <PrimaryButton
        onClick={onSubmit}
        aria-label="send"
        startIcon={<Send />}
        label={t('Send')}
      />
      )}
      {completion && <SuccessMessage text={t('send email link')} />}
      {errorStatus && <ErrorMessage text={t('failed to send email') + t('retry failed or call admin')} />}
      {firebaseConfig.apiKey === 'FIREBASE_API_KEY' && !email && (
      <SecondaryButton
        onClick={() => handleSignInWithPassword(service, 'primary@example.com', 'password')}
        aria-label="test"
        label="Test"
      />
      )}
    </>
  );
};

SignInWithEmailLinkPanel.propTypes = {
  email: PropTypes.string,
  onEmailChange: PropTypes.func.isRequired,
};

SignInWithEmailLinkPanel.defaultProps = {
  email: '',
};

export default SignInWithEmailLinkPanel;

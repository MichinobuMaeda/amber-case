import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Alert, TextField, Button,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import {
  validateReuired, validateEmail, firebaseConfig,
} from '../conf';
import {
  ServiceContext, handelSendSignInLinkToEmail, handleSignInWithPassword,
} from '../api';

const SignInWithEmailLinkPanel = ({ email, errorMessage, onEmailChange }) => {
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
    <Grid container spacing={2} data-testid="signInWithEmailLink-panel">
      <Grid item xs={12} sm={8} md={6}>
        <TextField
          id="signInWithEmailLink-email"
          value={email}
          label={t('E-mail')}
          onChange={(e) => onEmailChange(e.target.value)}
          error={!!errorMessage}
          helperText={errorMessage}
        />
      </Grid>
      <Grid item xs={12} sm="auto">
        <Button
          disabled={!validateReuired(email) || !validateEmail(email)}
          onClick={onSubmit}
          aria-label="send"
          startIcon={<Send />}
        >
          {t('Send')}
        </Button>
      </Grid>
      {completion && (
      <Grid item xs={12}>
        <Alert severity="success">
          {t('send email link')}
        </Alert>
      </Grid>
      )}
      {errorStatus && (
      <Grid item xs={12}>
        <Alert severity="error">
          {t('failed to send email') + t('retry failed or call admin')}
        </Alert>
      </Grid>
      )}
      {firebaseConfig.apiKey === 'FIREBASE_API_KEY' && !email && (
      <Grid item xs={12}>
        <Button
          onClick={() => handleSignInWithPassword(service, 'primary@example.com', 'password')}
          aria-label="test"
          color="secondary"
        >
          Test
        </Button>
      </Grid>
      )}
    </Grid>
  );
};

SignInWithEmailLinkPanel.propTypes = {
  email: PropTypes.string,
  errorMessage: PropTypes.string,
  onEmailChange: PropTypes.func.isRequired,
};

SignInWithEmailLinkPanel.defaultProps = {
  email: '',
  errorMessage: null,
};

export default SignInWithEmailLinkPanel;

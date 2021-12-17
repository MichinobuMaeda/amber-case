import React, { useContext, useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Send from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import {
  validateReuired, validateEmail, firebaseConfig,
} from '../conf';
import AppContext from '../api/AppContext';
import {
  handelSendSignInLinkToEmail,
  handleSignInWithPassword,
} from '../api/authentication';

const propTypes = {
  email: PropTypes.string,
  errorMessage: PropTypes.string,
  onEmailChange: PropTypes.func.isRequired,
};

const SignInWithEmailLinkPanel = ({
  email, errorMessage, onEmailChange,
}: InferProps<typeof propTypes>) => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const [completion, setCompletion] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const onSubmit = async () => {
    try {
      await handelSendSignInLinkToEmail(context, window, email!);
      setCompletion(true);
    } catch (e) {
      setErrorStatus(true);
    }
  };

  return (
    <Grid container spacing={2} data-testid="signInWithEmailLink-panel" alignItems="center">
      <Grid item xs={12} sm={9} md={8} lg={6}>
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
          disabled={!validateReuired(email!) || !validateEmail(email!)}
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
          onClick={() => handleSignInWithPassword(context, 'primary@example.com', 'password')}
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

SignInWithEmailLinkPanel.propTypes = propTypes;

SignInWithEmailLinkPanel.defaultProps = {
  email: '',
  errorMessage: null,
};

export default SignInWithEmailLinkPanel;

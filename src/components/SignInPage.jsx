import React, { useState } from 'react';
import { Grid, Link } from '@mui/material';
import { Login } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateEmail } from '../conf';
import PageTitle from './PageTitle';
import RadioButtons from './RadioButtons';
import SignInWithEmailLinkPanel from './SignInWithEmailLinkPanel';
import SignInWithPasswordPanel from './SignInWithPasswordPanel';

const SignInPage = () => {
  const { t } = useTranslation();
  const withEmailLink = 'emailLink';
  const withPassword = 'password';
  const [signInMethod, setSignInMethod] = useState(withEmailLink);
  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const handleEmailChange = (v) => {
    setEmail(v);
    setEmailErrorMessage(validateEmail(v) ? null : t('correct your email address'));
  };

  return (
    <Grid container spacing={2} data-testid="signIn-page">
      <Grid item xs={12}>
        <PageTitle icon={<Login />} title={t('Sign-in')} />
      </Grid>
      <Grid item xs={12}>
        <p style={{ float: 'right', marginTop: 0 }}>
          <Link href="#/policy">{t('Polycy')}</Link>
        </p>
        <RadioButtons
          legend={t('select login method')}
          onChange={setSignInMethod}
          items={[
            { value: withEmailLink, label: t('sign in with email link') },
            { value: withPassword, label: t('email address and password') },
          ]}
          value={signInMethod}
        />
      </Grid>
      <Grid item xs={12}>
        {t('no login method worked or call admin')}
      </Grid>
      <Grid item xs={12}>
        {signInMethod === withEmailLink && (
        <SignInWithEmailLinkPanel
          email={email}
          errorMessage={emailErrorMessage}
          onEmailChange={handleEmailChange}
        />
        )}
        {signInMethod === withPassword && (
        <SignInWithPasswordPanel
          email={email}
          errorMessage={emailErrorMessage}
          onEmailChange={handleEmailChange}
        />
        )}
      </Grid>
    </Grid>
  );
};

export default SignInPage;

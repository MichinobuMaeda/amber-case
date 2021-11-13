import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FormControl, FormLabel, FormControlLabel,
  RadioGroup, Radio,
} from '@mui/material';
import { Login } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import PageTitle from './PageTitle';
import SignInWithEmailLinkPage from './SignInWithEmailLinkPage';
import SignInWithPassword from './SignInWithPassword';
import '../conf/i18n';

const SignInPage = () => {
  const { t } = useTranslation();
  const withEmailLink = 'emailLink';
  const withPassword = 'password';
  const [signInMethod, setSignInMethod] = useState(withEmailLink);
  const [email, setEmail] = useState('');

  return (
    <>
      <PageTitle data-testid="SignInPage" icon={<Login />} title={t('Sign-in')} />
      <p style={{ float: 'right', marginTop: 0 }}><Link to="/policy">{t('Polycy')}</Link></p>
      <FormControl component="fieldset">
        <FormLabel component="legend">{t('select login method')}</FormLabel>
        <RadioGroup
          value={signInMethod}
          onChange={(e) => setSignInMethod(e.target.value)}
          row
        >
          <FormControlLabel
            control={<Radio />}
            value={withEmailLink}
            label={t('sign in with email link')}
          />
          <FormControlLabel
            control={<Radio />}
            value={withPassword}
            label={t('email address and password')}
          />
        </RadioGroup>
      </FormControl>
      <p>{t('no login method worked or call admin')}</p>
      {signInMethod === withEmailLink && (
        <SignInWithEmailLinkPage email={email} onEmailChange={setEmail} />
      )}
      {signInMethod === withPassword && (
        <SignInWithPassword email={email} onEmailChange={setEmail} />
      )}
    </>
  );
};

export default SignInPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Login } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { PageTitle, RadioButtons } from '../components';
import SignInWithEmailLinkPanel from './SignInWithEmailLinkPanel';
import SignInWithPasswordPanel from './SignInWithPasswordPanel';

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
      <RadioButtons
        legend={t('select login method')}
        onChange={setSignInMethod}
        items={[
          { value: withEmailLink, label: t('sign in with email link') },
          { value: withPassword, label: t('email address and password') },
        ]}
        value={signInMethod}
      />
      <p>{t('no login method worked or call admin')}</p>
      {signInMethod === withEmailLink && (
        <SignInWithEmailLinkPanel email={email} onEmailChange={setEmail} />
      )}
      {signInMethod === withPassword && (
        <SignInWithPasswordPanel email={email} onEmailChange={setEmail} />
      )}
    </>
  );
};

export default SignInPage;

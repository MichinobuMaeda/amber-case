import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateEmail } from '../conf';
import Guard from '../components/Guard';
import Section from '../components/Section';
import RadioButtons from '../components/RadioButtons';
import SignInWithEmailLinkPanel from '../components/SignInWithEmailLinkPanel';
import SignInWithPasswordPanel from '../components/SignInWithPasswordPanel';

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
    <Guard require="guest" redirect>
      <RadioButtons
        legend={t('select login method')}
        onChange={setSignInMethod}
        items={[
          { value: withEmailLink, label: t('sign in with email link') },
          { value: withPassword, label: t('email address and password') },
        ]}
        value={signInMethod}
      />
      {signInMethod === withEmailLink && (
      <Section>
        <SignInWithEmailLinkPanel
          email={email}
          errorMessage={emailErrorMessage}
          onEmailChange={handleEmailChange}
        />
      </Section>
      )}
      {signInMethod === withPassword && (
      <Section>
        <SignInWithPasswordPanel
          email={email}
          errorMessage={emailErrorMessage}
          onEmailChange={handleEmailChange}
        />
      </Section>
      )}
      {t('no login method worked or call admin')}
    </Guard>
  );
};

export default SignInPage;

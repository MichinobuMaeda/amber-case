import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateEmail } from '../conf';
import RadioButtons, { RadioButtonsItem } from '../components/RadioButtons';
import Section from '../components/Section';
import SignInWithEmailLinkPanel from '../panels/SignInWithEmailLinkPanel';
import SignInWithPasswordPanel from '../panels/SignInWithPasswordPanel';

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
    <>
      <RadioButtons
        legend={t('select login method')}
        onChange={setSignInMethod}
        items={[
          new RadioButtonsItem({
            label: t('sign in with email link'),
            value: withEmailLink,
          }),
          new RadioButtonsItem({
            label: t('email address and password'),
            value: withPassword,
          }),
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
    </>
  );
};

export default SignInPage;

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MarkEmailRead, Send, Cached, Logout,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import {
  ServiceContext, handleSendEmailVerification,
  handleReloadAuthUser, handleSignOut,
} from '../api';
import {
  PageTitle, PrimaryButton, SecondaryButton,
  InfoMessage, SuccessMessage, ErrorMessage,
} from '../components';

const EmailVerificationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const service = useContext(ServiceContext);
  const [completion, setCompletion] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const onSubmit = async () => {
    try {
      await handleSendEmailVerification(service);
      setCompletion(true);
    } catch (e) {
      setErrorStatus(true);
    }
  };

  const onClickSignOut = async () => {
    await handleSignOut(service);
    navigate(-1);
  };

  return (
    <>
      <PageTitle
        data-testid="EmailVerificationPage"
        icon={<MarkEmailRead />}
        title={t('E-mail verification')}
      />
      {!completion && (
      <>
        <InfoMessage text={t('email verification is required')} />
        <PrimaryButton
          onClick={onSubmit}
          aria-label="send"
          startIcon={<Send />}
          label={t('Send')}
        />
      </>
      )}
      {completion && (
      <>
        <SuccessMessage text={t('send email verification')} />
        <InfoMessage text={t('reload app to complete email verification')} />
        <PrimaryButton
          onClick={() => handleReloadAuthUser(service)}
          aria-label="reload"
          startIcon={<Cached />}
          label={t('Update')}
        />
      </>
      )}
      {errorStatus && (
      <ErrorMessage text={t('failed to send email') + t('retry failed or call admin')} />
      )}
      <InfoMessage text={t('sign out fo retry')} />
      <SecondaryButton
        onClick={onClickSignOut}
        aria-label="sign-out"
        startIcon={<Logout />}
        label={t('Sign-out')}
      />
    </>
  );
};

export default EmailVerificationPage;

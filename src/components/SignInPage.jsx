import React from 'react';
import { Login } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PageTitle from './PageTitle';
import '../conf/i18n';

const SignInPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle data-testid="SignInPage" icon={<Login />} title={t('Sign-in')} />
    </>
  );
};

export default SignInPage;

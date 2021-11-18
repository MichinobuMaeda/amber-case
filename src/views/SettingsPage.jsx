import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Logout } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { ServiceContext, handleSignOut, isSignedIn } from '../api';
import { PageTitle, DangerButton } from '../components';

const SettingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const service = useContext(ServiceContext);

  const onClickSignOut = async () => {
    await handleSignOut(service);
    navigate(-1);
  };

  return (
    <>
      <PageTitle data-testid="SettingsPage" icon={<Settings />} title={t('Settings')} />
      <p><Link to="/policy">{t('Polycy')}</Link></p>
      {isSignedIn(service) && (
      <DangerButton
        onClick={onClickSignOut}
        aria-label="sign-out"
        startIcon={<Logout />}
        label={t('Sign-out')}
      />
      )}
    </>
  );
};

export default SettingsPage;

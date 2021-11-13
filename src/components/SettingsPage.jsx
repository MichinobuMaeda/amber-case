import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Logout } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { ServiceContext, handleSignOut } from '../api';
import PageTitle from './PageTitle';

const SettingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const service = useContext(ServiceContext);

  const onLogoutClick = async () => {
    await handleSignOut(service);
    navigate(-1);
  };

  return (
    <>
      <PageTitle data-testid="SettingsPage" icon={<Settings />} title={t('Settings')} />
      <p><Link to="/policy">{t('Polycy')}</Link></p>
      {service.me.id && (
      <Button
        onClick={onLogoutClick}
        aria-label="sign-out"
        variant="contained"
        startIcon={<Logout />}
      >
        {t('Sign-out')}
      </Button>
      )}
    </>
  );
};

export default SettingsPage;

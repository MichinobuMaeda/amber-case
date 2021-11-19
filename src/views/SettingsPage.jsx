import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Settings, Logout } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { ServiceContext, handleSignOut, isSignedIn } from '../api';
import { PageTitle, DangerButton, ControlledAccordion } from '../components';
import ThemeModePanel from './ThemeModePanel';
import MyDisplayNamePanel from './MyDisplayNamePanel';
import MyPasswordPanel from './MyPasswordPanel';
import MyEmailPanel from './MyEmailPanel';
import AccountsPanel from './AccountsPanel';

const SettingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const service = useContext(ServiceContext);

  const panels = [
    {
      priv: 'any',
      id: 'themeMode',
      title: t('Theme mode'),
      body: () => <ThemeModePanel />,
    },
    {
      priv: 'user',
      id: 'myDisplayName',
      title: t('My display name'),
      body: () => <MyDisplayNamePanel />,
    },
    {
      priv: 'user',
      id: 'myPassword',
      title: t('My password'),
      body: () => <MyPasswordPanel />,
    },
    {
      priv: 'user',
      id: 'myEmail',
      title: t('My E-mail'),
      body: () => <MyEmailPanel />,
    },
    {
      priv: 'admin',
      id: 'accounts',
      title: t('Accounts'),
      body: () => <AccountsPanel />,
    },
  ];

  const handleOnChangePanel = (id) => {
    navigate(`/settings/${id}`);
  };

  const onClickSignOut = async () => {
    await handleSignOut(service);
    navigate(-1);
  };

  return (
    <>
      <PageTitle data-testid="SettingsPage" icon={<Settings />} title={t('Settings')} />
      <ControlledAccordion
        panels={panels.filter(
          (panel) => panel.priv === 'any'
            || (panel.priv === 'user' && isSignedIn(service))
            || (panel.priv === 'admin' && isSignedIn(service) && service.me.admin),
        )}
        expanded={params.panel}
        onChange={handleOnChangePanel}
      />
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

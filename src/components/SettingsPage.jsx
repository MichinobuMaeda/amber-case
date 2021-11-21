import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
// import { firebaseConfig, buttonVariant } from '../conf';
import { firebaseConfig } from '../conf';
import { ServiceContext, isSignedIn } from '../api';
import PageTitle from './PageTitle';
import ControlledAccordion from './ControlledAccordion';
import ThemeModePanel from './ThemeModePanel';
import MyDisplayNamePanel from './MyDisplayNamePanel';
import MyPasswordPanel from './MyPasswordPanel';
import MyEmailPanel from './MyEmailPanel';
import AccountsPanel from './AccountsPanel';
import SignOutPanel from './SignOutPanel';
import ReauthenticationPanel from './ReauthenticationPanel';

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
      body: () => <ThemeModePanel data-testid="themeMode-panel" />,
    },
    {
      priv: 'user',
      id: 'myDisplayName',
      title: t('My display name'),
      body: () => <MyDisplayNamePanel data-testid="myDisplayName-panel" />,
    },
    {
      priv: 'user',
      id: 'myPassword',
      title: t('My password'),
      body: service.reauthenticationTimeout
        ? () => <MyPasswordPanel data-testid="myPassword-panel" />
        : () => <ReauthenticationPanel data-testid="reauthentication1-panel" />,
    },
    {
      priv: 'user',
      id: 'myEmail',
      title: t('My E-mail'),
      body: service.reauthenticationTimeout
        ? () => <MyEmailPanel data-testid="myEmail-panel" />
        : () => <ReauthenticationPanel data-testid="reauthentication2-panel" />,
    },
    {
      priv: 'admin',
      id: 'accounts',
      title: t('Accounts'),
      body: () => <AccountsPanel data-testid="accounts-panel" />,
    },
    {
      priv: 'user',
      id: 'signOut',
      title: t('Sign-out'),
      body: () => <SignOutPanel data-testid="signOut-panel" />,
    },
  ];

  const handleOnChangePanel = (id) => {
    navigate(`/settings/${id}`);
  };

  return (
    <Grid container spacing={2} data-testid="settings-page">
      <Grid item xs={12}>
        <PageTitle icon={<Settings />} title={t('Settings')} />
      </Grid>
      <Grid item xs={12}>
        <ControlledAccordion
          panels={panels.filter(
            (panel) => panel.priv === 'any'
              || (panel.priv === 'user' && isSignedIn(service))
              || (panel.priv === 'admin' && isSignedIn(service) && service.me.admin),
          )}
          expanded={params.panel}
          onChange={handleOnChangePanel}
        />
      </Grid>
      {firebaseConfig.apiKey === 'FIREBASE_API_KEY' && (
      <Grid item xs={12}>
        <Button
          onClick={() => { service.setReauthenticationTimeout(0); }}
          aria-label="test"
          color="secondary"
          // variant={buttonVariant}
        >
          Test
        </Button>
        <span style={{ margin: '1em' }}>{service.reauthenticationTimeout}</span>
      </Grid>
      )}
    </Grid>
  );
};

export default SettingsPage;

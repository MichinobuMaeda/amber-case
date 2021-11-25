import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Settings from '@mui/icons-material/Settings';
import Info from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';

import './conf/i18n';
import {
  Header, LoadingPage, SignInPage, EmailVerificationPage, HomePage,
  AccordionPage, ThemeModePanel, MyDisplayNamePanel,
  ReauthenticationPanel, MyPasswordPanel, MyEmailPanel,
  AccountsPanel, GroupsPanel, SignOutPanel,
  PolicyPanel,
} from './components';
import {
  AppContext, isSignedIn,
  acceptAny, acceptUser, acceptAdmin,
} from './api';

const App = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);

  const TopPage = () => {
    if (isSignedIn(context)) {
      return <HomePage />;
    }
    if (context.me.id) {
      return <EmailVerificationPage />;
    }
    return <SignInPage />;
  };

  const SettingPage = () => (
    <AccordionPage
      data-testid="settings-page"
      icon={<Settings />}
      title={t('Settings')}
      route="settings"
      panels={[
        {
          priv: acceptAny,
          id: 'themeMode',
          title: t('Theme mode'),
          body: <ThemeModePanel />,
        },
        {
          priv: acceptUser,
          id: 'myDisplayName',
          title: t('My display name'),
          body: <MyDisplayNamePanel />,
        },
        {
          priv: acceptUser,
          id: 'myPassword',
          title: t('My password'),
          body: context.reauthenticationTimeout
            ? <MyPasswordPanel />
            : <ReauthenticationPanel data-testid="reauthentication1-panel" />,
        },
        {
          priv: acceptUser,
          id: 'myEmail',
          title: t('My E-mail'),
          body: context.reauthenticationTimeout
            ? <MyEmailPanel />
            : <ReauthenticationPanel data-testid="reauthentication2-panel" />,
        },
        {
          priv: acceptAdmin,
          id: 'accounts',
          title: t('Accounts'),
          body: <AccountsPanel />,
        },
        {
          priv: acceptAdmin,
          id: 'groups',
          title: t('Groups'),
          body: <GroupsPanel />,
        },
        {
          priv: acceptUser,
          id: 'signOut',
          title: t('Sign-out'),
          body: <SignOutPanel />,
        },
      ]}
    />
  );

  const InfoPage = () => (
    <AccordionPage
      data-testid="info-page"
      icon={<Info />}
      title={t('Information')}
      route="info"
      panels={[
        {
          priv: acceptAny,
          id: 'policy',
          title: t('Policy'),
          body: <PolicyPanel />,
        },
      ]}
    />
  );

  return (
    <>
      <Header />
      {context.conf.id ? (
        <Routes>
          <Route path="/" element={<TopPage />}>
            <Route path="settings" element={<SettingPage />}>
              <Route path=":panel" element={<SettingPage />} />
            </Route>
            <Route path="info" element={InfoPage}>
              <Route path=":panel" element={InfoPage} />
            </Route>
          </Route>
        </Routes>
      ) : (
        <LoadingPage error={context.conf.error} />
      )}
    </>
  );
};

export default App;

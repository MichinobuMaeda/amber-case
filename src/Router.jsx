import React, { useContext } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

import { i18n } from './conf';
import { AppContext, isAllowed } from './api';
import {
  HomePage, LoadingPage, InfoPage, SignInPage,
  EmailVerificationPage, PreferencesPage,
} from './pages';
import Layout from './Layout';

export const menuItems = (context) => [
  {
    path: '/',
    require: 'user',
    title: i18n.t('Home'),
    icon: <HomeIcon />,
    top: true,
  },
  {
    path: '/signin',
    require: 'guest',
    title: i18n.t('Sign-in'),
    icon: <LoginIcon />,
    top: true,
  },
  {
    path: '/emailVerify',
    require: 'pending',
    title: i18n.t('E-mail verification'),
    icon: <MarkEmailReadIcon />,
    top: true,
  },
  {
    path: '/me',
    require: 'loaded',
    title: context.me.name
      ? i18n.t('One\'s preferences', { name: context.me.name })
      : i18n.t('Preferences'),
    icon: <AccountCircleIcon />,
  },
  {
    path: '/info',
    require: 'loaded',
    title: i18n.t('About this app'),
    icon: <InfoIcon />,
  },
].filter((item) => isAllowed(context, item.require));

const Router = () => {
  const context = useContext(AppContext);
  return (
    <Routes>
      <Route path="/" element={(<Layout menu-items={menuItems(context)}><Outlet /></Layout>)}>
        <Route index element={<HomePage />} />
        <Route path="loading" element={<LoadingPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="emailVerify" element={<EmailVerificationPage />} />
        <Route path="me" element={<PreferencesPage />} />
        <Route path="info" element={<InfoPage />} />
      </Route>
    </Routes>
  );
};

export default Router;

import React, { useContext } from 'react';
import {
  Routes, Route, Outlet, useLocation,
  Navigate,
} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

import { i18n } from './conf';
import {
  AppContext, currentPage, MenuItem, hasPriv,
} from './api';
import EmailVerificationPage from './pages/EmailVerificationPage';
import HomePage from './pages/HomePage';
import LoadingPage from './pages/LoadingPage';
import InfoPage from './pages/InfoPage';
import PreferencesPage from './pages/PreferencesPage';
import SignInPage from './pages/SignInPage';
import Guard from './components/Guard';
import Layout from './Layout';

const pages = (context) => [
  new MenuItem({
    path: '',
    require: 'user',
    title: i18n.t('Home'),
    icon: <HomeIcon />,
    element: <HomePage />,
    top: true,
  }),
  new MenuItem({
    path: 'loading',
    require: 'loading',
    element: <LoadingPage />,
    top: true,
  }),
  new MenuItem({
    path: 'signin',
    require: 'guest',
    title: i18n.t('Sign-in'),
    icon: <LoginIcon />,
    element: <SignInPage />,
    top: true,
  }),
  new MenuItem({
    path: 'emailVerify',
    require: 'pending',
    title: i18n.t('E-mail verification'),
    icon: <MarkEmailReadIcon />,
    element: <EmailVerificationPage />,
    top: true,
  }),
  new MenuItem({
    path: 'prefs',
    require: 'loaded',
    title: context.me.name
      ? i18n.t('One\'s preferences', { name: context.me.name })
      : i18n.t('Preferences'),
    icon: <AccountCircleIcon />,
    element: <PreferencesPage />,
  }),
  new MenuItem({
    path: 'info',
    require: 'loaded',
    title: i18n.t('About this app'),
    icon: <InfoIcon />,
    element: <InfoPage />,
  }),
  new MenuItem({
    path: '*',
    require: 'noroute',
    element: <Navigate to="/" replace />,
  }),
];

const Router = () => {
  const context = useContext(AppContext);
  const location = useLocation();

  return (
    <Guard require={currentPage(location, pages(context)).require} redirect>
      <Routes>
        <Route
          path="/"
          element={(
            <Layout pages={pages(context).filter((item) => hasPriv(context, item.require))}>
              <Outlet />
            </Layout>
          )}
        >
          {pages(context).map((item) => (item.path === ''
            ? <Route key={item.path} element={item.element} index />
            : <Route key={item.path} element={item.element} path={item.path} />))}
        </Route>
      </Routes>
    </Guard>
  );
};

export default Router;

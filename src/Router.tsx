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
import AppContext, { Context } from './api/AppContext';
import {
  currentPage, MenuItem, hasPriv, Priv,
} from './api/authorization';
import EmailVerificationPage from './pages/EmailVerificationPage';
import HomePage from './pages/HomePage';
import LoadingPage from './pages/LoadingPage';
import InfoPage from './pages/InfoPage';
import PreferencesPage from './pages/PreferencesPage';
import SignInPage from './pages/SignInPage';
import Guard from './components/Guard';
import Layout from './Layout';

const pages = (context: Context): MenuItem[] => [
  {
    path: '',
    require: Priv.USER,
    title: i18n.t('Home'),
    icon: <HomeIcon />,
    element: <HomePage />,
    top: true,
  },
  {
    path: 'loading',
    require: Priv.LOADING,
    element: <LoadingPage />,
    top: true,
  },
  {
    path: 'signin',
    require: Priv.GUEST,
    title: i18n.t('Sign-in'),
    icon: <LoginIcon />,
    element: <SignInPage />,
    top: true,
  },
  {
    path: 'emailVerify',
    require: Priv.PENDING,
    title: i18n.t('E-mail verification'),
    icon: <MarkEmailReadIcon />,
    element: <EmailVerificationPage />,
    top: true,
  },
  {
    path: 'prefs',
    require: Priv.LOADED,
    title: context.me?.name
      ? i18n.t('One\'s preferences', { name: context.me!.name })
      : i18n.t('Preferences'),
    icon: <AccountCircleIcon />,
    element: <PreferencesPage />,
  },
  {
    path: 'info',
    require: Priv.LOADED,
    title: i18n.t('About this app'),
    icon: <InfoIcon />,
    element: <InfoPage />,
  },
  {
    path: '*',
    require: Priv.NOROUTE,
    title: '',
    element: <Navigate to="/" replace />,
  },
] as MenuItem[];

const Router = () => {
  const context = useContext(AppContext);
  const location = useLocation();

  return (
    <Guard require={currentPage(location, pages(context))!.require} redirect>
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

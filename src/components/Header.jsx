import React, { useContext } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import Settings from '@mui/icons-material/Settings';
import Info from '@mui/icons-material/Info';
import SystemUpdateAlt from '@mui/icons-material/SystemUpdateAlt';
import { useTranslation } from 'react-i18next/';

import '../conf/i18n';
import { firebaseConfig } from '../conf';
import { AppContext, updateApp } from '../api';
import Debug from './Debug';

const Header = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const location = useLocation();
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const loaded = !!context.conf.id;

  return (
    <>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          {location.pathname !== '/' && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={() => {
                if (navigationType === 'POP') {
                  navigate('/', { replace: true });
                } else {
                  navigate(-1);
                }
              }}
            >
              <ArrowBackIosNew />
            </IconButton>
          )}
          <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
            {t('App name')}
          </Typography>
          {loaded && (
            <IconButton
              size="large"
              color="inherit"
              aria-label="info"
              disabled={location.pathname.startsWith('/info')}
              onClick={() => { navigate('/info/policy'); }}
            >
              <Info />
            </IconButton>
          )}
          {loaded && (
            <IconButton
              size="large"
              color="inherit"
              aria-label="settings"
              disabled={location.pathname.startsWith('/settings')}
              onClick={() => { navigate('/settings/themeMode'); }}
            >
              <Settings />
            </IconButton>
          )}
          {loaded && (firebaseConfig.apiKey === 'FIREBASE_API_KEY' || context.me.tester) && <Debug />}
        </Toolbar>
      </AppBar>
      <Box sx={{ height: 64 }} />
      {context.conf.version && context.conf.version !== context.version && (
        <Button
          aria-label="updateApp"
          startIcon={<SystemUpdateAlt />}
          onClick={() => updateApp(navigator, window)}
          variant="outlined"
          color="warning"
          sx={{ mb: '1em', width: '100%' }}
        >
          {t('Update app')}
        </Button>
      )}
    </>
  );
};

export default Header;

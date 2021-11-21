import React, { useContext } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Button,
} from '@mui/material';
import { ArrowBackIosNew, Settings, SystemUpdateAlt } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import '../conf/i18n';
import { ServiceContext, updateApp } from '../api';

const Header = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const location = useLocation();
  const { t } = useTranslation();
  const service = useContext(ServiceContext);
  const loaded = !!service.conf.id;

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
            {t('app name')}
          </Typography>
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
        </Toolbar>
      </AppBar>
      <Box sx={{ height: 64 }} />
      {service.conf.version && service.conf.version !== service.version && (
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

import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Box,
} from '@mui/material';
import { ArrowBackIosNew, Settings } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import '../conf/i18n';

const Header = ({ loaded }) => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const location = useLocation();
  const { t } = useTranslation();

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
              sx={{ mr: 2 }}
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('app name')}
          </Typography>
          {loaded && (
            <IconButton
              size="large"
              color="inherit"
              aria-label="settings"
              disabled={location.pathname.startsWith('/settings')}
              sx={{ ml: 2 }}
              onClick={() => {
                if (location.pathname.startsWith('/policy') && navigate.action !== 'POP') {
                  navigate(-1);
                } else {
                  navigate('/settings/themeMode');
                }
              }}
            >
              <Settings />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ height: 64 }} />
    </>
  );
};

Header.propTypes = {
  loaded: PropTypes.bool.isRequired,
};

export default Header;

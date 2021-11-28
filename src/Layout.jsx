import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  useLocation, useNavigate, useNavigationType, // useResolvedPath,
} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import MenuIcon from '@mui/icons-material/Menu';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdateAlt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';

import './conf/i18n';
import { firebaseConfig, menuWidth } from './conf';
import { AppContext, updateApp } from './api';
import Debug from './components/Debug';

const Layout = ({ 'menu-items': menuItems, children }) => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const location = useLocation();
  const loaded = !!context.conf.id;
  const [menuOpen, setMenuOpen] = useState(false);
  const matchedMenuItem = menuItems.find((item) => item.path === location.pathname) || {};

  const MenuItem = () => (
    <>
      <Toolbar variant="dense" />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={item.path === location.pathname}
            onClick={() => { navigate(item.path); setMenuOpen(false); }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.title}</ListItemText>
          </ListItemButton>
        ))}
      </List>
    </>
  );

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense">
          {!matchedMenuItem.top && (
            <IconButton
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
          {loaded && (firebaseConfig.apiKey === 'FIREBASE_API_KEY' || context.me.tester) && <Debug />}
          {loaded && (
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenuToggle}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              {menuOpen ? <ChevronRightIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={menuOpen}
        onClose={handleMenuToggle}
        ModalProps={{ keepMounted: true }}
        anchor="right"
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: menuWidth, maxWidth: '100%' },
        }}
      >
        <MenuItem />
      </Drawer>
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: menuWidth },
        }}
        open
      >
        <MenuItem />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${menuWidth}px)` },
        }}
      >
        <Toolbar variant="dense" />
        {context.conf.version && context.conf.version !== context.version && (
          <Button
            aria-label="updateApp"
            startIcon={<SystemUpdateIcon />}
            onClick={() => updateApp(navigator, window)}
            variant="outlined"
            color="warning"
            sx={{ mb: '1em', width: '100%' }}
          >
            {t('Update app')}
          </Button>
        )}
        {(matchedMenuItem.title || matchedMenuItem.icon) && (
        <Typography variant="h2" component="div" sx={{ mb: 3 }}>
          <span style={{ marginRight: '0.25em' }}>{matchedMenuItem.icon}</span>
          {matchedMenuItem.title}
        </Typography>
        )}
        {children}
      </Box>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  'menu-items': PropTypes.array.isRequired,
};

export default Layout;

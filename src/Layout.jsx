import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MenuIcon from '@mui/icons-material/Menu';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdateAlt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';

import './conf/i18n';
import { firebaseConfig, menuWidth, shrinkMenuBreakPoint } from './conf';
import {
  AppContext, updateApp, hasPriv, currentPage, MenuItem,
} from './api';
import Debug from './components/Debug';
import Guard from './components/Guard';

const Layout = ({ pages, children }) => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const shrinkMenu = useMediaQuery(useTheme().breakpoints.down(shrinkMenuBreakPoint));
  const currPage = currentPage(location, pages);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense">
          {!currPage?.top && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={() => { navigate(-1); }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}
          <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
            {t('App name')}
          </Typography>
          <Guard require="loaded">
            {(firebaseConfig.apiKey === 'FIREBASE_API_KEY' || context.me.tester) && <Debug />}
            {shrinkMenu && (
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <ChevronRightIcon /> : <MenuIcon />}
              </IconButton>
            )}
          </Guard>
        </Toolbar>
      </AppBar>
      <Guard require="loaded">
        <Drawer
          variant={shrinkMenu ? 'temporary' : 'permanent'}
          open={!shrinkMenu || menuOpen}
          onClose={shrinkMenu ? () => setMenuOpen(false) : null}
          ModalProps={shrinkMenu ? { keepMounted: true } : {}}
          anchor="right"
          sx={shrinkMenu ? {
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: menuWidth, maxWidth: '100%' },
          } : {
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: menuWidth },
          }}
        >
          <Toolbar variant="dense" />
          <List>
            {pages.map((item) => (
              <ListItemButton
                key={`/${item.path}`}
                selected={`/${item.path}` === location.pathname}
                onClick={() => { navigate(`/${item.path}`); setMenuOpen(false); }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.title}</ListItemText>
              </ListItemButton>
            ))}
          </List>
        </Drawer>
      </Guard>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 2, sm: 3 },
          width: (hasPriv(context, 'loaded') && !shrinkMenu) ? `calc(100% - ${menuWidth}px)` : null,
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
        {(currPage?.title || currPage?.icon) && (
        <Typography variant="h2" component="div" sx={{ mb: 3 }}>
          <span style={{ marginRight: '0.25em' }}>{currPage?.icon}</span>
          {currPage?.title}
        </Typography>
        )}
        {children}
      </Box>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  pages: PropTypes.arrayOf(PropTypes.instanceOf(MenuItem)).isRequired,
};

export default Layout;

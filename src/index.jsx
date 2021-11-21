import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useMediaQuery } from '@material-ui/core';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { HashRouter } from 'react-router-dom';

import { firebaseConfig, reauthentication } from './conf';
import {
  initializeFirebase, listenFirebase,
  ServiceContext, selectThemeMode,
} from './api';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const {
  auth, db, storage, functions,
} = initializeFirebase(firebaseConfig);

const AppBase = () => {
  const service = useContext(ServiceContext);
  service.auth = auth;
  service.db = db;
  service.storage = storage;
  service.functions = functions;

  const [themeMode, setThemeMode] = useState('light');
  service.themeMode = themeMode;
  service.setThemeMode = setThemeMode;
  service.preferColorScheme = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';

  const [conf, setConf] = useState({});
  service.conf = conf;
  service.setConf = setConf;

  const [authUser, setAuthUser] = useState({});
  service.authUser = authUser;
  service.setAuthUser = setAuthUser;

  const [me, setMe] = useState({});
  service.me = me;
  service.setMe = setMe;

  const [reauthenticationTimeout, setReauthenticationTimeout] = useState(0);
  service.reauthenticationTimeout = reauthenticationTimeout;
  service.setReauthenticationTimeout = setReauthenticationTimeout;

  useEffect(() => {
    listenFirebase(service, window);

    const intervalId = setInterval(
      () => {
        if (service.reauthenticationTimeout > 0) {
          const nextVal = service.reauthenticationTimeout - reauthentication.updateInterval;
          setReauthenticationTimeout(nextVal < 0 ? 0 : nextVal);
        }
      },
      reauthentication.updateInterval,
    );

    return () => clearInterval(intervalId);
  }, [service]);

  return (
    <React.StrictMode>
      <ThemeProvider theme={createTheme(selectThemeMode(service))}>
        <CssBaseline />
        <Container>
          <HashRouter>
            <App />
          </HashRouter>
        </Container>
      </ThemeProvider>
    </React.StrictMode>
  );
};

ReactDOM.render(<AppBase />, document.getElementById('root'));

serviceWorkerRegistration.register();

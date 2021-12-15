import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { HashRouter } from 'react-router-dom';

import { firebaseConfig, reauthentication } from './conf';
import {
  initializeFirebase, listenFirebase,
  AppContext, selectThemeMode,
} from './api';
import Router from './Router';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const {
  auth, db, storage, functions,
} = initializeFirebase(firebaseConfig);

const App = () => {
  const context = useContext(AppContext);
  context.auth = auth;
  context.db = db;
  context.storage = storage;
  context.functions = functions;

  const [themeMode, setThemeMode] = useState('light');
  context.themeMode = themeMode;
  context.setThemeMode = setThemeMode;
  context.preferColorScheme = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';

  const [conf, setConf] = useState({ uninitialized: true });
  context.conf = conf;
  context.setConf = setConf;

  const [authUser, setAuthUser] = useState({ uninitialized: true });
  context.authUser = authUser;
  context.setAuthUser = setAuthUser;

  const [me, setMe] = useState({});
  context.me = me;
  context.setMe = setMe;

  const [accounts, setAccounts] = useState([]);
  context.accounts = accounts;
  context.setAccounts = setAccounts;

  const [groups, setGroups] = useState([]);
  context.groups = groups;
  context.setGroups = setGroups;

  const [reauthenticationTimeout, setReauthenticationTimeout] = useState(0);
  context.reauthenticationTimeout = reauthenticationTimeout;
  context.setReauthenticationTimeout = setReauthenticationTimeout;

  useEffect(() => {
    listenFirebase(context, window);

    const intervalId = setInterval(
      () => {
        if (context.reauthenticationTimeout > 0) {
          const nextVal = context.reauthenticationTimeout - reauthentication.updateInterval;
          setReauthenticationTimeout(nextVal < 0 ? 0 : nextVal);
        }
      },
      reauthentication.updateInterval,
    );

    return () => clearInterval(intervalId);
  }, [context]);

  return (
    <React.StrictMode>
      <ThemeProvider theme={createTheme(selectThemeMode(context))}>
        <CssBaseline />
        <Container>
          <HashRouter>
            <Router />
          </HashRouter>
        </Container>
      </ThemeProvider>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorkerRegistration.register();

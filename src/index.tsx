import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { HashRouter } from 'react-router-dom';
import { User } from 'firebase/auth';

import { firebaseConfig, reauthentication } from './conf';
import AppContext from './api/AppContext';
import { Conf, Account, Group } from './api/models';
import { listenFirebase } from './api/authentication';
import { initializeFirebase } from './api/firebase';
import { selectThemeMode } from './api/ui';
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

  const [conf, setConf] = useState(null);
  context.conf = conf;
  context.setConf = setConf as (conf: Conf | null) => void;

  const [authUser, setAuthUser] = useState(null);
  context.authUser = authUser;
  context.setAuthUser = setAuthUser as (authUser: User | null) => void;

  const [me, setMe] = useState({} as Account);
  context.me = me;
  context.setMe = setMe;

  const [accounts, setAccounts] = useState([]);
  context.accounts = accounts;
  context.setAccounts = setAccounts as (accounts: Account[]) => void;

  const [groups, setGroups] = useState([]);
  context.groups = groups;
  context.setGroups = setGroups as (accounts: Group[]) => void;

  const [reauthenticationTimeout, setReauthenticationTimeout] = useState(0);
  context.reauthenticationTimeout = reauthenticationTimeout;
  context.setReauthenticationTimeout = setReauthenticationTimeout;

  useEffect(() => {
    listenFirebase(context, window);

    const intervalId = setInterval(
      () => {
        if ((context.reauthenticationTimeout ?? 0) > 0) {
          const nextVal = (context.reauthenticationTimeout ?? 0) - reauthentication.updateInterval;
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

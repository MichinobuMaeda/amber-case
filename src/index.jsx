import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useMediaQuery } from '@material-ui/core';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import firebaseCompat from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/functions';

import { firebaseConfig, version } from './conf';
import {
  selectThemeMode, listenFirebase,
} from './api';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const firebaseApp = firebaseCompat.initializeApp(firebaseConfig);
const service = {
  version,
  auth: firebaseApp.auth(),
  db: firebaseApp.firestore(),
  storage: firebaseApp.storage(),
  functions: firebaseApp.functions(),
  unsubConf: null,
  unsub: {}, // key: path, value: function
};

if (firebaseConfig.apiKey === 'FIREBASE_API_KEY') {
  service.auth.useEmulator('http://localhost:9099');
  service.db.useEmulator('localhost', 8080);
  service.storage.useEmulator('localhost', 9199);
  service.functions.useEmulator('localhost', 5001);
}

const AppBase = () => {
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

  useEffect(() => {
    listenFirebase(service, window);
  }, []);

  return (
    <React.StrictMode>
      <ThemeProvider theme={createTheme(selectThemeMode(service))}>
        <CssBaseline />
        <Container maxWidth="xl">
          <BrowserRouter>
            <App service={service} />
          </BrowserRouter>
        </Container>
      </ThemeProvider>
    </React.StrictMode>
  );
};

ReactDOM.render(<AppBase />, document.getElementById('root'));

serviceWorkerRegistration.register();

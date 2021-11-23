import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Header, LoadingPage, SignInPage, EmailVerificationPage,
  HomePage, SettingsPage, PolicyPage,
} from './components';
import { AppContext, isSignedIn } from './api';

const App = () => {
  const context = useContext(AppContext);
  return (
    <>
      <Header />
      {!context.conf.id && (<LoadingPage error={context.conf.error} />)}
      {context.conf.id && (
      <Routes>
        <Route
          path="/"
          element={(
            <>
              {!context.me.id && <SignInPage />}
              {context.me.id && !isSignedIn(context) && <EmailVerificationPage />}
              {isSignedIn(context) && <HomePage />}
            </>
          )}
        />
        <Route path="settings/:panel" element={<SettingsPage />} />
        <Route path="policy" element={<PolicyPage />} />
      </Routes>
      )}
    </>
  );
};

export default App;

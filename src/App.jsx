import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Header, LoadingPage, SignInPage, EmailVerificationPage,
  HomePage, SettingsPage, PolicyPage,
} from './views';
import { ServiceContext, isSignedIn } from './api';

const App = () => {
  const service = useContext(ServiceContext);
  return (
    <>
      <Header />
      {!service.conf.id && (<LoadingPage error={service.conf.error} />)}
      {service.conf.id && (
      <Routes>
        <Route
          path="/"
          element={(
            <>
              {!service.me.id && <SignInPage />}
              {service.me.id && !isSignedIn(service) && <EmailVerificationPage />}
              {isSignedIn(service) && <HomePage />}
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

import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Header, LoadingErrorPage, LoadingPage,
  SignInPage, HomePage, SettingsPage, PolicyPage,
} from './components';
import { ServiceContext } from './api';

const TopPage = () => {
  const service = useContext(ServiceContext);
  return (
    <>
      {!service.me.id && <SignInPage service={service} />}
      {service.me.id && <HomePage service={service} />}
    </>
  );
};

const App = () => {
  const service = useContext(ServiceContext);
  return (
    <>
      <Header />
      {!service.conf.id && !service.conf.error && (<LoadingPage />)}
      {!service.conf.id && service.conf.error && (<LoadingErrorPage />)}
      {service.conf.id && (
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="settings/:panel" element={<SettingsPage service={service} />} />
        <Route path="policy" element={<PolicyPage service={service} />} />
      </Routes>
      )}
    </>
  );
};

export default App;

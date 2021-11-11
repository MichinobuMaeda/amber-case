import React from 'react';
import PropTypes from 'prop-types';
import { Routes, Route } from 'react-router-dom';
import {
  Header, LoadingErrorPage, LoadingPage,
  SignInPage, HomePage, SettingsPage, PolicyPage,
} from './components';

const TopPage = ({ service }) => (
  <>
    {!service.me.id && <SignInPage service={service} />}
    {service.me.id && <HomePage service={service} />}
  </>
);

const App = ({ service }) => (
  <>
    <Header loaded={!!service.conf.id} />
    {!service.conf.id && !service.conf.error && (<LoadingPage />)}
    {!service.conf.id && service.conf.error && (<LoadingErrorPage />)}
    {service.conf.id && (
    <Routes>
      <Route path="/" element={<TopPage service={service} />} />
      <Route path="settings/:panel" element={<SettingsPage service={service} />} />
      <Route path="policy" element={<PolicyPage service={service} />} />
    </Routes>
    )}
  </>
);

TopPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  service: PropTypes.object.isRequired,
};

App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  service: PropTypes.object.isRequired,
};

export default App;

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AppContext } from './api';
import {
  resetMockService, mockContext,
} from './testConfig';
import { i18n } from './conf';

jest.mock('firebase/firestore', () => ({}));
jest.mock('react-markdown', () => 'div');

beforeAll(() => {
  resetMockService();
});

afterEach(() => {
  jest.clearAllMocks();
  resetMockService();
});

describe('App', () => {
  it('show LoadingPage without service.conf on "/".', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('loading-page')).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('loading config'))).toBeInTheDocument();
  });

  it('show LoadingPage without service.conf on "settings/:panel".', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('loading-page')).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('loading config'))).toBeInTheDocument();
  });

  it('show LoadingPage without service.conf on "policy".', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/info/policy' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('loading-page')).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('loading config'))).toBeInTheDocument();
  });

  it('show LoadingPage with error message '
  + 'if failed to load service.conf on "/".', () => {
    mockContext.conf = { error: true };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('loading-page')).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('failed to load config'))).toBeInTheDocument();
  });

  it('show LoadingPage with error message '
  + 'if failed to load service.conf on "settings/:panel".', () => {
    mockContext.conf = { error: true };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('loading-page')).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('failed to load config'))).toBeInTheDocument();
  });

  it('show LoadingPage with error message '
  + 'if failed to load service.conf on "policy".', () => {
    mockContext.conf = { error: true };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/info/policy' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('loading-page')).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('failed to load config'))).toBeInTheDocument();
  });

  it('show SignInPage if not signed in on "/".', () => {
    mockContext.conf = { id: 'conf' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('signIn-page')).toBeInTheDocument();
  });

  it('show Settings if not signed in on "/settings/:panel".', () => {
    mockContext.conf = { id: 'conf' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/settings/x']}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('settings-page')).toBeInTheDocument();
  });

  it('show PolicyPanel if not signed in on "policy".', () => {
    mockContext.conf = { id: 'conf' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/info/policy']}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('policy-page')).toBeInTheDocument();
  });

  it('show EmailVerificationPage if signed in but not email verified on "/".', () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01', emailVerified: false };
    mockContext.me = { id: 'id01' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('emailVerification-page')).toBeInTheDocument();
  });

  it('show HomePage if signed in and email verified on "/".', () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01', emailVerified: true };
    mockContext.me = { id: 'id01' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('home-page')).toBeInTheDocument();
  });

  it('shows panels for guest on route /settings/x.', () => {
    mockContext.conf = { id: 'conf' };
    mockContext.me = { id: 'id01', valid: true, admin: true };
    mockContext.authUser = { uid: 'id01', emailVerified: false };
    mockContext.reauthenticationTimeout = 1;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('themeMode-title')).toBeInTheDocument();
    expect(screen.queryByTestId('themeMode-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-title')).toBeNull();
    expect(screen.queryByTestId('myDisplayName-panel')).toBeNull();
    expect(screen.queryByTestId('myPassword-title')).toBeNull();
    expect(screen.queryByTestId('myPassword-panel')).toBeNull();
    expect(screen.queryByTestId('myEmail-title')).toBeNull();
    expect(screen.queryByTestId('myEmail-panel')).toBeNull();
    expect(screen.queryByTestId('accounts-title')).toBeNull();
    expect(screen.queryByTestId('accounts-panel')).toBeNull();
    expect(screen.queryByTestId('groups-title')).toBeNull();
    expect(screen.queryByTestId('groups-panel')).toBeNull();
    expect(screen.queryByTestId('signOut-title')).toBeNull();
    expect(screen.queryByTestId('signOut-panel')).toBeNull();

    expect(screen.queryByTestId('reauthentication1-panel')).toBeNull();
    expect(screen.queryByTestId('reauthentication2-panel')).toBeNull();
  });

  it('shows panels for user on route /settings/x.', () => {
    mockContext.conf = { id: 'conf' };
    mockContext.me = { id: 'id01', valid: true, admin: false };
    mockContext.authUser = { uid: 'id01', emailVerified: true };
    mockContext.reauthenticationTimeout = 1;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('themeMode-title')).toBeInTheDocument();
    expect(screen.queryByTestId('themeMode-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-title')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myPassword-title')).toBeInTheDocument();
    expect(screen.queryByTestId('myPassword-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myEmail-title')).toBeInTheDocument();
    expect(screen.queryByTestId('myEmail-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('accounts-title')).toBeNull();
    expect(screen.queryByTestId('accounts-panel')).toBeNull();
    expect(screen.queryByTestId('groups-title')).toBeNull();
    expect(screen.queryByTestId('groups-panel')).toBeNull();
    expect(screen.queryByTestId('signOut-title')).toBeInTheDocument();
    expect(screen.queryByTestId('signOut-panel')).toBeInTheDocument();

    expect(screen.queryByTestId('reauthentication1-panel')).toBeNull();
    expect(screen.queryByTestId('reauthentication2-panel')).toBeNull();
  });

  it('shows panels for admin on route /settings/x.', () => {
    mockContext.conf = { id: 'conf' };
    mockContext.me = { id: 'id01', valid: true, admin: true };
    mockContext.authUser = { uid: 'id01', emailVerified: true };
    mockContext.reauthenticationTimeout = 1;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('themeMode-title')).toBeInTheDocument();
    expect(screen.queryByTestId('themeMode-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-title')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myPassword-title')).toBeInTheDocument();
    expect(screen.queryByTestId('myPassword-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myEmail-title')).toBeInTheDocument();
    expect(screen.queryByTestId('myEmail-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('accounts-title')).toBeInTheDocument();
    expect(screen.queryByTestId('accounts-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('groups-title')).toBeInTheDocument();
    expect(screen.queryByTestId('groups-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('signOut-title')).toBeInTheDocument();
    expect(screen.queryByTestId('signOut-panel')).toBeInTheDocument();

    expect(screen.queryByTestId('reauthentication1-panel')).toBeNull();
    expect(screen.queryByTestId('reauthentication2-panel')).toBeNull();
  });

  it('shows reauthentication panels if authenticaatoin expired.', () => {
    mockContext.conf = { id: 'conf' };
    mockContext.me = { id: 'id01', valid: true, admin: true };
    mockContext.authUser = { uid: 'id01', emailVerified: true };
    mockContext.reauthenticationTimeout = 0;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('reauthentication1-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('reauthentication2-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myEmail-panel')).toBeNull();
    expect(screen.queryByTestId('myPassword-panel')).toBeNull();
  });

  it('show PolicyPanel if signed in on "/info/policy".', () => {
    mockContext.conf = { id: 'conf' };
    mockContext.me = { id: 'id01' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/info/policy' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('info-page')).toBeInTheDocument();
  });
});

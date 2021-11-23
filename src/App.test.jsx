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
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
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
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
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
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
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
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
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
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('signIn-page')).toBeInTheDocument();
  });

  it('show Settings if not signed in on "settings/:panel".', () => {
    mockContext.conf = { id: 'conf' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('settings-page')).toBeInTheDocument();
  });

  it('show PolicyPage if not signed in on "policy".', () => {
    mockContext.conf = { id: 'conf' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
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
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
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
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('home-page')).toBeInTheDocument();
  });

  it('show Settings if signed in on "settings/:panel".', () => {
    mockContext.conf = { id: 'conf' };
    mockContext.me = { id: 'id01' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('settings-page')).toBeInTheDocument();
  });

  it('show PolicyPage if signed in on "policy".', () => {
    mockContext.conf = { id: 'conf' };
    mockContext.me = { id: 'id01' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <App />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('policy-page')).toBeInTheDocument();
  });
});

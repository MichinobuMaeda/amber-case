/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { ServiceContext } from './api';

afterEach(() => {
  jest.clearAllMocks();
});

describe('App', () => {
  it('show LoadingPage without service.conf on "/".', () => {
    const service = {
      conf: {},
      me: {},
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingPage')).toBeInTheDocument();
  });

  it('show LoadingPage without service.conf on "settings/:panel".', () => {
    const service = {
      conf: {},
      me: {},
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingPage')).toBeInTheDocument();
  });

  it('show LoadingPage without service.conf on "policy".', () => {
    const service = {
      conf: {},
      me: {},
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingPage')).toBeInTheDocument();
  });

  it('show LoadingErrorPage if failed to load service.conf on "/".', () => {
    const service = {
      conf: { error: true },
      me: {},
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingErrorPage')).toBeInTheDocument();
  });

  it('show LoadingErrorPage if failed to load service.conf on "settings/:panel".', () => {
    const service = {
      conf: { error: true },
      me: {},
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingErrorPage')).toBeInTheDocument();
  });

  it('show LoadingErrorPage if failed to load service.conf on "policy".', () => {
    const service = {
      conf: { error: true },
      me: {},
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingErrorPage')).toBeInTheDocument();
  });

  it('show SignInPage if not signed in on "/".', () => {
    const service = {
      conf: { id: 'conf' },
      me: {},
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('SignInPage')).toBeInTheDocument();
  });

  it('show Settings if not signed in on "settings/:panel".', () => {
    const service = {
      conf: { id: 'conf' },
      me: {},
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('SettingsPage')).toBeInTheDocument();
  });

  it('show PolicyPage if not signed in on "policy".', () => {
    const service = {
      conf: { id: 'conf' },
      me: {},
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('PolicyPage')).toBeInTheDocument();
  });

  it('show HomePage if signed in on "/".', () => {
    const service = {
      conf: { id: 'conf' },
      me: { id: 'id01' },
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('HomePage')).toBeInTheDocument();
  });

  it('show Settings if signed in on "settings/:panel".', () => {
    const service = {
      conf: { id: 'conf' },
      me: { id: 'id01' },
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('SettingsPage')).toBeInTheDocument();
  });

  it('show PolicyPage if signed in on "policy".', () => {
    const service = {
      conf: { id: 'conf' },
      me: { id: 'id01' },
    };
    render(
      <ServiceContext.Provider value={service}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('PolicyPage')).toBeInTheDocument();
  });
});

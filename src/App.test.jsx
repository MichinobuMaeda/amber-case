/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { ServiceContext } from './api';
import {
  resetMockService, mockService,
} from './testConfig';

jest.mock('firebase/firestore', () => ({}));

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
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingPage')).toBeInTheDocument();
  });

  it('show LoadingPage without service.conf on "settings/:panel".', () => {
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingPage')).toBeInTheDocument();
  });

  it('show LoadingPage without service.conf on "policy".', () => {
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingPage')).toBeInTheDocument();
  });

  it('show LoadingErrorPage if failed to load service.conf on "/".', () => {
    mockService.conf = { error: true };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingErrorPage')).toBeInTheDocument();
  });

  it('show LoadingErrorPage if failed to load service.conf on "settings/:panel".', () => {
    mockService.conf = { error: true };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingErrorPage')).toBeInTheDocument();
  });

  it('show LoadingErrorPage if failed to load service.conf on "policy".', () => {
    mockService.conf = { error: true };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('LoadingErrorPage')).toBeInTheDocument();
  });

  it('show SignInPage if not signed in on "/".', () => {
    mockService.conf = { id: 'conf' };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('SignInPage')).toBeInTheDocument();
  });

  it('show Settings if not signed in on "settings/:panel".', () => {
    mockService.conf = { id: 'conf' };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('SettingsPage')).toBeInTheDocument();
  });

  it('show PolicyPage if not signed in on "policy".', () => {
    mockService.conf = { id: 'conf' };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('PolicyPage')).toBeInTheDocument();
  });

  it('show HomePage if signed in on "/".', () => {
    mockService.conf = { id: 'conf' };
    mockService.me = { id: 'id01' };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('HomePage')).toBeInTheDocument();
  });

  it('show Settings if signed in on "settings/:panel".', () => {
    mockService.conf = { id: 'conf' };
    mockService.me = { id: 'id01' };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('SettingsPage')).toBeInTheDocument();
  });

  it('show PolicyPage if signed in on "policy".', () => {
    mockService.conf = { id: 'conf' };
    mockService.me = { id: 'id01' };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <App />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('PolicyPage')).toBeInTheDocument();
  });
});

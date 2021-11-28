import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { i18n, firebaseConfig } from './conf';
import { resetMockService, mockContext } from './testConfig';

let mockNavigationType;
const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigationType: jest.fn(() => mockNavigationType),
  useNavigate: () => mockUseNavigate,
}));

const mockUpdateApp = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  updateApp: mockUpdateApp,
}));

// work around for mocking problem.
const { AppContext } = require('./api');
const { Layout } = require('.');

beforeEach(() => {
  resetMockService();
});

describe('Layout', () => {
  it('hides the back button and hides the settings button, '
    + 'on "/" and if the conf is not loaded.', () => {
    render(
      <AppContext.Provider value={{ conf: {} }}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('App name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'settings' })).toBeNull();
  });

  it('hides the back button and shows the settings button, '
    + 'on "/" and if the conf is loaded.', () => {
    render(
      <AppContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('App name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'settings' })).toBeInTheDocument();
  });

  it('shows back button and hides settings button, '
    + 'on "/settings/x" and if the conf is not loaded.', () => {
    render(
      <AppContext.Provider value={{ conf: {} }}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('App name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'settings' })).toBeNull();
  });

  it('shows back button and disables settings button, '
    + 'on "/settings/x" and if the conf is loaded.', () => {
    render(
      <AppContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('App name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'settings' })).toHaveAttribute('disabled');
  });

  it('shows back button and shows settings button, '
    + 'on "/Info" and if the conf is not loaded.', () => {
    render(
      <AppContext.Provider value={{ conf: {} }}>
        <MemoryRouter initialEntries={[{ pathname: '/Info' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('App name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'settings' })).toBeNull();
  });

  it('shows back button and shows settings button, '
    + 'on "/Info" and if the conf is loaded.', () => {
    render(
      <AppContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/Info' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('App name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'settings' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'settings' })).not.toHaveAttribute('disabled');
  });

  it('calls navigation("/", { replace: true }) on the back button, '
  + 'if history has no entry.', () => {
    mockNavigationType = 'POP';
    render(
      <AppContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/Info' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    userEvent.click(screen.queryByRole('button', { name: 'back' }));
    expect(mockUseNavigate.mock.calls.length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0].length).toEqual(2);
    expect(mockUseNavigate.mock.calls[0][0]).toEqual('/');
    expect(mockUseNavigate.mock.calls[0][1]).toEqual({ replace: true });
  });

  it('calls navigation(-1) on the back button, '
  + 'if history has entries.', () => {
    mockNavigationType = 'PUSH';
    render(
      <AppContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/Info' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    userEvent.click(screen.queryByRole('button', { name: 'back' }));
    expect(mockUseNavigate.mock.calls.length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0].length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0][0]).toEqual(-1);
  });

  it('calls navigation("/settings/themeMode") on the settings button.', () => {
    mockNavigationType = 'PUSH';
    render(
      <AppContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    userEvent.click(screen.queryByRole('button', { name: 'settings' }));
    expect(mockUseNavigate.mock.calls.length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0].length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0][0]).toEqual('/settings/themeMode');
  });

  it('do not shows button appUpdate if this app is latest version.', () => {
    mockContext.conf = {
      id: 'conf',
      version: mockContext.version,
    };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'updateApp' })).toBeNull();
  });

  it('shows button appUpdate if this app is out of date.', () => {
    mockContext.conf = {
      id: 'conf',
      version: 'x.x.x',
    };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'updateApp' })).toBeInTheDocument();

    userEvent.click(screen.queryByRole('button', { name: 'updateApp' }));
    expect(mockUpdateApp.mock.calls.length).toEqual(1);
  });

  it('shows debug dialog on click button debug.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.me = { id: 'id01', valid: true, tester: true };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    userEvent.click(screen.queryByRole('button', { name: 'debug' }));
    expect(screen.getByRole('button', { label: 'close' })).toBeInTheDocument();
  });

  it('hides button debug before loading.', async () => {
    mockContext.conf = {};
    mockContext.me = { id: 'id01', valid: true, tester: true };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'debug' })).toBeNull();
  });

  it('hides button debug on production without tester priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.me = { id: 'id01', valid: true, tester: false };
    firebaseConfig.apiKey = 'production key';
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'debug' })).toBeNull();
  });

  it('shows button debug on production with tester priv.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.me = { id: 'id01', valid: true, tester: true };
    firebaseConfig.apiKey = 'production key';
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'debug' })).toBeInTheDocument();
  });
});

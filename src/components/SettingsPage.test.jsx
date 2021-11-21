import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n, firebaseConfig } from '../conf';
import {
  resetMockService, mockService,
  mockSetReauthenticationTimeout,
} from '../testConfig';

jest.mock('firebase/firestore', () => ({}));

const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: mockUseParams,
}));

const mockHandleSignOut = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  handleSignOut: mockHandleSignOut,
}));

// work around for mocking problem.
const { MemoryRouter } = require('react-router-dom');
const { ServiceContext } = require('../api');
const { SettingsPage } = require('.');

beforeEach(() => {
  resetMockService();
});

describe('SettingsPage', () => {
  it('shows panels for user '
  + 'if user has signed in and email has verified.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockService.me = { id: 'id01', valid: true };
    mockService.authUser = { uid: 'id01', emailVerified: true };
    mockService.reauthenticationTimeout = 1;
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
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
    expect(screen.queryByTestId('signOut-title')).toBeInTheDocument();
    expect(screen.queryByTestId('signOut-panel')).toBeInTheDocument();

    expect(screen.queryByTestId('reauthentication1-panel')).toBeNull();
    expect(screen.queryByTestId('reauthentication2-panel')).toBeNull();
  });

  it('shows panels for user with reauthentication panel '
  + 'if reauthentication timer was expired.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockService.me = { id: 'id01', valid: true };
    mockService.authUser = { uid: 'id01', emailVerified: true };
    mockService.reauthenticationTimeout = 0;
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByTestId('themeMode-title')).toBeInTheDocument();
    expect(screen.queryByTestId('themeMode-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-title')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myPassword-title')).toBeInTheDocument();
    expect(screen.queryByTestId('reauthentication1-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myEmail-title')).toBeInTheDocument();
    expect(screen.queryByTestId('reauthentication2-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('accounts-title')).toBeNull();
    expect(screen.queryByTestId('accounts-panel')).toBeNull();
    expect(screen.queryByTestId('signOut-title')).toBeInTheDocument();
    expect(screen.queryByTestId('signOut-panel')).toBeInTheDocument();

    expect(screen.queryByTestId('myEmail-panel')).toBeNull();
    expect(screen.queryByTestId('myPassword-panel')).toBeNull();
  });

  it('shows panels for admin '
  + 'if admin user has signed in and email has verified.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockService.me = { id: 'id01', valid: true, admin: true };
    mockService.authUser = { uid: 'id01', emailVerified: true };
    mockService.reauthenticationTimeout = 1;
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
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
    expect(screen.queryByTestId('signOut-title')).toBeInTheDocument();
    expect(screen.queryByTestId('signOut-panel')).toBeInTheDocument();

    expect(screen.queryByTestId('reauthentication1-panel')).toBeNull();
    expect(screen.queryByTestId('reauthentication2-panel')).toBeNull();
  });

  it('hides panels for guest '
  + 'if email has not verified.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockService.me = { id: 'id01', valid: true };
    mockService.authUser = { uid: 'id01', emailVerified: false };
    mockService.reauthenticationTimeout = 1;
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeNull();
    expect(screen.queryByTestId('themeMode-title')).toBeInTheDocument();
    expect(screen.queryByTestId('themeMode-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-title')).toBeNull();
    expect(screen.queryByTestId('myDisplayNamepanel')).toBeNull();
    expect(screen.queryByTestId('myPassword-title')).toBeNull();
    expect(screen.queryByTestId('myPassword-panel')).toBeNull();
    expect(screen.queryByTestId('myEmail-title')).toBeNull();
    expect(screen.queryByTestId('myEmail-panel')).toBeNull();
    expect(screen.queryByTestId('accounts-title')).toBeNull();
    expect(screen.queryByTestId('accounts-panel')).toBeNull();
    expect(screen.queryByTestId('signOut-title')).toBeNull();
    expect(screen.queryByTestId('signOut-panel')).toBeNull();

    expect(screen.queryByTestId('reauthentication1-panel')).toBeNull();
    expect(screen.queryByTestId('reauthentication2-panel')).toBeNull();
  });

  it('hides panels for guest '
  + 'if user has not signed in.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockService.me = {};
    mockService.authUser = {};
    mockService.reauthenticationTimeout = 1;
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeNull();
    expect(screen.queryByTestId('themeMode-title')).toBeInTheDocument();
    expect(screen.queryByTestId('themeMode-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-title')).toBeNull();
    expect(screen.queryByTestId('myDisplayNamepanel')).toBeNull();
    expect(screen.queryByTestId('myPassword-title')).toBeNull();
    expect(screen.queryByTestId('myPassword-panel')).toBeNull();
    expect(screen.queryByTestId('myEmail-title')).toBeNull();
    expect(screen.queryByTestId('myEmail-panel')).toBeNull();
    expect(screen.queryByTestId('accounts-title')).toBeNull();
    expect(screen.queryByTestId('accounts-panel')).toBeNull();
    expect(screen.queryByTestId('signOut-title')).toBeNull();
    expect(screen.queryByTestId('signOut-panel')).toBeNull();

    expect(screen.queryByTestId('reauthentication1-panel')).toBeNull();
    expect(screen.queryByTestId('reauthentication2-panel')).toBeNull();
  });

  it('shows the body of the selected panel.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'myPassword' }));
    mockService.me = { id: 'id01', valid: true, admin: true };
    mockService.authUser = { uid: 'id01', emailVerified: true };
    mockService.reauthenticationTimeout = 1;
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/myPassword' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    userEvent.click(screen.queryByTestId(i18n.t('themeMode-title')));
    await waitFor(() => expect(mockNavigate.mock.calls.length).toEqual(1));
    expect(mockNavigate.mock.calls[0][0]).toEqual('/settings/themeMode');

    userEvent.click(screen.queryByTestId(i18n.t('myDisplayName-title')));
    await waitFor(() => expect(mockNavigate.mock.calls.length).toEqual(2));
    expect(mockNavigate.mock.calls[1][0]).toEqual('/settings/myDisplayName');

    userEvent.click(screen.queryByTestId(i18n.t('myPassword-title')));
    await waitFor(() => expect(mockNavigate.mock.calls.length).toEqual(2));

    userEvent.click(screen.queryByTestId(i18n.t('myEmail-title')));
    await waitFor(() => expect(mockNavigate.mock.calls.length).toEqual(3));
    expect(mockNavigate.mock.calls[2][0]).toEqual('/settings/myEmail');

    userEvent.click(screen.queryByTestId(i18n.t('accounts-title')));
    await waitFor(() => expect(mockNavigate.mock.calls.length).toEqual(4));
    expect(mockNavigate.mock.calls[3][0]).toEqual('/settings/accounts');

    userEvent.click(screen.queryByTestId(i18n.t('signOut-title')));
    await waitFor(() => expect(mockNavigate.mock.calls.length).toEqual(5));
    expect(mockNavigate.mock.calls[4][0]).toEqual('/settings/signOut');
  });

  it('hides button test if env is production and email is not empty.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));

    const keyOrg = firebaseConfig.apiKey;
    firebaseConfig.apiKey = 'api key for production';

    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'test' })).toBeNull();

    firebaseConfig.apiKey = keyOrg;
  });

  it('resets reauthenticationTimeout on click button test.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));

    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.getByRole('button', { name: 'test' })).toBeInTheDocument();

    userEvent.click(screen.queryByRole('button', { name: 'test' }));
    expect(mockSetReauthenticationTimeout.mock.calls.length).toEqual(1);
    expect(mockSetReauthenticationTimeout.mock.calls[0][0]).toEqual(0);
  });
});

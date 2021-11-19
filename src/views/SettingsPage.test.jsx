import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import { resetMockService, mockService } from '../testConfig';

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

beforeAll(() => {
  resetMockService();
});

afterEach(() => {
  jest.clearAllMocks();
  resetMockService();
});

describe('SettingsPage', () => {
  it('shows button Sign-out and panels for user '
  + 'if user has signed in and email has verified.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockService.me = { id: 'id01', valid: true };
    mockService.authUser = { uid: 'id01', emailVerified: true };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeDefined();

    userEvent.click(screen.queryByRole('button', { name: 'sign-out' }));
    await waitFor(() => expect(mockHandleSignOut.mock.calls.length).toEqual(1));
    expect(mockNavigate.mock.calls.length).toEqual(1);
    expect(mockNavigate.mock.calls[0][0]).toEqual(-1);

    expect(screen.queryByTestId('themeMode-title')).toBeDefined();
    expect(screen.queryByTestId('ThemeModePanel')).toBeDefined();
    expect(screen.queryByTestId('myDisplayName-title')).toBeDefined();
    expect(screen.queryByTestId('MyDisplayNamePanel')).toBeDefined();
    expect(screen.queryByTestId('myPassword-title')).toBeDefined();
    expect(screen.queryByTestId('MyPasswordPanel')).toBeDefined();
    expect(screen.queryByTestId('MyEmailPanel')).toBeDefined();
    expect(screen.queryByTestId('myEmail-title')).toBeDefined();
    expect(screen.queryByTestId('AccountsPanel')).toBeNull();
    expect(screen.queryByTestId('accounts-title')).toBeNull();
  });

  it('shows button Sign-out and panels for admin '
  + 'if admin user has signed in and email has verified.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockService.me = { id: 'id01', valid: true };
    mockService.authUser = { uid: 'id01', emailVerified: true };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeDefined();
    expect(screen.queryByTestId('ThemeModePanel')).toBeDefined();
    expect(screen.queryByTestId('themeMode-title')).toBeDefined();
    expect(screen.queryByTestId('MyDisplayNamePanel')).toBeDefined();
    expect(screen.queryByTestId('myDisplayName-title')).toBeDefined();
    expect(screen.queryByTestId('MyPasswordPanel')).toBeDefined();
    expect(screen.queryByTestId('myPassword-title')).toBeDefined();
    expect(screen.queryByTestId('MyEmailPanel')).toBeDefined();
    expect(screen.queryByTestId('myEmail-title')).toBeDefined();
    expect(screen.queryByTestId('AccountsPanel')).toBeDefined();
    expect(screen.queryByTestId('accounts-title')).toBeDefined();
  });

  it('hides button Sign-out and panels for guest '
  + 'if email has not verified.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockService.me = { id: 'id01', valid: true };
    mockService.authUser = { uid: 'id01', emailVerified: false };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeNull();
    expect(screen.queryByTestId('ThemeModePanel')).toBeDefined();
    expect(screen.queryByTestId('themeMode-title')).toBeDefined();
    expect(screen.queryByTestId('MyDisplayNamePanel')).toBeNull();
    expect(screen.queryByTestId('myDisplayName-title')).toBeNull();
    expect(screen.queryByTestId('MyPasswordPanel')).toBeNull();
    expect(screen.queryByTestId('myPassword-title')).toBeNull();
    expect(screen.queryByTestId('MyEmailPanel')).toBeNull();
    expect(screen.queryByTestId('myEmail-title')).toBeNull();
    expect(screen.queryByTestId('AccountsPanel')).toBeNull();
    expect(screen.queryByTestId('accounts-title')).toBeNull();
  });

  it('hides button Sign-out and panels for guest '
  + 'if user has not signed in.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockService.me = {};
    mockService.authUser = {};
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeNull();
    expect(screen.queryByTestId('ThemeModePanel')).toBeDefined();
    expect(screen.queryByTestId('themeMode-title')).toBeDefined();
    expect(screen.queryByTestId('MyDisplayNamePanel')).toBeNull();
    expect(screen.queryByTestId('myDisplayName-title')).toBeNull();
    expect(screen.queryByTestId('MyPasswordPanel')).toBeNull();
    expect(screen.queryByTestId('myPassword-title')).toBeNull();
    expect(screen.queryByTestId('MyEmailPanel')).toBeNull();
    expect(screen.queryByTestId('myEmail-title')).toBeNull();
    expect(screen.queryByTestId('AccountsPanel')).toBeNull();
    expect(screen.queryByTestId('accounts-title')).toBeNull();
  });

  it('shows the body of the selected panel.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'myPassword' }));
    mockService.me = { id: 'id01', valid: true, admin: true };
    mockService.authUser = { uid: 'id01', emailVerified: true };
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
  });
});

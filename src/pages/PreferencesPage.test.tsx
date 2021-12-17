import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { User } from 'firebase/auth';

import { initializeMock, mockContext } from '../setupTests';
import AppContext from '../api/AppContext';
import { Conf, Account } from '../api/models';
import { setAccountProperties } from '../api/accounts';
import PreferencesPage from './PreferencesPage';

jest.mock('../api/accounts', () => ({
  ...jest.requireActual('../api/accounts'),
  setAccountProperties: jest.fn(),
}));

beforeEach(() => {
  initializeMock();
});

describe('PreferencesPage', () => {
  it('shows only theme edit panel for guest.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = {} as User;
    mockContext.me = {} as Account;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/prefs' }]}>
          <PreferencesPage />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByTestId('themeMode-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('reauthentication-panel')).toBeNull();
    expect(screen.queryByTestId('myPassword-panel')).toBeNull();
    expect(screen.queryByTestId('myEmail-panel')).toBeNull();
    expect(screen.queryByTestId('signOut-panel')).toBeNull();
  });

  it('shows reauthentication panel with reauthentication timeout.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.reauthenticationTimeout = 0;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true } as Account;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/prefs' }]}>
          <PreferencesPage />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByTestId('themeMode-panel')).toBeInTheDocument();
    expect(screen.getByTestId('reauthentication-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myPassword-panel')).toBeNull();
    expect(screen.queryByTestId('myEmail-panel')).toBeNull();
    expect(screen.getByTestId('signOut-panel')).toBeInTheDocument();
  });

  it('hides reauthentication panel without reauthentication timeout.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.reauthenticationTimeout = 1;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true } as Account;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/prefs' }]}>
          <PreferencesPage />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByTestId('themeMode-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('reauthentication-panel')).toBeNull();
    expect(screen.getByTestId('myPassword-panel')).toBeInTheDocument();
    expect(screen.getByTestId('myEmail-panel')).toBeInTheDocument();
    expect(screen.getByTestId('signOut-panel')).toBeInTheDocument();
  });

  it('saves edited data of my name on click save button.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.reauthenticationTimeout = 1;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true, name: 'abc' } as Account;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/prefs' }]}>
          <PreferencesPage />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    userEvent.type(screen.getByRole('textbox', { name: 'myDisplayName-input' }), 'd');
    await waitFor(() => expect(screen.queryByRole('textbox', { name: 'myDisplayName-input' })).toHaveValue('abcd'));
    userEvent.click(screen.getByRole('button', { name: 'myDisplayName-save' }));
    expect(setAccountProperties.mock.calls.length).toEqual(1);
    expect(setAccountProperties.mock.calls[0][1]).toEqual('id01');
    expect(setAccountProperties.mock.calls[0][2]).toEqual({ name: 'abcd' });
  });
});

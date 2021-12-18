import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { User } from 'firebase/auth';

import { i18n } from '../conf';
import { initializeMock, mockContext } from '../setupTests';
import AppContext from '../api/AppContext';
import {
  Conf, Account, ThemeMode, themeModeList,
} from '../api/models';
import { setAccountProperties } from '../api/accounts';
import ThemeModePanel from './ThemeModePanel';

jest.mock('../api/accounts', () => ({
  ...jest.requireActual('../api/accounts'),
  setAccountProperties: jest.fn(),
}));

beforeEach(() => {
  initializeMock();
});

describe('ThemeModePanel', () => {
  it('set the selected theme mode to app context and user data '
  + 'with signed-in status.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.me = { id: 'id01', valid: true } as Account;
    mockContext.authUser = { uid: 'id01' } as User;
    render(
      <AppContext.Provider value={mockContext}>
        <ThemeModePanel />
      </AppContext.Provider>,
    );

    userEvent.click(screen.getByText(`${i18n.t('Accept system settings')}`));
    expect(mockContext.setThemeMode.mock.calls.length).toEqual(1);
    expect(mockContext.setThemeMode.mock.calls[0][0]).toEqual(ThemeMode.SYSTEM);
    await waitFor(() => expect(setAccountProperties.mock.calls.length).toEqual(1));
    expect(setAccountProperties.mock.calls[0][1]).toEqual('id01');
    expect(setAccountProperties.mock.calls[0][2]).toEqual({ themeMode: themeModeList.indexOf(ThemeMode.SYSTEM) });
  });

  it('set the selected theme mode to app context and user data '
  + 'without signed-in status.', async () => {
    mockContext.me = { id: 'id01', valid: true } as Account;
    mockContext.authUser = { uid: 'id01', emailVerified: false } as User;
    render(
      <AppContext.Provider value={mockContext}>
        <ThemeModePanel />
      </AppContext.Provider>,
    );

    userEvent.click(screen.getByText(`${i18n.t('Accept system settings')}`));
    expect(mockContext.setThemeMode.mock.calls.length).toEqual(1);
    expect(mockContext.setThemeMode.mock.calls[0][0]).toEqual(ThemeMode.SYSTEM);
    await waitFor(() => expect(setAccountProperties.mock.calls.length).toEqual(0));
  });
});

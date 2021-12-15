import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import { initialieMock, mockContext } from '../setupTests';
import AppContext from '../api/AppContext';
import { setAccountProperties } from '../api/accounts';
import ThemeModePanel from './ThemeModePanel';

jest.mock('../api/accounts', () => ({
  ...jest.requireActual('../api/accounts'),
  setAccountProperties: jest.fn(),
}));

beforeEach(() => {
  initialieMock();
});

describe('ThemeModePanel', () => {
  it('set the selected theme mode to app context and user data '
  + 'with signed-in status.', async () => {
    mockContext.conf = { id: 'conf' };
    mockContext.me = { id: 'id01', valid: true };
    mockContext.authUser = { uid: 'id01' };
    render(
      <AppContext.Provider value={mockContext}>
        <ThemeModePanel />
      </AppContext.Provider>,
    );

    userEvent.click(screen.queryByText(i18n.t('Accept system settings')));
    expect(mockContext.setThemeMode.mock.calls.length).toEqual(1);
    expect(mockContext.setThemeMode.mock.calls[0][0]).toEqual('system');
    await waitFor(() => expect(setAccountProperties.mock.calls.length).toEqual(1));
    expect(setAccountProperties.mock.calls[0][1]).toEqual('id01');
    expect(setAccountProperties.mock.calls[0][2]).toEqual({ themeMode: 'system' });
  });

  it('set the selected theme mode to app context and user data '
  + 'without signed-in status.', async () => {
    mockContext.me = { id: 'id01', valid: true };
    mockContext.authUser = { uid: 'id01', emailVerified: false };
    render(
      <AppContext.Provider value={mockContext}>
        <ThemeModePanel />
      </AppContext.Provider>,
    );

    userEvent.click(screen.queryByText(i18n.t('Accept system settings')));
    expect(mockContext.setThemeMode.mock.calls.length).toEqual(1);
    expect(mockContext.setThemeMode.mock.calls[0][0]).toEqual('system');
    await waitFor(() => expect(setAccountProperties.mock.calls.length).toEqual(0));
  });
});

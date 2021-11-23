import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import { resetMockService, mockContext, mockSetThemeMode } from '../testConfig';

const mockSetAccountProperties = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  setAccountProperties: mockSetAccountProperties,
}));

// work around for mocking problem.
const { AppContext } = require('../api');
const { ThemeModePanel } = require('./indexTest');

beforeEach(() => {
  resetMockService();
});

describe('ThemeModePanel', () => {
  it('set the selected theme mode to app context and user data '
  + 'with signed-in status.', async () => {
    mockContext.me = { id: 'id01', valid: true };
    mockContext.authUser = { uid: 'id01', emailVerified: true };
    render(
      <AppContext.Provider value={mockContext}>
        <ThemeModePanel />
      </AppContext.Provider>,
    );

    userEvent.click(screen.queryByText(i18n.t('Accept system settings')));
    expect(mockSetThemeMode.mock.calls.length).toEqual(1);
    expect(mockSetThemeMode.mock.calls[0][0]).toEqual('system');
    await waitFor(() => expect(mockSetAccountProperties.mock.calls.length).toEqual(1));
    expect(mockSetAccountProperties.mock.calls[0][1]).toEqual('id01');
    expect(mockSetAccountProperties.mock.calls[0][2]).toEqual({ themeMode: 'system' });
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
    expect(mockSetThemeMode.mock.calls.length).toEqual(1);
    expect(mockSetThemeMode.mock.calls[0][0]).toEqual('system');
    await waitFor(() => expect(mockSetAccountProperties.mock.calls.length).toEqual(0));
  });
});

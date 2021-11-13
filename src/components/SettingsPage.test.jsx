/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// import { i18n } from '../conf';

const mockHandleSignOut = jest.fn();
jest.mock('../api', () => ({
  __esModule: true,
  ...jest.requireActual('../api'),
  handleSignOut: mockHandleSignOut,
}));

// work around for mocking problem.
const { ServiceContext } = require('../api');
const { SettingsPage } = require('.');

afterEach(() => {
  jest.clearAllMocks();
});

describe('SettingsPage', () => {
  it('show button Sign-out if user has signed in.', async () => {
    render(
      <ServiceContext.Provider value={{ me: { id: 'id01' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeDefined();

    userEvent.click(screen.queryByRole('button', { name: 'sign-out' }));
    await waitFor(() => expect(mockHandleSignOut.mock.calls.length).toEqual(1));
  });

  it('hide button Sign-out if user has not signed in.', async () => {
    render(
      <ServiceContext.Provider value={{ me: {} }}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SettingsPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeNull();
  });
});

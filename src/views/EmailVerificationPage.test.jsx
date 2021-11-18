/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { i18n } from '../conf';

jest.mock('firebase/firestore', () => ({}));

const mockHandleSendEmailVerification = jest.fn();
const mockHandleReloadAuthUser = jest.fn();
const mockHandleSignOut = jest.fn();
jest.mock('../api', () => ({
  __esModule: true,
  ...jest.requireActual('../api'),
  handleSendEmailVerification: mockHandleSendEmailVerification,
  handleReloadAuthUser: mockHandleReloadAuthUser,
  handleSignOut: mockHandleSignOut,
}));

// work around for mocking problem.
const { ServiceContext } = require('../api');
const { EmailVerificationPage } = require('.');

afterEach(() => {
  jest.clearAllMocks();
});

describe('EmailVerificationPage', () => {
  it('shows button send and button sign-out on initial state, '
  + 'and shows button reload after click button send.', async () => {
    render(
      <ServiceContext.Provider value={{ me: { id: 'id01' }, authUser: { emailVerified: false } }}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <EmailVerificationPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'send' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'reload' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeDefined();
    expect(screen.queryByText(i18n.t('email verification is required'))).toBeDefined();
    expect(screen.queryByText(i18n.t('send email verification'))).toBeDefined();
    expect(screen.queryByText(i18n.t('stoBeNull'))).toBeNull();

    userEvent.click(screen.queryByRole('button', { name: 'send' }));
    await waitFor(() => expect(mockHandleSendEmailVerification.mock.calls.length).toEqual(1));

    expect(screen.queryByRole('button', { name: 'send' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'reload' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeDefined();
    expect(screen.queryByText(i18n.t('email verification is required'))).toBeNull();
    expect(screen.queryByText(i18n.t('send email verification'))).toBeDefined();
    expect(screen.queryByText(i18n.t('stoBeNull'))).toBeNull();

    userEvent.click(screen.queryByRole('button', { name: 'reload' }));
    await waitFor(() => expect(mockHandleReloadAuthUser.mock.calls.length).toEqual(1));

    userEvent.click(screen.queryByRole('button', { name: 'sign-out' }));
    await waitFor(() => expect(mockHandleSignOut.mock.calls.length).toEqual(1));
  });

  it('shows button send and button sign-out on initial state, '
  + 'and shows error messeege after click button send is failed.', async () => {
    mockHandleSendEmailVerification
      .mockImplementationOnce(() => { throw Error(); });
    render(
      <ServiceContext.Provider value={{ me: { id: 'id01' }, authUser: { emailVerified: false } }}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <EmailVerificationPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'send' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'reload' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeDefined();
    expect(screen.queryByText(i18n.t('email verification is required'))).toBeDefined();
    expect(screen.queryByText(i18n.t('send email verification'))).toBeDefined();
    expect(screen.queryByText(i18n.t('stoBeNull'))).toBeNull();

    userEvent.click(screen.queryByRole('button', { name: 'send' }));
    await waitFor(() => expect(mockHandleSendEmailVerification.mock.calls.length).toEqual(1));

    expect(screen.queryByRole('button', { name: 'send' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'reload' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeDefined();
    expect(screen.queryByText(i18n.t('email verification is required'))).toBeDefined();
    expect(screen.queryByText(i18n.t('send email verification'))).toBeNull();
    expect(screen.queryByText(i18n.t('stoBeNull'))).toBeDefined();

    userEvent.click(screen.queryByRole('button', { name: 'sign-out' }));
    await waitFor(() => expect(mockHandleSignOut.mock.calls.length).toEqual(1));
  });
});

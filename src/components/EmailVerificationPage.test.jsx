import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { i18n } from '../conf';
import { resetMockService, mockService } from '../testConfig';

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

beforeEach(() => {
  resetMockService();
});

describe('EmailVerificationPage', () => {
  const initialMessage = i18n.t('email verification is required');
  const completeMessage = i18n.t('send email verification');
  const errorMessage = i18n.t('failed to send email') + i18n.t('retry failed or call admin');

  it('shows button send and button sign-out on initial state, '
  + 'and shows button reload after click button send.', async () => {
    mockService.me = { id: 'id01' };
    mockService.authUser = { emailVerified: false };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <EmailVerificationPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'send' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'reload' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeInTheDocument();
    expect(screen.queryByText(initialMessage)).toBeInTheDocument();
    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.click(screen.queryByRole('button', { name: 'send' }));
    await waitFor(() => expect(mockHandleSendEmailVerification.mock.calls.length).toEqual(1));

    expect(screen.queryByRole('button', { name: 'send' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'reload' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeInTheDocument();
    expect(screen.queryByText(initialMessage)).toBeNull();
    expect(screen.queryByText(completeMessage)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.click(screen.queryByRole('button', { name: 'reload' }));
    await waitFor(() => expect(mockHandleReloadAuthUser.mock.calls.length).toEqual(1));

    userEvent.click(screen.queryByRole('button', { name: 'sign-out' }));
    await waitFor(() => expect(mockHandleSignOut.mock.calls.length).toEqual(1));
  });

  it('shows button send and button sign-out on initial state, '
  + 'and shows error messeege after click button send is failed.', async () => {
    mockService.me = { id: 'id01' };
    mockService.authUser = { emailVerified: false };
    mockHandleSendEmailVerification
      .mockImplementationOnce(() => { throw Error(); });
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <EmailVerificationPage />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'send' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'reload' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeInTheDocument();
    expect(screen.queryByText(initialMessage)).toBeInTheDocument();
    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.click(screen.queryByRole('button', { name: 'send' }));
    await waitFor(() => expect(mockHandleSendEmailVerification.mock.calls.length).toEqual(1));

    expect(screen.queryByRole('button', { name: 'send' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'reload' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeInTheDocument();
    expect(screen.queryByText(initialMessage)).toBeInTheDocument();
    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeInTheDocument();

    userEvent.click(screen.queryByRole('button', { name: 'sign-out' }));
    await waitFor(() => expect(mockHandleSignOut.mock.calls.length).toEqual(1));
  });
});

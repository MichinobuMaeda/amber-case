import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { User } from 'firebase/auth';

import { i18n } from '../conf';
import { initializeMock, mockContext } from '../setupTests';
import AppContext from '../api/AppContext';
import { Account } from '../api/models';
import {
  handleSendEmailVerification,
  handleReloadAuthUser,
  handleSignOut,
} from '../api/authentication';
import EmailVerificationPage from './EmailVerificationPage';

jest.mock('../api/authentication', () => ({
  __esModule: true,
  ...jest.requireActual('../api/authentication'),
  handleSendEmailVerification: jest.fn(),
  handleReloadAuthUser: jest.fn(),
  handleSignOut: jest.fn(),
}));

beforeEach(() => {
  initializeMock();
});

describe('EmailVerificationPage', () => {
  const initialMessage = i18n.t('email verification is required');
  const completeMessage = i18n.t('send email verification');
  const errorMessage = i18n.t('failed to send email') + i18n.t('retry failed or call admin');

  it('shows button send and button sign-out on initial state, '
  + 'and shows button reload after click button send.', async () => {
    mockContext.me = { id: 'id01' } as Account;
    mockContext.authUser = { emailVerified: false } as User;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <EmailVerificationPage />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.getByRole('button', { name: 'send' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'reload' })).toBeNull();
    expect(screen.getByRole('button', { name: 'sign-out' })).toBeInTheDocument();
    expect(screen.getByText(initialMessage)).toBeInTheDocument();
    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.click(screen.getByRole('button', { name: 'send' }));
    await waitFor(() => expect(handleSendEmailVerification.mock.calls.length).toEqual(1));

    expect(screen.queryByRole('button', { name: 'send' })).toBeNull();
    expect(screen.getByRole('button', { name: 'reload' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'sign-out' })).toBeInTheDocument();
    expect(screen.queryByText(initialMessage)).toBeNull();
    expect(screen.getByText(completeMessage)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.click(screen.getByRole('button', { name: 'reload' }));
    await waitFor(() => expect(handleReloadAuthUser.mock.calls.length).toEqual(1));

    userEvent.click(screen.getByRole('button', { name: 'sign-out' }));
    await waitFor(() => expect(handleSignOut.mock.calls.length).toEqual(1));
  });

  it('shows button send and button sign-out on initial state, '
  + 'and shows error messeege after click button send is failed.', async () => {
    mockContext.me = { id: 'id01' } as Account;
    mockContext.authUser = { emailVerified: false } as User;
    handleSendEmailVerification
      .mockImplementationOnce(() => { throw Error(); });
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <EmailVerificationPage />
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.getByRole('button', { name: 'send' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'reload' })).toBeNull();
    expect(screen.getByRole('button', { name: 'sign-out' })).toBeInTheDocument();
    expect(screen.getByText(initialMessage)).toBeInTheDocument();
    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.click(screen.getByRole('button', { name: 'send' }));
    await waitFor(() => expect(handleSendEmailVerification.mock.calls.length).toEqual(1));

    expect(screen.getByRole('button', { name: 'send' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'reload' })).toBeNull();
    expect(screen.getByRole('button', { name: 'sign-out' })).toBeInTheDocument();
    expect(screen.getByText(initialMessage)).toBeInTheDocument();
    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'sign-out' }));
    await waitFor(() => expect(handleSignOut.mock.calls.length).toEqual(1));
  });
});

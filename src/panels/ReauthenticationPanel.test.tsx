import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import { initializeMock, mockContext } from '../setupTests';
import AppContext from '../api/AppContext';
import {
  handelReauthenticateLinkToEmail,
  handleReauthenticateWithPassword,
} from '../api/authentication';
import ReauthenticationPanel from './ReauthenticationPanel';

jest.mock('../api/authentication', () => ({
  ...jest.requireActual('../api/authentication'),
  handelReauthenticateLinkToEmail: jest.fn(),
  handleReauthenticateWithPassword: jest.fn(),
}));

beforeEach(() => {
  initializeMock();
});

describe('ReauthenticationPanel: Email', () => {
  const completeMessage = i18n.t('send email for reauthentication');
  const errorMessage = i18n.t('failed to send email') + i18n.t('retry failed or call admin');

  it('shows button send for valid email.', async () => {
    const email = 'test01@example.com';
    mockContext.auth = { currentUser: { email } };

    render(
      <AppContext.Provider value={mockContext}>
        <ReauthenticationPanel data-testid="testid01" />
      </AppContext.Provider>,
    );

    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();
    expect(screen.getByTestId('VisibilityOffIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('VisibilityIcon')).toBeNull();

    const button = screen.getByRole('button', { name: 'sendReauthLinkEmail' });

    userEvent.click(button);
    await waitFor(() => expect(handelReauthenticateLinkToEmail.mock.calls.length).toEqual(1));

    expect(screen.getByText(completeMessage)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.click(screen.getByTestId('VisibilityOffIcon'));
    expect(screen.queryByTestId('VisibilityOffIcon')).toBeNull();
    expect(screen.getByTestId('VisibilityIcon')).toBeInTheDocument();
  });

  it('shows message for error.', async () => {
    const email = 'test01@example.com';
    mockContext.auth = { currentUser: { email } };
    handelReauthenticateLinkToEmail
      .mockImplementationOnce(() => { throw new Error(); });

    render(
      <AppContext.Provider value={mockContext}>
        <ReauthenticationPanel data-testid="testid01" />
      </AppContext.Provider>,
    );

    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();
    const button = screen.getByRole('button', { name: 'sendReauthLinkEmail' });

    userEvent.click(button);
    await waitFor(() => expect(handelReauthenticateLinkToEmail.mock.calls.length).toEqual(1));

    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});

describe('ReauthenticationPanel: Password', () => {
  const errorMessage = i18n.t('check password for reauthentication');

  it('shows button check with password value.', async () => {
    const email = 'test01@example.com';
    mockContext.auth = { currentUser: { email } };

    render(
      <AppContext.Provider value={mockContext}>
        <ReauthenticationPanel data-testid="testid01" />
      </AppContext.Provider>,
    );

    expect(screen.queryByText(errorMessage)).toBeNull();
    const button = screen.queryByRole('button', { name: 'passwordConfiremation' });
    expect(button).toBeDisabled();

    userEvent.type(screen.getByLabelText(`${i18n.t('Password')}`), 'a');
    expect(button).not.toBeDisabled();

    userEvent.click(button!);
    await waitFor(() => expect(handleReauthenticateWithPassword.mock.calls.length).toEqual(1));

    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it('shows message for error.', async () => {
    const email = 'test01@example.com';
    mockContext.auth = { currentUser: { email } };
    handleReauthenticateWithPassword
      .mockImplementationOnce(() => { throw new Error(); });

    render(
      <AppContext.Provider value={mockContext}>
        <ReauthenticationPanel data-testid="testid01" />
      </AppContext.Provider>,
    );

    const button = screen.getByRole('button', { name: 'passwordConfiremation' });
    userEvent.type(screen.getByLabelText(`${i18n.t('Password')}`), 'a');

    userEvent.click(button);
    await waitFor(() => expect(handleReauthenticateWithPassword.mock.calls.length).toEqual(1));

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});

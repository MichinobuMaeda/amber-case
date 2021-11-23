import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import { resetMockService, mockContext } from '../testConfig';

const mockHandelReauthenticateLinkToEmail = jest.fn();
const mockHandleReauthenticateWithPassword = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  handelReauthenticateLinkToEmail: mockHandelReauthenticateLinkToEmail,
  handleReauthenticateWithPassword: mockHandleReauthenticateWithPassword,
}));

// work around for mocking problem.
const { AppContext } = require('../api');
const { ReauthenticationPanel } = require('./indexTest');

beforeEach(() => {
  resetMockService();
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
    expect(screen.queryByTestId('VisibilityOffIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('VisibilityIcon')).toBeNull();

    const button = screen.queryByRole('button', { name: 'sendReauthLinkEmail' });

    userEvent.click(button);
    await waitFor(() => expect(mockHandelReauthenticateLinkToEmail.mock.calls.length).toEqual(1));

    expect(screen.queryByText(completeMessage)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.click(screen.queryByTestId('VisibilityOffIcon'));
    expect(screen.queryByTestId('VisibilityOffIcon')).toBeNull();
    expect(screen.queryByTestId('VisibilityIcon')).toBeInTheDocument();
  });

  it('shows message for error.', async () => {
    const email = 'test01@example.com';
    mockContext.auth = { currentUser: { email } };
    mockHandelReauthenticateLinkToEmail
      .mockImplementationOnce(() => { throw new Error(); });

    render(
      <AppContext.Provider value={mockContext}>
        <ReauthenticationPanel data-testid="testid01" />
      </AppContext.Provider>,
    );

    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();
    const button = screen.queryByRole('button', { name: 'sendReauthLinkEmail' });

    userEvent.click(button);
    await waitFor(() => expect(mockHandelReauthenticateLinkToEmail.mock.calls.length).toEqual(1));

    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeInTheDocument();
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

    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 'a');
    expect(button).not.toBeDisabled();

    userEvent.click(button);
    await waitFor(() => expect(mockHandleReauthenticateWithPassword.mock.calls.length).toEqual(1));

    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it('shows message for error.', async () => {
    const email = 'test01@example.com';
    mockContext.auth = { currentUser: { email } };
    mockHandleReauthenticateWithPassword
      .mockImplementationOnce(() => { throw new Error(); });

    render(
      <AppContext.Provider value={mockContext}>
        <ReauthenticationPanel data-testid="testid01" />
      </AppContext.Provider>,
    );

    const button = screen.queryByRole('button', { name: 'passwordConfiremation' });
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 'a');

    userEvent.click(button);
    await waitFor(() => expect(mockHandleReauthenticateWithPassword.mock.calls.length).toEqual(1));

    expect(screen.queryByText(errorMessage)).toBeInTheDocument();
  });
});

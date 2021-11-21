import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import { resetMockService, mockService } from '../testConfig';

jest.mock('firebase/firestore', () => ({}));

const mockHandelReauthenticateLinkToEmail = jest.fn();
const mockHandleReauthenticateWithPassword = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  handelReauthenticateLinkToEmail: mockHandelReauthenticateLinkToEmail,
  handleReauthenticateWithPassword: mockHandleReauthenticateWithPassword,
}));

// work around for mocking problem.
const { ServiceContext } = require('../api');
const { ReauthenticationPanel } = require('./exportForTest');

beforeEach(() => {
  resetMockService();
});

describe('ReauthenticationPanel: Email', () => {
  const completeMessage = i18n.t('send email for reauthentication');
  const errorMessage = i18n.t('failed to send email') + i18n.t('retry failed or call admin');

  it('shows button send for valid email.', async () => {
    const email = 'test01@example.com';
    mockService.auth = { currentUser: { email } };

    render(
      <ServiceContext.Provider value={mockService}>
        <ReauthenticationPanel data-testid="testid01" />
      </ServiceContext.Provider>,
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
    mockService.auth = { currentUser: { email } };
    mockHandelReauthenticateLinkToEmail
      .mockImplementationOnce(() => { throw new Error(); });

    render(
      <ServiceContext.Provider value={mockService}>
        <ReauthenticationPanel data-testid="testid01" />
      </ServiceContext.Provider>,
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
    mockService.auth = { currentUser: { email } };

    render(
      <ServiceContext.Provider value={mockService}>
        <ReauthenticationPanel data-testid="testid01" />
      </ServiceContext.Provider>,
    );

    expect(screen.queryByText(errorMessage)).toBeNull();
    const button = screen.queryByRole('button', { name: 'passwordConfiremation' });
    expect(button).toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('password')), 'a');
    expect(button).not.toBeDisabled();

    userEvent.click(button);
    await waitFor(() => expect(mockHandleReauthenticateWithPassword.mock.calls.length).toEqual(1));

    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it('shows message for error.', async () => {
    const email = 'test01@example.com';
    mockService.auth = { currentUser: { email } };
    mockHandleReauthenticateWithPassword
      .mockImplementationOnce(() => { throw new Error(); });

    render(
      <ServiceContext.Provider value={mockService}>
        <ReauthenticationPanel data-testid="testid01" />
      </ServiceContext.Provider>,
    );

    const button = screen.queryByRole('button', { name: 'passwordConfiremation' });
    userEvent.type(screen.queryByLabelText(i18n.t('password')), 'a');

    userEvent.click(button);
    await waitFor(() => expect(mockHandleReauthenticateWithPassword.mock.calls.length).toEqual(1));

    expect(screen.queryByText(errorMessage)).toBeInTheDocument();
  });
});

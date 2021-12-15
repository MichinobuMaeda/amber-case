import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { i18n } from '../conf';
import { handleSignInWithPassword } from '../api/authentication';
import SignInWithPasswordPanel from './SignInWithPasswordPanel';

jest.mock('../api/authentication', () => ({
  ...jest.requireActual('../api/authentication'),
  handleSignInWithPassword: jest.fn(),
}));

const mockOnEmailChange = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('SignInWithPasswordPanel', () => {
  const errorMessage = i18n.t('failed to sign in') + i18n.t('check your email and password');

  it('shows button sign-in for valid email and password.', async () => {
    const email = 'test01@example.com';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithPasswordPanel
          email={email}
          onEmailChange={mockOnEmailChange}
        />
      </MemoryRouter>,
    );
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 't');
    await waitFor(() => expect(screen.queryByRole('button', { name: 'sign-in' })).not.toBeDisabled());

    userEvent.click(screen.queryByRole('button', { name: 'sign-in' }));
    await waitFor(() => expect(handleSignInWithPassword.mock.calls.length).toEqual(1));

    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'a');
    expect(mockOnEmailChange.mock.calls.length).toEqual(1);
    expect(mockOnEmailChange.mock.calls[0][0]).toEqual(`${email}a`);

    userEvent.click(screen.queryByTestId('VisibilityOffIcon'));
    expect(screen.queryByTestId('VisibilityOffIcon')).toBeNull();
    expect(screen.getByTestId('VisibilityIcon')).toBeInTheDocument();
  });

  it('shows message for error.', async () => {
    const email = 'test01@example.com';
    handleSignInWithPassword.mockImplementationOnce(() => { throw new Error(); });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithPasswordPanel
          email={email}
          onEmailChange={mockOnEmailChange}
        />
      </MemoryRouter>,
    );
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 't');
    expect(await screen.findByRole('button', { name: 'sign-in' })).toBeInTheDocument();

    userEvent.click(screen.queryByRole('button', { name: 'sign-in' }));
    await waitFor(() => expect(handleSignInWithPassword.mock.calls.length).toEqual(1));

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('disables button send for invalid email.', async () => {
    const email = 'test01@example.';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithPasswordPanel
          email={email}
          errorMessage="error message"
          onEmailChange={mockOnEmailChange}
        />
      </MemoryRouter>,
    );
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 't');
    await waitFor(() => expect(screen.queryByRole('button', { name: 'sign-in' })).toBeDisabled());

    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it('disables button send for empty email.', async () => {
    const email = '';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithPasswordPanel
          email={email}
          onEmailChange={mockOnEmailChange}
        />
      </MemoryRouter>,
    );
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 't');
    await waitFor(() => expect(screen.queryByRole('button', { name: 'sign-in' })).toBeDisabled());
  });

  it('disables button send for empty password.', async () => {
    const email = 'test01@example.com';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithPasswordPanel
          email={email}
          onEmailChange={mockOnEmailChange}
        />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.queryByRole('button', { name: 'sign-in' })).toBeDisabled());

    expect(screen.queryByText(errorMessage)).toBeNull();
  });
});

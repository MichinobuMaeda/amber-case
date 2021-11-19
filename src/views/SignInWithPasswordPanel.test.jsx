import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { i18n } from '../conf';

jest.mock('firebase/firestore', () => ({}));

const mockHandleSignInWithPassword = jest
  .fn(() => {})
  .mockImplementationOnce(() => {})
  .mockImplementationOnce(() => { throw new Error(); });
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  handleSignInWithPassword: mockHandleSignInWithPassword,
}));

// work around for mocking problem.
const { SignInWithPasswordPanel } = require('.');

afterEach(() => {
  jest.clearAllMocks();
});

describe('SignInWithPasswordPanel', () => {
  it('shows button sign-in for valid email and password.', async () => {
    const email = 'test01@example.com';
    const onEmailChange = () => {};

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithPasswordPanel email={email} onEmailChange={onEmailChange} />
      </MemoryRouter>,
    );
    userEvent.type(screen.queryByTestId('password'), 't');
    await waitFor(() => expect(screen.queryByRole('button', { name: 'sign-in' })).toBeDefined());

    userEvent.click(screen.queryByRole('button', { name: 'sign-in' }));
    await waitFor(() => expect(mockHandleSignInWithPassword.mock.calls.length).toEqual(1));
  });

  it('shows message for error.', async () => {
    const email = 'test01@example.com';
    const onEmailChange = () => {};

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithPasswordPanel email={email} onEmailChange={onEmailChange} />
      </MemoryRouter>,
    );
    userEvent.type(screen.queryByTestId('password'), 't');
    await waitFor(() => expect(screen.queryByRole('button', { name: 'sign-in' })).toBeDefined());

    userEvent.click(screen.queryByRole('button', { name: 'sign-in' }));
    await waitFor(() => expect(mockHandleSignInWithPassword.mock.calls.length).toEqual(1));

    expect(screen.queryByText(i18n.t('failed to sign in'))).toBeDefined();
  });

  it('hides button send for invalid email.', async () => {
    const email = 'test01@example.';
    const onEmailChange = () => {};

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithPasswordPanel email={email} onEmailChange={onEmailChange} />
      </MemoryRouter>,
    );
    userEvent.type(screen.queryByTestId('password'), 't');
    await waitFor(() => expect(screen.queryByRole('button', { name: 'sign-in' })).toBeNull());
  });

  it('hides button send for empty email.', async () => {
    const email = '';
    const onEmailChange = () => {};

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithPasswordPanel email={email} onEmailChange={onEmailChange} />
      </MemoryRouter>,
    );
    userEvent.type(screen.queryByTestId('password'), 't');
    await waitFor(() => expect(screen.queryByRole('button', { name: 'sign-in' })).toBeNull());
  });

  it('hides button send for empty password.', async () => {
    const email = 'test01@example.com';
    const onEmailChange = () => {};

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithPasswordPanel email={email} onEmailChange={onEmailChange} />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.queryByRole('button', { name: 'sign-in' })).toBeNull());
  });
});

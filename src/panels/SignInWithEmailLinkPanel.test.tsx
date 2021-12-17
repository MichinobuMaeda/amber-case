import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { i18n, firebaseConfig } from '../conf';
import {
  handelSendSignInLinkToEmail,
  handleSignInWithPassword,
} from '../api/authentication';
import SignInWithEmailLinkPanel from './SignInWithEmailLinkPanel';

jest.mock('../api/authentication', () => ({
  ...jest.requireActual('../api/authentication'),
  handelSendSignInLinkToEmail: jest.fn(),
  handleSignInWithPassword: jest.fn(),
}));

const mockOnEmailChange = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('SignInWithEmailLinkPanel', () => {
  const completeMessage = i18n.t('send email link');
  const errorMessage = i18n.t('failed to send email') + i18n.t('retry failed or call admin');

  it('shows button send for valid email.', async () => {
    const email = 'test01@example.com';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPanel
          email={email}
          onEmailChange={mockOnEmailChange}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();

    expect(screen.getByRole('button', { name: 'send' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'send' }));
    await waitFor(() => expect(handelSendSignInLinkToEmail.mock.calls.length).toEqual(1));

    expect(screen.getByText(completeMessage)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.type(screen.getByLabelText(`${i18n.t('E-mail')}`), 'a');
    expect(mockOnEmailChange.mock.calls.length).toEqual(1);
    expect(mockOnEmailChange.mock.calls[0][0]).toEqual(`${email}a`);
  });

  it('shows message for error.', async () => {
    const email = 'test01@example.com';
    handelSendSignInLinkToEmail.mockImplementationOnce(() => { throw new Error(); });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPanel
          email={email}
          onEmailChange={mockOnEmailChange}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();

    expect(screen.getByRole('button', { name: 'send' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'send' }));
    await waitFor(() => expect(handelSendSignInLinkToEmail.mock.calls.length).toEqual(1));

    expect(screen.queryByText(completeMessage)).toBeNull();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('disables button send for invalid email.', async () => {
    const email = 'test01@example.';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPanel
          email={email}
          errorMessage="error message"
          onEmailChange={mockOnEmailChange}
        />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'send' })).toBeDisabled();
  });

  it('disables button send for empty email.', async () => {
    const email = '';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPanel
          email={email}
          onEmailChange={mockOnEmailChange}
        />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'send' })).toBeDisabled();
  });

  it('shows button test if env is not production and email is empty.', async () => {
    const email = '';
    const onEmailChange = () => {};
    const keyOrg = firebaseConfig.apiKey;
    firebaseConfig.apiKey = 'FIREBASE_API_KEY';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPanel
          email={email}
          onEmailChange={onEmailChange}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'test' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'test' }));
    await waitFor(() => expect(handleSignInWithPassword.mock.calls.length).toEqual(1));

    firebaseConfig.apiKey = keyOrg;
  });

  it('hides button test if env is not production and email is not empty.', async () => {
    const email = 'test01@example';
    const onEmailChange = () => {};
    const keyOrg = firebaseConfig.apiKey;
    firebaseConfig.apiKey = 'FIREBASE_API_KEY';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPanel
          email={email}
          onEmailChange={onEmailChange}
        />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'test' })).toBeNull();

    firebaseConfig.apiKey = keyOrg;
  });

  it('hides button test if env is production and email is not empty.', async () => {
    const email = '';
    const onEmailChange = () => {};
    const keyOrg = firebaseConfig.apiKey;
    firebaseConfig.apiKey = 'api key for production';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPanel
          email={email}
          onEmailChange={onEmailChange}
        />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'test' })).toBeNull();

    firebaseConfig.apiKey = keyOrg;
  });
});

/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { i18n, firebaseConfig } from '../conf';

jest.mock('firebase/firestore', () => ({}));

const mockHandelSendSignInLinkToEmail = jest
  .fn(() => {})
  .mockImplementationOnce(() => {})
  .mockImplementationOnce(() => { throw new Error(); });
const mockHandleSignInWithPassword = jest.fn();
jest.mock('../api', () => ({
  __esModule: true,
  ...jest.requireActual('../api'),
  handelSendSignInLinkToEmail: mockHandelSendSignInLinkToEmail,
  handleSignInWithPassword: mockHandleSignInWithPassword,
}));

// work around for mocking problem.
const { SignInWithEmailLinkPage } = require('.');

afterEach(() => {
  jest.clearAllMocks();
});

describe('SignInWithEmailLinkPage', () => {
  it('shows button send for valid email.', async () => {
    const email = 'test01@example.com';
    const onEmailChange = () => {};

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPage email={email} onEmailChange={onEmailChange} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'send' })).toBeDefined();

    userEvent.click(screen.queryByRole('button', { name: 'send' }));
    await waitFor(() => expect(mockHandelSendSignInLinkToEmail.mock.calls.length).toEqual(1));

    expect(screen.queryByText(i18n.t('send email link'))).toBeDefined();
  });

  it('shows message for error.', async () => {
    const email = 'test01@example.com';
    const onEmailChange = () => {};

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPage email={email} onEmailChange={onEmailChange} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'send' })).toBeDefined();

    userEvent.click(screen.queryByRole('button', { name: 'send' }));
    await waitFor(() => expect(mockHandelSendSignInLinkToEmail.mock.calls.length).toEqual(1));

    expect(screen.queryByText(i18n.t('failed to send email'))).toBeDefined();
  });

  it('hides button send for invalid email.', async () => {
    const email = 'test01@example.';
    const onEmailChange = () => {};

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPage email={email} onEmailChange={onEmailChange} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'send' })).toBeNull();
  });

  it('hides button send for empty email.', async () => {
    const email = '';
    const onEmailChange = () => {};

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPage email={email} onEmailChange={onEmailChange} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'send' })).toBeNull();
  });

  it('shows button test if env is not production and email is empty.', async () => {
    const email = '';
    const onEmailChange = () => {};
    const keyOrg = firebaseConfig.apiKey;
    firebaseConfig.apiKey = 'FIREBASE_API_KEY';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPage email={email} onEmailChange={onEmailChange} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'test' })).toBeDefined();

    userEvent.click(screen.queryByRole('button', { name: 'test' }));
    await waitFor(() => expect(mockHandleSignInWithPassword.mock.calls.length).toEqual(1));

    firebaseConfig.apiKey = keyOrg;
  });

  it('hides button test if env is not production and email is not empty.', async () => {
    const email = 'test01@example';
    const onEmailChange = () => {};
    const keyOrg = firebaseConfig.apiKey;
    firebaseConfig.apiKey = 'FIREBASE_API_KEY';

    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInWithEmailLinkPage email={email} onEmailChange={onEmailChange} />
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
        <SignInWithEmailLinkPage email={email} onEmailChange={onEmailChange} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'test' })).toBeNull();

    firebaseConfig.apiKey = keyOrg;
  });
});

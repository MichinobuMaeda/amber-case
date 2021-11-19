import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { i18n } from '../conf';

jest.mock('firebase/firestore', () => ({}));

// work around for mocking problem.
const { SignInPage } = require('.');

afterEach(() => {
  jest.clearAllMocks();
});

describe('SignInPage', () => {
  it('shows SignInWithEmailLinkPage as default '
  + 'and shows the selected sub page.', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInPage />
      </MemoryRouter>,
    );
    expect(screen.queryByTestId('SignInWithEmailLinkPage')).toBeInTheDocument();

    userEvent.click(screen.queryByLabelText(i18n.t('email address and password')));
    expect(screen.queryByTestId('SignInWithPassword')).toBeInTheDocument();

    userEvent.click(screen.queryByLabelText(i18n.t('sign in with email link')));
    expect(screen.queryByTestId('SignInWithEmailLinkPage')).toBeInTheDocument();
  });
});

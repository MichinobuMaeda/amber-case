import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { i18n } from '../conf';
import '../testConfig';

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
    expect(screen.queryByTestId('signInWithEmailLink-panel')).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeNull();

    userEvent.click(screen.queryByLabelText(i18n.t('email address and password')));
    expect(screen.queryByTestId('signInWithPassword-panel')).toBeInTheDocument();

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'a');
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeInTheDocument();

    userEvent.click(screen.queryByLabelText(i18n.t('sign in with email link')));
    expect(screen.queryByTestId('signInWithEmailLink-panel')).toBeInTheDocument();

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), '@');
    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'b');
    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'c');
    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), '.');
    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'd');
    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'e');
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeNull();
  });
});

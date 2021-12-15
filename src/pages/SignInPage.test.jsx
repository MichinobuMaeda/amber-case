import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { i18n } from '../conf';
import SignInPage from './SignInPage';

describe('SignInPage', () => {
  it('shows SignInWithEmailLinkPage as default '
  + 'and shows the selected sub page.', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SignInPage />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('signInWithEmailLink-panel')).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeNull();

    userEvent.click(screen.queryByLabelText(i18n.t('email address and password')));
    expect(screen.getByTestId('signInWithPassword-panel')).toBeInTheDocument();

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'a');
    expect(screen.getByText(i18n.t('correct your email address'))).toBeInTheDocument();

    userEvent.click(screen.queryByLabelText(i18n.t('sign in with email link')));
    expect(screen.getByTestId('signInWithEmailLink-panel')).toBeInTheDocument();

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), '@');
    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'b');
    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'c');
    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), '.');
    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'd');
    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'e');
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeNull();
  });
});

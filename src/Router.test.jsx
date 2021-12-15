import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { AppContext } from './api';
import {
  initialieMock, mockContext,
} from './setupTests';
import { i18n } from './conf';
import Router from './Router';

jest.mock('firebase/firestore', () => ({}));
jest.mock('react-markdown', () => 'div');

beforeEach(() => {
  initialieMock();
});

describe('Router', () => {
  it('shows LoadingPage if the status is loading.', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/']}>
          <Router />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
    expect(screen.queryByTestId('LoginIcon')).toBeNull();
    expect(screen.queryByTestId('MarkEmailReadIcon')).toBeNull();
    expect(screen.queryByTestId('HomeIcon')).toBeNull();
    expect(screen.queryByTestId('AccountCircleIcon')).toBeNull();
    expect(screen.queryByTestId('InfoIcon')).toBeNull();
  });

  it('shows SignInPage as the top page if the status is guest.', () => {
    mockContext.conf = { id: 'conf' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/']}>
          <Router />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByText(i18n.t('select login method'))).toBeInTheDocument();
    expect(screen.queryAllByTestId('LoginIcon')).toHaveLength(2);
    expect(screen.queryByTestId('MarkEmailReadIcon')).toBeNull();
    expect(screen.queryByTestId('HomeIcon')).toBeNull();
    expect(screen.getByTestId('AccountCircleIcon')).toBeInTheDocument();
    expect(screen.getByTestId('InfoIcon')).toBeInTheDocument();
  });

  it('shows PreferencesPage for path "/prefs" if the status is guest.', () => {
    mockContext.conf = { id: 'conf' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/prefs']}>
          <Router />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByTestId('preferences-page')).toBeInTheDocument();
    expect(screen.getByTestId('LoginIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('MarkEmailReadIcon')).toBeNull();
    expect(screen.queryByTestId('HomeIcon')).toBeNull();
    expect(screen.queryAllByTestId('AccountCircleIcon')).toHaveLength(2);
    expect(screen.getByTestId('InfoIcon')).toBeInTheDocument();
  });

  it('shows InfoPage for path "/info" if the status is guest.', () => {
    mockContext.conf = { id: 'conf' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/info']}>
          <Router />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByTestId('copyright-section')).toBeInTheDocument();
    expect(screen.getByTestId('LoginIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('MarkEmailReadIcon')).toBeNull();
    expect(screen.queryByTestId('HomeIcon')).toBeNull();
    expect(screen.getByTestId('AccountCircleIcon')).toBeInTheDocument();
    expect(screen.queryAllByTestId('InfoIcon')).toHaveLength(2);
  });

  it('shows EmailVerificationPage as the top page if the status is pending.', () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01', email: 'id01@example.com' };
    mockContext.me = { id: 'id01', valid: true, name: 'User 01' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/']}>
          <Router />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByTestId(i18n.t('emailVerification-page'))).toBeInTheDocument();
    expect(screen.queryByTestId('LoginIcon')).toBeNull();
    expect(screen.queryAllByTestId('MarkEmailReadIcon')).toHaveLength(2);
    expect(screen.queryByTestId('HomeIcon')).toBeNull();
    expect(screen.getByTestId('AccountCircleIcon')).toBeInTheDocument();
    expect(screen.getByText(/User\s01/)).toBeInTheDocument();
    expect(screen.getByTestId('InfoIcon')).toBeInTheDocument();
  });

  it('shows HomePage as the top page if the status is user.', () => {
    mockContext.conf = { id: 'conf' };
    mockContext.authUser = { uid: 'id01', email: 'id01@example.com', emailVerified: true };
    mockContext.me = { id: 'id01', valid: true, name: 'User 01' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={['/']}>
          <Router />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('LoginIcon')).toBeNull();
    expect(screen.queryByTestId('MarkEmailReadIcon')).toBeNull();
    expect(screen.queryAllByTestId('HomeIcon')).toHaveLength(2);
    expect(screen.getByTestId('AccountCircleIcon')).toBeInTheDocument();
    expect(screen.getByText(/User\s01/)).toBeInTheDocument();
    expect(screen.getByTestId('InfoIcon')).toBeInTheDocument();
  });
});

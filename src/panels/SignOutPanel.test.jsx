import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useParams } from 'react-router-dom';

import { initialieMock, mockContext } from '../setupTests';
import AppContext from '../api/AppContext';
import { handleSignOut } from '../api/authentication';
import SignOutPanel from './SignOutPanel';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

jest.mock('../api/authentication', () => ({
  ...jest.requireActual('../api/authentication'),
  handleSignOut: jest.fn(),
}));

beforeEach(() => {
  initialieMock();
});

describe('SignOutPanel', () => {
  it('shows button Sign-out.', async () => {
    useParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockContext.me = { id: 'id01', valid: true };
    mockContext.authUser = { uid: 'id01', emailVerified: true };
    render(
      <AppContext.Provider value={mockContext}>
        <SignOutPanel />
      </AppContext.Provider>,
    );

    expect(screen.getByRole('button', { name: 'sign-out' })).toBeInTheDocument();

    userEvent.click(screen.queryByRole('button', { name: 'sign-out' }));
    await waitFor(() => expect(handleSignOut.mock.calls.length).toEqual(1));
    expect(mockNavigate.mock.calls.length).toEqual(1);
    expect(mockNavigate.mock.calls[0][0]).toEqual('/signin');
  });
});

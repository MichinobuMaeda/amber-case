import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// import { i18n } from '../conf';
import { resetMockService, mockContext } from '../testConfig';

const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: mockUseParams,
}));

const mockHandleSignOut = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  handleSignOut: mockHandleSignOut,
}));

// work around for mocking problem.
const { MemoryRouter } = require('react-router-dom');
const { AppContext } = require('../api');
const { SignOutPanel } = require('./indexTest');

beforeEach(() => {
  resetMockService();
});

describe('SignOutPanel', () => {
  it('shows button Sign-out.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockContext.me = { id: 'id01', valid: true };
    mockContext.authUser = { uid: 'id01', emailVerified: true };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <SignOutPanel />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'sign-out' })).toBeInTheDocument();

    userEvent.click(screen.queryByRole('button', { name: 'sign-out' }));
    await waitFor(() => expect(mockHandleSignOut.mock.calls.length).toEqual(1));
    expect(mockNavigate.mock.calls.length).toEqual(1);
    expect(mockNavigate.mock.calls[0][0]).toEqual('/');
    expect(mockNavigate.mock.calls[0][1]).toEqual({ replace: true });
  });
});

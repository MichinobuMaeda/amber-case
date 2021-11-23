import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import { resetMockService, mockContext } from '../testConfig';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockSetMyEmail = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  setMyEmail: mockSetMyEmail,
}));

// work around for mocking problem.
const { MemoryRouter } = require('react-router-dom');
const { AppContext } = require('../api');
const { MyEmailPanel } = require('./indexTest');

beforeEach(() => {
  resetMockService();
});

describe('MyEmailPanel', () => {
  const successMessage = i18n.t('completed saving data');
  const errorMessage = i18n.t('failed to save data') + i18n.t('retry failed or call admin');

  it('disables button if data is not modified.', async () => {
    mockContext.auth.currentUser = { uid: 'id01', email: 'abc@def.ghi' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/myEmail' }]}>
          <MyEmailPanel />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it('enables button if data is valid and is modified.', async () => {
    mockContext.auth.currentUser = { uid: 'id01', email: 'abc@def.gh' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/myEmail' }]}>
          <MyEmailPanel />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'i');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'a');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'b');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'c');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '@');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'd');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'e');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'f');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '.');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'g');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'h');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'i');
    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();

    userEvent.click(screen.queryByRole('button', { name: 'save' }));
    await waitFor(() => expect(mockSetMyEmail.mock.calls.length).toEqual(1));
    expect(mockSetMyEmail.mock.calls[0][1]).toEqual('abc@def.ghi');
    expect(screen.queryByText(successMessage)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'j');
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it('disables button if data is invalid.', async () => {
    mockContext.auth.currentUser = { uid: 'id01', email: 'abc@def.ghi' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/myEmail' }]}>
          <MyEmailPanel />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), '{backspace}');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'a');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'b');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'c');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '@');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'd');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'e');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'f');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '.');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'g');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'h');
    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), '{backspace}');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '{backspace}');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'h');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'h');
    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();
  });

  it('shows error message on click button "save" with exception.', async () => {
    mockSetMyEmail.mockImplementationOnce(() => { throw Error(''); });
    mockContext.auth.currentUser = { uid: 'id01', email: 'abc@def.gh' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/myEmail' }]}>
          <MyEmailPanel />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'i');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'a');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'b');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'c');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '@');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'd');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'e');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'f');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '.');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'g');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'h');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'i');

    userEvent.click(screen.queryByRole('button', { name: 'save' }));
    await waitFor(() => expect(mockSetMyEmail.mock.calls.length).toEqual(1));
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeInTheDocument();
  });

  it('require data.', async () => {
    mockContext.auth.currentUser = { uid: 'id01', email: '' };
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/myEmail' }]}>
          <MyEmailPanel />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    expect(screen.queryByText(i18n.t('input is required'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('do not match the confirmation input'))).toBeNull();

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), 'a');
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('do not match the confirmation input'))).toBeInTheDocument();

    userEvent.type(screen.queryByLabelText(i18n.t('E-mail')), '{backspace}');
    expect(screen.queryByText(i18n.t('input is required'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('do not match the confirmation input'))).toBeNull();
  });
});

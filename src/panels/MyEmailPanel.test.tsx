import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import { initializeMock, mockContext } from '../setupTests';
import AppContext from '../api/AppContext';
import { setMyEmail } from '../api/authentication';
import MyEmailPanel from './MyEmailPanel';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../api/authentication', () => ({
  ...jest.requireActual('../api/authentication'),
  setMyEmail: jest.fn(),
}));

beforeEach(() => {
  initializeMock();
});

describe('MyEmailPanel', () => {
  const successMessage = i18n.t('completed saving data');
  const requiredMessage = i18n.t('input is required');
  const comfermationMassage = i18n.t('do not match the confirmation input');
  const errorMessage = i18n.t('failed to save data') + i18n.t('retry failed or call admin');

  it('disables button if data is not modified.', async () => {
    mockContext.auth.currentUser = { uid: 'id01' };
    render(
      <AppContext.Provider value={mockContext}>
        <MyEmailPanel />
      </AppContext.Provider>,
    );

    expect((screen.queryByRole('button', { name: 'save' }))).toBeDisabled();
  });

  it('enables button if data is valid and is modified.', async () => {
    mockContext.auth.currentUser = { uid: 'id01', email: 'abc@def.gh' };
    render(
      <AppContext.Provider value={mockContext}>
        <MyEmailPanel />
      </AppContext.Provider>,
    );

    expect(screen.queryByText(requiredMessage)).toBeNull();
    expect(screen.queryByText(comfermationMassage)).toBeNull();
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'a');
    expect(screen.getByText(comfermationMassage)).toBeInTheDocument();
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), '{backspace}');
    expect(screen.getByText(requiredMessage)).toBeInTheDocument();
    expect(screen.queryByText(comfermationMassage)).toBeNull();
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'a');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'b');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'c');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), '@');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'd');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'e');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'f');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), '.');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'a');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'b');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'c');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), '@');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'd');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'e');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'f');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), '.');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'g');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'h');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'g');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'h');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'i');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'i');
    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();
    userEvent.click(screen.getByRole('button', { name: 'save' }));
    await waitFor(() => expect(setMyEmail.mock.calls.length).toEqual(1));
    expect(setMyEmail.mock.calls[0][1]).toEqual('abc@def.ghi');
    expect(screen.getByText(successMessage)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'j');
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it('shows error message on click button "save" with exception.', async () => {
    setMyEmail.mockImplementationOnce(() => { throw Error(''); });
    mockContext.auth.currentUser = { uid: 'id01', email: 'abc@def.gh' };
    render(
      <AppContext.Provider value={mockContext}>
        <MyEmailPanel />
      </AppContext.Provider>,
    );

    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'a');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'b');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'c');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), '@');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'd');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'e');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'f');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), '.');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'a');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'b');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'c');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), '@');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'd');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'e');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'f');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), '.');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'g');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'h');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'g');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'h');
    userEvent.type(screen.getByLabelText(`${i18n.t('New E-mail')}`), 'i');
    userEvent.type(screen.getByLabelText(`${i18n.t('Confirmation')}`), 'i');

    userEvent.click(screen.getByRole('button', { name: 'save' }));
    await waitFor(() => expect(setMyEmail.mock.calls.length).toEqual(1));
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('resets reauthenticationTimeout on click button test.', async () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MyEmailPanel />
      </AppContext.Provider>,
    );

    expect(screen.getByRole('button', { name: 'test' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'test' }));
    expect(mockContext.setReauthenticationTimeout.mock.calls.length).toEqual(1);
    expect(mockContext.setReauthenticationTimeout.mock.calls[0][0]).toEqual(0);
  });
});

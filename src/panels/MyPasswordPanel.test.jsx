import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import { initialieMock, mockContext } from '../setupTests';
import AppContext from '../api/AppContext';
import { setMyPassword } from '../api/authentication';
import MyPasswordPanel from './MyPasswordPanel';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../api/authentication', () => ({
  ...jest.requireActual('../api/authentication'),
  setMyPassword: jest.fn(),
}));

beforeEach(() => {
  initialieMock();
});

describe('MyPasswordPanel', () => {
  const successMessage = i18n.t('completed saving data');
  const requiredMessage = i18n.t('input is required');
  const comfermationMassage = i18n.t('do not match the confirmation input');
  const errorMessage = i18n.t('failed to save data') + i18n.t('retry failed or call admin');

  it('enables button if data is valid and is modified.', async () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MyPasswordPanel />
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    expect(screen.getByText(requiredMessage)).toBeInTheDocument();
    expect(screen.queryByText(comfermationMassage)).toBeNull();
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 'T');
    await waitFor(() => expect(screen.queryByText(requiredMessage)).toBeNull());
    expect(screen.getByText(comfermationMassage)).toBeInTheDocument();
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 'e');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 's');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 't');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '1');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '2');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '3');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '4');

    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'T');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'e');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 's');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 't');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '1');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '2');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '3');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '4');
    await waitFor(() => expect(screen.queryByText(requiredMessage)).toBeNull());
    expect(screen.queryByText(comfermationMassage)).toBeNull();
    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();
    userEvent.click(screen.queryByRole('button', { name: 'save' }));
    await waitFor(() => expect(setMyPassword.mock.calls.length).toEqual(1));
    expect(setMyPassword.mock.calls[0][1]).toEqual('Test1234');
    expect(screen.getByText(successMessage)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '5');
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.click(screen.queryAllByTestId('VisibilityOffIcon')[0]);
    expect(screen.queryAllByTestId('VisibilityOffIcon').length).toEqual(0);
    expect(screen.queryAllByTestId('VisibilityIcon').length).toEqual(2);

    userEvent.click(screen.queryAllByTestId('VisibilityIcon')[1]);
    expect(screen.queryAllByTestId('VisibilityOffIcon').length).toEqual(2);
    expect(screen.queryAllByTestId('VisibilityIcon').length).toEqual(0);
  });

  it('disables button if data is invalid.', async () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MyPasswordPanel />
      </AppContext.Provider>,
    );

    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 'T');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 'e');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 's');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 't');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '1');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '2');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '3');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '4');

    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'T');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'e');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 's');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 't');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '1');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '2');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '3');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '4');
    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '{backspace}');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '{backspace}');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '5');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '5');
    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();
  });

  it('shows error message on click button "save" with exception.', async () => {
    setMyPassword.mockImplementationOnce(() => { throw Error(''); });
    render(
      <AppContext.Provider value={mockContext}>
        <MyPasswordPanel />
      </AppContext.Provider>,
    );

    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 'T');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 'e');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 's');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 't');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '1');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '2');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '3');
    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '4');

    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'T');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 'e');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 's');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), 't');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '1');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '2');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '3');
    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '4');

    userEvent.click(screen.queryByRole('button', { name: 'save' }));
    await waitFor(() => expect(setMyPassword.mock.calls.length).toEqual(1));
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('requires data.', async () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MyPasswordPanel />
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    expect(screen.getByText(i18n.t('input is required'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('do not match the confirmation input'))).toBeNull();

    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 'a');
    expect(screen.getByText(i18n.t('correct your password'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('do not match the confirmation input'))).toBeInTheDocument();

    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '{backspace}');
    expect(screen.getByText(i18n.t('input is required'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('do not match the confirmation input'))).toBeNull();
  });
});

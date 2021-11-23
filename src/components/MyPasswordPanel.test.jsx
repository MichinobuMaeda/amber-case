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

const mockSetMyPassword = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  setMyPassword: mockSetMyPassword,
}));

// work around for mocking problem.
const { AppContext } = require('../api');
const { MyPasswordPanel } = require('./indexTest');

beforeEach(() => {
  resetMockService();
});

describe('MyPasswordPanel', () => {
  const successMessage = i18n.t('completed saving data');
  const errorMessage = i18n.t('failed to save data') + i18n.t('retry failed or call admin');

  it('enables button if data is valid and is modified.', async () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MyPasswordPanel />
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();

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
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('Confirmation')), '4');
    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();

    userEvent.click(screen.queryByRole('button', { name: 'save' }));
    await waitFor(() => expect(mockSetMyPassword.mock.calls.length).toEqual(1));
    expect(mockSetMyPassword.mock.calls[0][1]).toEqual('Test1234');
    expect(screen.queryByText(successMessage)).toBeInTheDocument();
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
    mockSetMyPassword.mockImplementationOnce(() => { throw Error(''); });
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
    await waitFor(() => expect(mockSetMyPassword.mock.calls.length).toEqual(1));
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeInTheDocument();
  });

  it('require data.', async () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MyPasswordPanel />
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    expect(screen.queryByText(i18n.t('input is required'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('do not match the confirmation input'))).toBeNull();

    userEvent.type(screen.queryByLabelText(i18n.t('Password')), 'a');
    expect(screen.queryByText(i18n.t('correct your password'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('do not match the confirmation input'))).toBeInTheDocument();

    userEvent.type(screen.queryByLabelText(i18n.t('Password')), '{backspace}');
    expect(screen.queryByText(i18n.t('input is required'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('do not match the confirmation input'))).toBeNull();
  });
});

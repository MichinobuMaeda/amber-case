import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import { resetMockService, mockContext } from '../testConfig';

const mockSetAccountProperties = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  setAccountProperties: mockSetAccountProperties,
}));

// work around for mocking problem.
const { AppContext } = require('../api');
const { MyDisplayNamePanel } = require('.');

beforeEach(() => {
  resetMockService();
});

describe('MyDisplayNamePanel', () => {
  const successMessage = i18n.t('completed saving data');
  const errorMessage = i18n.t('failed to save data') + i18n.t('retry failed or call admin');

  it('disables button if data is not modified.', async () => {
    mockContext.me = { id: 'id01', vaid: true, name: 'User 01' };
    render(
      <AppContext.Provider value={mockContext}>
        <MyDisplayNamePanel />
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it('enables button if data is valid and is modified.', async () => {
    mockContext.me = { id: 'id01', valid: true, name: 'User 01' };
    render(
      <AppContext.Provider value={mockContext}>
        <MyDisplayNamePanel />
      </AppContext.Provider>,
    );

    userEvent.type(screen.queryByLabelText(i18n.t('Display name')), 'x');
    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();

    userEvent.click(screen.queryByRole('button', { name: 'save' }));
    await waitFor(() => expect(mockSetAccountProperties.mock.calls.length).toEqual(1));
    expect(mockSetAccountProperties.mock.calls[0][1]).toEqual('id01');
    expect(mockSetAccountProperties.mock.calls[0][2]).toEqual({ name: 'User 01x' });
    expect(screen.queryByText(successMessage)).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.type(screen.queryByLabelText(i18n.t('Display name')), 'y');
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it('disables button if data is invalid.', async () => {
    mockContext.me = { id: 'id01', valid: true, name: '' };
    render(
      <AppContext.Provider value={mockContext}>
        <MyDisplayNamePanel />
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.type(screen.queryByLabelText(i18n.t('Display name')), 'x');
    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('Display name')), '{backspace}');
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
  });

  it('shows error message on click button "save" with exception.', async () => {
    mockContext.me = { id: 'id01', valid: true, name: 'User 01 ' };
    mockSetAccountProperties.mockImplementationOnce(() => { throw Error(''); });
    render(
      <AppContext.Provider value={mockContext}>
        <MyDisplayNamePanel />
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();

    userEvent.type(screen.queryByLabelText(i18n.t('Display name')), 'x');
    userEvent.click(screen.queryByRole('button', { name: 'save' }));
    await waitFor(() => expect(mockSetAccountProperties.mock.calls.length).toEqual(1));
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeInTheDocument();

    userEvent.type(screen.queryByLabelText(i18n.t('Display name')), 'y');
    expect(screen.queryByText(successMessage)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();
  });
});

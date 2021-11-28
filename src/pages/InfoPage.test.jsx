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

const mockSetConfProperties = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  setConfProperties: mockSetConfProperties,
}));

// work around for mocking problem.
const { AppContext } = require('../api');
const { InfoPage } = require('.');

beforeEach(() => {
  resetMockService();
});

describe('InfoPage', () => {
  const errorMessage = i18n.t('failed to save data') + i18n.t('retry failed or call admin');

  it('disables button edit for guest.', async () => {
    mockContext.conf.policy = 'text';
    mockContext.me = {};
    render(
      <AppContext.Provider value={mockContext}>
        <InfoPage />
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'edit-policy' })).toBeNull();
  });

  it('disables button edit for user without admin priv.', async () => {
    mockContext.conf.policy = 'text';
    mockContext.me = { id: 'id01', valid: true, admin: false };
    render(
      <AppContext.Provider value={mockContext}>
        <InfoPage />
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'edit-policy' })).toBeNull();
  });

  it('disables button save if data is not modified.', async () => {
    mockContext.conf.policy = 'text';
    mockContext.me = { id: 'id01', valid: true, admin: true };
    render(
      <AppContext.Provider value={mockContext}>
        <InfoPage />
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'edit-policy' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'save' })).toBeNull();
    userEvent.click(screen.queryByRole('button', { name: 'edit-policy' }));

    expect(screen.queryByRole('button', { name: 'edit-policy' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();
    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it('enables button if data is modified.', async () => {
    mockContext.conf.policy = 'text';
    mockContext.me = { id: 'id01', valid: true, admin: true };
    render(
      <AppContext.Provider value={mockContext}>
        <InfoPage />
      </AppContext.Provider>,
    );

    userEvent.click(screen.queryByRole('button', { name: 'edit-policy' }));
    expect(screen.queryByRole('button', { name: 'save' })).toBeDisabled();

    userEvent.type(screen.queryByLabelText(i18n.t('Policy')), 'x');
    expect(screen.queryByRole('button', { name: 'save' })).not.toBeDisabled();

    userEvent.click(screen.queryByRole('button', { name: 'save' }));
    await waitFor(() => expect(mockSetConfProperties.mock.calls.length).toEqual(1));
    expect(mockSetConfProperties.mock.calls[0][1]).toEqual({ policy: 'textx' });
    expect(screen.queryByRole('button', { name: 'save' })).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();
    expect(screen.queryByRole('button', { name: 'edit-policy' })).toBeInTheDocument();
  });

  it('exits edit mode on click button cancel.', async () => {
    mockContext.conf.policy = 'text';
    mockContext.me = { id: 'id01', valid: true, admin: true };
    render(
      <AppContext.Provider value={mockContext}>
        <InfoPage />
      </AppContext.Provider>,
    );

    userEvent.click(screen.queryByRole('button', { name: 'edit-policy' }));
    expect(screen.queryByRole('button', { name: 'save' })).toBeInTheDocument();

    userEvent.click(screen.queryByRole('button', { name: 'cancel' }));
    expect(screen.queryByRole('button', { name: 'save' })).toBeNull();
  });

  it('shows error message on click button "save" with exception.', async () => {
    mockSetConfProperties.mockImplementationOnce(() => { throw Error(''); });
    mockContext.conf.policy = 'text';
    mockContext.me = { id: 'id01', valid: true, admin: true };
    render(
      <AppContext.Provider value={mockContext}>
        <InfoPage />
      </AppContext.Provider>,
    );

    userEvent.click(screen.queryByRole('button', { name: 'edit-policy' }));
    userEvent.type(screen.queryByLabelText(i18n.t('Policy')), 'x');
    userEvent.click(screen.queryByRole('button', { name: 'save' }));

    await waitFor(() => expect(mockSetConfProperties.mock.calls.length).toEqual(1));
    expect(screen.queryByText(mockSetConfProperties)).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { User } from 'firebase/auth';

import { initializeMock, mockContext } from '../setupTests';
import AppContext from '../api/AppContext';
import { Conf, Account } from '../api/models';
import { setConfProperties } from '../api/service';
import InfoPage from './InfoPage';

jest.mock('../api/service', () => ({
  ...jest.requireActual('../api/service'),
  setConfProperties: jest.fn(),
}));

beforeEach(() => {
  initializeMock();
});

describe('InfoPage', () => {
  it('disables edit buttons for user without admin priv.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true } as Account;
    render(
      <AppContext.Provider value={mockContext}>
        <InfoPage />
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'copyright-edit' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'policy-edit' })).toBeNull();
  });

  it('enalbes edit buttons edit for admin.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true, admin: true } as Account;
    render(
      <AppContext.Provider value={mockContext}>
        <InfoPage />
      </AppContext.Provider>,
    );

    userEvent.click(screen.getByRole('button', { name: 'copyright-section-summary' }));
    expect(screen.getByRole('button', { name: 'copyright-edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'policy-edit' })).toBeInTheDocument();
  });

  it('saves edited data of copyright on click save button.', async () => {
    mockContext.conf = { id: 'conf', copyright: 'abc', policy: 'ABC' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true, admin: true } as Account;
    render(
      <AppContext.Provider value={mockContext}>
        <InfoPage />
      </AppContext.Provider>,
    );

    userEvent.click(screen.getByRole('button', { name: 'copyright-section-summary' }));
    expect(await screen.findByRole('button', { name: 'copyright-edit' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'copyright-edit' }));
    await expect(screen.getByRole('button', { name: 'copyright-save' })).toBeInTheDocument();
    userEvent.type(screen.getByRole('textbox', { name: 'copyright-input' }), 'd');
    userEvent.click(screen.getByRole('button', { name: 'copyright-save' }));
    expect(setConfProperties.mock.calls.length).toEqual(1);
    expect(setConfProperties.mock.calls[0][1]).toEqual({ copyright: 'abcd' });
  });

  it('saves edited data of policy on click save button.', async () => {
    mockContext.conf = { id: 'conf', copyright: 'abc', policy: 'ABC' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true, admin: true } as Account;
    render(
      <AppContext.Provider value={mockContext}>
        <InfoPage />
      </AppContext.Provider>,
    );

    userEvent.click(screen.getByRole('button', { name: 'copyright-section-summary' }));
    expect(await screen.findByRole('button', { name: 'policy-edit' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'policy-edit' }));
    await expect(screen.getByRole('button', { name: 'policy-save' })).toBeInTheDocument();
    userEvent.type(screen.getByRole('textbox', { name: 'policy-input' }), 'D');
    userEvent.click(screen.getByRole('button', { name: 'policy-save' }));
    expect(setConfProperties.mock.calls.length).toEqual(1);
    expect(setConfProperties.mock.calls[0][1]).toEqual({ policy: 'ABCD' });
  });
});

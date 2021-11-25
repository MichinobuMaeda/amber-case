import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Settings from '@mui/icons-material/Settings';

import { i18n } from '../conf';
import {
  resetMockService, mockContext,
} from '../testConfig';

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
const { AppContext, acceptAny, acceptUser } = require('../api');
const { AccordionPage, ThemeModePanel, MyDisplayNamePanel } = require('.');

beforeEach(() => {
  resetMockService();
});

describe('AccordionPage', () => {
  it('shows panels for user '
  + 'without email has verification.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockContext.me = { id: 'id01', valid: true };
    mockContext.authUser = { uid: 'id01', emailVerified: false };
    mockContext.reauthenticationTimeout = 1;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <AccordionPage
            data-testid="settings-page"
            icon={<Settings />}
            title={i18n.t('Settings')}
            route="settings"
            panels={[
              {
                priv: acceptAny,
                id: 'themeMode',
                title: i18n.t('Theme mode'),
                body: <ThemeModePanel />,
              },
              {
                priv: acceptUser,
                id: 'myDisplayName',
                title: i18n.t('My display name'),
                body: <MyDisplayNamePanel />,
              },
            ]}
          />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('themeMode-title')).toBeInTheDocument();
    expect(screen.queryByTestId('themeMode-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-title')).toBeNull();
    expect(screen.queryByTestId('myDisplayName-panel')).toBeNull();
  });

  it('shows panels for user '
  + 'if user has signed in and email has verified.', async () => {
    mockUseParams.mockImplementationOnce(() => ({ panel: 'themeMode' }));
    mockContext.me = { id: 'id01', valid: true };
    mockContext.authUser = { uid: 'id01', emailVerified: true };
    mockContext.reauthenticationTimeout = 1;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/themeMode' }]}>
          <AccordionPage
            data-testid="settings-page"
            icon={<Settings />}
            title={i18n.t('Settings')}
            route="settings"
            panels={[
              {
                priv: acceptAny,
                id: 'themeMode',
                title: i18n.t('Theme mode'),
                body: <ThemeModePanel />,
              },
              {
                priv: acceptUser,
                id: 'myDisplayName',
                title: i18n.t('My display name'),
                body: <MyDisplayNamePanel />,
              },
            ]}
          />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByTestId('themeMode-title')).toBeInTheDocument();
    expect(screen.queryByTestId('themeMode-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-title')).toBeInTheDocument();
    expect(screen.queryByTestId('myDisplayName-panel')).toBeInTheDocument();

    userEvent.click(screen.queryByTestId(i18n.t('myDisplayName-title')));
    await waitFor(() => expect(mockNavigate.mock.calls.length).toEqual(1));
    expect(mockNavigate.mock.calls[0][0]).toEqual('/settings/myDisplayName');
  });
});

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { i18n } from '../conf';
import { resetMockService, mockService } from '../testConfig';

let mockNavigationType;
const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigationType: jest.fn(() => mockNavigationType),
  useNavigate: () => mockUseNavigate,
}));

const mockUpdateApp = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  updateApp: mockUpdateApp,
}));

// work around for mocking problem.
const { ServiceContext } = require('../api');
const { Header } = require('.');

beforeEach(() => {
  resetMockService();
});

describe('Header', () => {
  it('hides the back button and hides the settings button, '
    + 'on "/" and if the service is not loaded.', () => {
    render(
      <ServiceContext.Provider value={{ conf: {} }}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('app name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'settings' })).toBeNull();
  });

  it('hides the back button and shows the settings button, '
    + 'on "/" and if the service is loaded.', () => {
    render(
      <ServiceContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('app name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'settings' })).toBeInTheDocument();
  });

  it('shows back button and hides settings button, '
    + 'on "/settings/x" and if the service is not loaded.', () => {
    render(
      <ServiceContext.Provider value={{ conf: {} }}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('app name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'settings' })).toBeNull();
  });

  it('shows back button and disables settings button, '
    + 'on "/settings/x" and if the service is loaded.', () => {
    render(
      <ServiceContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/settings/x' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('app name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'settings' })).toHaveAttribute('disabled');
  });

  it('shows back button and shows settings button, '
    + 'on "/policy" and if the service is not loaded.', () => {
    render(
      <ServiceContext.Provider value={{ conf: {} }}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('app name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'settings' })).toBeNull();
  });

  it('shows back button and shows settings button, '
    + 'on "/policy" and if the service is loaded.', () => {
    render(
      <ServiceContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByText(i18n.t('app name'))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'back' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'settings' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'settings' })).not.toHaveAttribute('disabled');
  });

  it('calls navigation("/", { replace: true }) on the back button, '
  + 'if history has no entry.', () => {
    mockNavigationType = 'POP';
    render(
      <ServiceContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    userEvent.click(screen.queryByRole('button', { name: 'back' }));
    expect(mockUseNavigate.mock.calls.length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0].length).toEqual(2);
    expect(mockUseNavigate.mock.calls[0][0]).toEqual('/');
    expect(mockUseNavigate.mock.calls[0][1]).toEqual({ replace: true });
  });

  it('calls navigation(-1) on the back button, '
  + 'if history has entries.', () => {
    mockNavigationType = 'PUSH';
    render(
      <ServiceContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    userEvent.click(screen.queryByRole('button', { name: 'back' }));
    expect(mockUseNavigate.mock.calls.length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0].length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0][0]).toEqual(-1);
  });

  it('calls navigation("/settings/themeMode") on the settings button.', () => {
    mockNavigationType = 'PUSH';
    render(
      <ServiceContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    userEvent.click(screen.queryByRole('button', { name: 'settings' }));
    expect(mockUseNavigate.mock.calls.length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0].length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0][0]).toEqual('/settings/themeMode');
  });

  it('do not shows button appUpdate if this app is latest version.', () => {
    mockService.conf = {
      id: 'conf',
      version: mockService.version,
    };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'updateApp' })).toBeNull();
  });

  it('shows button appUpdate if this app is out of date.', () => {
    mockService.conf = {
      id: 'conf',
      version: 'x.x.x',
    };
    render(
      <ServiceContext.Provider value={mockService}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'updateApp' })).toBeInTheDocument();

    userEvent.click(screen.queryByRole('button', { name: 'updateApp' }));
    expect(mockUpdateApp.mock.calls.length).toEqual(1);
  });
});

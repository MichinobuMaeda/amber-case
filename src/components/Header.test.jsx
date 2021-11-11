/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ServiceContext } from '../api';

import { i18n } from '../conf';
import { Header } from '.';

let mockNavigationType;
const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigationType: jest.fn(() => mockNavigationType),
  useNavigate: () => mockUseNavigate,
}));

afterEach(() => {
  jest.clearAllMocks();
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

  it('calls history.replace("/") on the back button, '
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

  it('calls history.goBack() on the back button, '
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

  it('calls history.goBack() on the settings button, '
  + 'on "/policy".', () => {
    mockNavigationType = 'PUSH';
    render(
      <ServiceContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/policy' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    userEvent.click(screen.queryByRole('button', { name: 'settings' }));
    expect(mockUseNavigate.mock.calls.length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0].length).toEqual(1);
    expect(mockUseNavigate.mock.calls[0][0]).toEqual(-1);
  });

  it('calls history.push("/settings/themeMode") on the settings button, '
  + 'on not "/policy" and with history entries.', () => {
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

  it('calls history.goBack() on the settings button, '
  + 'on not "/policy" and without history entries.', () => {
    mockNavigationType = 'POP';
    render(
      <ServiceContext.Provider value={{ conf: { id: 'conf' } }}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Header />
        </MemoryRouter>
      </ServiceContext.Provider>,
    );
    userEvent.click(screen.queryByRole('button', { name: 'settings' }));
  });
});

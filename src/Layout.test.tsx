import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import { User } from 'firebase/auth';

import { initializeMock, mockContext } from './setupTests';
import { i18n, firebaseConfig } from './conf';
import AppContext from './api/AppContext';
import { Conf, Account } from './api/models';
import { updateApp } from './api/ui';
import { MenuItem } from './api/authorization';
import Layout from './Layout';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@mui/material/useMediaQuery');

jest.mock('./api/ui', () => ({
  ...jest.requireActual('./api/ui'),
  updateApp: jest.fn(),
}));

beforeEach(() => {
  initializeMock();
});

describe('Layout', () => {
  const pages = [
    {
      path: '',
      require: 'user',
      title: i18n.t('Home'),
      icon: <HomeIcon />,
      element: <div>Home page</div>,
      top: true,
    } as MenuItem,
    {
      path: 'prefs',
      require: 'loaded',
      title: 'Preferences',
      icon: <AccountCircleIcon />,
      element: <div>Preferences page</div>,
    } as MenuItem,
    {
      path: 'info',
      require: 'loaded',
      title: 'Infomation',
      icon: <InfoIcon />,
      element: <div>Infomation page</div>,
    } as MenuItem,
  ];

  it('shows back button if the current page is not a top page.', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/prefs' }]}>
          <Layout pages={pages}><div>Test</div></Layout>
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.getByRole('button', { name: 'back' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'back' }));
    expect(mockNavigate.mock.calls).toEqual([[-1]]);
  });

  it('hides back button if the current page is a top page.', () => {
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout pages={pages}><div>Test</div></Layout>
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'back' })).toBeNull();
  });

  it('shows menu button if the widow witdh is less than md.', async () => {
    mockContext.conf = { id: 'conf' } as Conf;
    useMediaQuery.mockImplementation(() => true);
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout pages={pages}><div>Test</div></Layout>
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.getByRole('button', { name: 'menu' })).toBeInTheDocument();
    expect(screen.getByTestId('MenuIcon')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('MenuIcon'));
    expect(await screen.findByTestId('ChevronRightIcon')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('ChevronRightIcon'));
    expect(await screen.findByTestId('MenuIcon')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('MenuIcon'));
    expect(await screen.findByTestId('ChevronRightIcon')).toBeInTheDocument();
    expect(await screen.findAllByTestId('HomeIcon')).toHaveLength(2);
    expect(await screen.findByTestId('AccountCircleIcon')).toBeInTheDocument();
    expect(await screen.findByTestId('InfoIcon')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('AccountCircleIcon'));
    expect(mockNavigate.mock.calls).toEqual([['/prefs']]);
    expect(await screen.findByTestId('MenuIcon')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('MenuIcon'));
    expect(await screen.findByTestId('ChevronRightIcon')).toBeInTheDocument();

    // https://stackoverflow.com/questions/55030879/how-to-trigger-onclose-for-react-ui-menu-with-react-testing-libray
    // fire onClose()
    // eslint-disable-next-line testing-library/no-node-access
    userEvent.click(screen.getByRole('presentation').firstChild);
    expect(await screen.findByTestId('MenuIcon')).toBeInTheDocument();
  });

  it('hides menu button if the widow witdh is more than md.', () => {
    mockContext.conf = { id: 'conf' } as Conf;
    useMediaQuery.mockImplementation(() => false);
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/prefs' }]}>
          <Layout pages={pages}><div>Test</div></Layout>
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'menu' })).toBeNull();
  });

  it('shows updateApp button if the UI verion and conf.verson do not match.', () => {
    mockContext.version = '1.0.0';
    mockContext.conf = { id: 'conf', version: '1.0.1' } as Conf;
    useMediaQuery.mockImplementation(() => false);
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/prefs' }]}>
          <Layout pages={pages}><div>Test</div></Layout>
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByRole('button', { name: 'updateApp' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'updateApp' }));
    expect(updateApp.mock.calls).toHaveLength(1);
  });

  it('hides updateApp button if the UI verion and conf.verson match.', () => {
    mockContext.version = '1.0.0';
    mockContext.conf = { id: 'conf', version: '1.0.0' } as Conf;
    useMediaQuery.mockImplementation(() => false);
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/prefs' }]}>
          <Layout pages={pages}><div>Test</div></Layout>
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'updateApp' })).toBeNull();
  });

  it('shows debug button if the env is "test" and the status is "loaded".', () => {
    firebaseConfig.apiKey = 'FIREBASE_API_KEY';
    mockContext.conf = { id: 'conf' } as Conf;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout pages={pages}><div>Test</div></Layout>
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.getByRole('button', { name: 'debug' })).toBeInTheDocument();
  });

  it('hides debug button if the env is not "test" and the status is "loaded".', () => {
    firebaseConfig.apiKey = 'production key';
    mockContext.conf = { id: 'conf' } as Conf;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout pages={[]}><div>Test</div></Layout>
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'debug' })).toBeNull();
  });

  it('shows debug button if the user is a tester.', () => {
    firebaseConfig.apiKey = 'production key';
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true, tester: true } as Account;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout pages={[]}><div>Test</div></Layout>
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.getByRole('button', { name: 'debug' })).toBeInTheDocument();
  });

  it('hides debug button if the user is not a tester.', () => {
    firebaseConfig.apiKey = 'production key';
    mockContext.conf = { id: 'conf' } as Conf;
    mockContext.authUser = { uid: 'id01' } as User;
    mockContext.me = { id: 'id01', valid: true, tester: false } as Account;
    render(
      <AppContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/' }]}>
          <Layout pages={[]}><div>Test</div></Layout>
        </MemoryRouter>
      </AppContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: 'debug' })).toBeNull();
  });
});

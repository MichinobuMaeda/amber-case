import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navigate, useLocation } from 'react-router-dom';

import AppContext, { Context } from '../api/AppContext';
import { initializeMock, mockContext } from '../setupTests';
import Guard from './Guard';
import { Priv } from "../api/authorization";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: jest.fn(),
  useLocation: jest.fn(),
}));

beforeEach(() => {
  Navigate.mockImplementation(() => null);
  initializeMock();
});

const contextLoading = {
  ...mockContext,
  conf: {},
  authUser: {},
  me: {},
} as Context;
const contextGuest = {
  ...mockContext,
  conf: { id: 'conf' },
  authUser: {},
  me: {},
} as Context;
const contextPending = {
  ...mockContext,
  conf: { id: 'conf' },
  authUser: { uid: 'id01', email: 'id01@example.com' },
  me: { id: 'id01', valid: true },
} as Context;
const contextUser = {
  ...mockContext,
  conf: { id: 'conf' },
  authUser: { uid: 'id01' },
  me: { id: 'id01', valid: true },
} as Context;
const contextAdmin = {
  ...mockContext,
  conf: { id: 'conf' },
  authUser: { uid: 'id01' },
  me: { id: 'id01', valid: true, admin: true },
} as Context;

const locationNoState = {
  pathname: '/test1',
};

const locationWithState = {
  pathname: '/test1',
  state: {
    from: {
      pathname: '/test2',
    },
  },
};

const redirectTest = (context: Context, require: number) => (
  <AppContext.Provider value={context}>
    <Guard require={require} redirect>
      Test01
    </Guard>
  </AppContext.Provider>
);

describe('Guard', () => {
  it('shows childlen if the given context meets the required conditions.', () => {
    useLocation.mockImplementationOnce(() => ({}));
    render(
      <AppContext.Provider value={contextLoading} substitutes={(<div>Test02</div>)}>
        <Guard require={Priv.LOADING}>
          Test01
        </Guard>
      </AppContext.Provider>,
    );
    expect(screen.getByText('Test01')).toBeInTheDocument();
    expect(screen.queryByText('Test02')).toBeNull();
  });

  it('shows substitutes if the given context does not meets the required conditions.', () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(
      <AppContext.Provider value={contextLoading}>
        <Guard require={Priv.LOADED} substitutes={(<div>Test02</div>)}>
          Test01
        </Guard>
      </AppContext.Provider>,
    );
    expect(screen.queryByText('Test01')).toBeNull();
    expect(screen.getByText('Test02')).toBeInTheDocument();
  });

  it('redirect to "/" if "admin" is require and has priv "user".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextUser, Priv.ADMIN));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/',
      replace: true,
    });
  });

  it('redirect to "/emailVerify" if "admin" is require and has priv "pending".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextPending, Priv.ADMIN));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/emailVerify',
      state: { from: locationNoState },
    });
  });

  it('redirect to "/signin" if "admin" is require and has priv "guest".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextGuest, Priv.ADMIN));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/signin',
      state: { from: locationNoState },
    });
  });

  it('redirect to "/loading" if "admin" is require and has priv "loading".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextLoading, Priv.ADMIN));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/loading',
      state: { from: locationNoState },
    });
  });

  it('redirect to "/emailVerify" if "user" is require and has priv "pending".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextPending, Priv.USER));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/emailVerify',
      state: { from: locationNoState },
    });
  });

  it('redirect to "/signin" if "user" is require and has priv "guest".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextGuest, Priv.USER));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/signin',
      state: { from: locationNoState },
    });
  });

  it('redirect to "/loading" if "user" is require and has priv "loading".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextLoading, Priv.USER));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/loading',
      state: { from: locationNoState },
    });
  });

  it('redirect to "/" if "pending" is require and has priv "user".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextUser, Priv.PENDING));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/',
      replace: true,
    });
  });

  it('redirect to "/signin" if "pending" is require and has priv "guest".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextGuest, Priv.PENDING));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/signin',
      state: {},
    });
  });

  it('redirect to "/loading" if "pending" is require and has priv "loading".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextLoading, Priv.PENDING));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/loading',
      state: {},
    });
  });

  it('redirect to "/" if "guest" is require and has priv "user".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextUser, Priv.GUEST));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/',
      replace: true,
    });
  });

  it('redirect to "/emailVerify" if "guest" is require and has priv "pending".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextPending, Priv.GUEST));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/emailVerify',
      state: {},
    });
  });

  it('redirect to "/loading" if "guest" is require and has priv "loading".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextLoading, Priv.GUEST));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/loading',
      state: {},
    });
  });

  it('redirect to "/" if "loading" is require and has priv "user".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextUser, Priv.LOADING));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/',
      replace: true,
    });
  });

  it('redirect to "/emailVerify" if "loading" is require and has priv "pending".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextPending, Priv.LOADING));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/emailVerify',
      state: {},
    });
  });

  it('redirect to "/singin" if "loading" is require and has priv "guest".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextGuest, Priv.LOADING));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/signin',
      state: {},
    });
  });

  it('redirect to "/" if "noroute" is require and has priv "admin".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextAdmin, Priv.NOROUTE));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/',
      replace: true,
    });
  });

  it('redirect to "/" if "noroute" is require and has priv "user".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextUser, Priv.NOROUTE));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/',
      replace: true,
    });
  });

  it('redirect to "/" if "noroute" is require and has priv "pending".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextPending, Priv.NOROUTE));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/',
      replace: true,
    });
  });

  it('redirect to "/" if "noroute" is require and has priv "guest".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextGuest, Priv.NOROUTE));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/',
      replace: true,
    });
  });

  it('redirect to "/" if "noroute" is require and has priv "loading".', async () => {
    useLocation.mockImplementationOnce(() => locationNoState);
    render(redirectTest(contextLoading, Priv.NOROUTE));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/',
      replace: true,
    });
  });

  it('seves state if "pending" is require and has priv "guest".', async () => {
    useLocation.mockImplementationOnce(() => locationWithState);
    render(redirectTest(contextGuest, Priv.PENDING));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/signin',
      state: { from: { pathname: '/test2' } },
    });
  });

  it('seves state if "pending" is require and has priv "loading".', async () => {
    useLocation.mockImplementationOnce(() => locationWithState);
    render(redirectTest(contextLoading, Priv.PENDING));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/loading',
      state: { from: { pathname: '/test2' } },
    });
  });

  it('seves state if "guest" is require and has priv "pending".', async () => {
    useLocation.mockImplementationOnce(() => locationWithState);
    render(redirectTest(contextPending, Priv.GUEST));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/emailVerify',
      state: { from: { pathname: '/test2' } },
    });
  });

  it('seves state if "guest" is require and has priv "loading".', async () => {
    useLocation.mockImplementationOnce(() => locationWithState);
    render(redirectTest(contextLoading, Priv.GUEST));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/loading',
      state: { from: { pathname: '/test2' } },
    });
  });

  it('seves state if "loading" is require and has priv "pending".', async () => {
    useLocation.mockImplementationOnce(() => locationWithState);
    render(redirectTest(contextPending, Priv.LOADING));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/emailVerify',
      state: { from: { pathname: '/test2' } },
    });
  });

  it('seves state if "loading" is require and has priv "guest".', async () => {
    useLocation.mockImplementationOnce(() => locationWithState);
    render(redirectTest(contextGuest, Priv.LOADING));
    expect(Navigate.mock.calls[0][0]).toEqual({
      to: '/signin',
      state: { from: { pathname: '/test2' } },
    });
  });
});

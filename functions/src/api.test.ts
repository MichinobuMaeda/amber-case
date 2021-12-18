import { Request, Response } from "express";
import axios from 'axios';
import {
  confSnapshot,
  mockFirebase,
} from './setupTests';
import * as setupModule from './setup';
import {
  setup,
} from './api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('./setup');
const mockedSetup = setupModule as jest.Mocked<typeof setupModule>;

describe('setup()', () => {
  const config = {
    initial: {
      email: 'info@example.com',
      password: 'testpass',
      url: 'https://example.com',
    },
  };
  const req: Partial<Request> = {};
  const res: Partial<Response> = {
    send: jest.fn(),
  };

  it('calls only updateVersion() '
  + 'if conf.version is latest value.', async () => {
    mockedSetup.getConf
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }));
      mockedSetup.updateVersion
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(false); }));
    // res.send
    //   .mockImplementationOnce(() => sendOk);
    const firebase = mockFirebase();

    await setup(firebase, mockedAxios, config)(req as Request, res as Response);

    expect(mockedSetup.getConf.mock.calls).toEqual([[firebase]]);
    expect(mockedSetup.updateVersion.mock.calls).toEqual([[firebase, confSnapshot, mockedAxios]]);
    expect(mockedSetup.updateData.mock.calls).toEqual([]);
    expect(mockedSetup.install.mock.calls).toEqual([]);
    // expect(res.send.mock.calls).toEqual([['OK']]);
    // expect(ret).toEqual(sendOk);
  });

  it('calls updateVersion() and updateData() '
  + 'if conf.version is not value.', async () => {
    mockedSetup.getConf
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }));
    mockedSetup.updateVersion
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(true); }));
    // const sendOk = { body: 'OK' };
    // res.send
    //   .mockImplementationOnce(() => sendOk);
    const firebase = mockFirebase();

    await setup(firebase, mockedAxios, config)(req as Request, res as Response);

    expect(mockedSetup.getConf.mock.calls).toEqual([[firebase]]);
    expect(mockedSetup.updateVersion.mock.calls).toEqual([[firebase, confSnapshot, mockedAxios]]);
    expect(mockedSetup.updateData.mock.calls).toEqual([[firebase, confSnapshot]]);
    expect(mockedSetup.install.mock.calls).toEqual([]);
    // expect(res.send.mock.calls).toEqual([['OK']]);
    // expect(ret).toEqual(sendOk);
  });

  it('calls install() and updateData() '
  + 'if conf is not exists.', async () => {
    mockedSetup.getConf
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(null); }));
    mockedSetup.install
      .mockImplementationOnce(() => new Promise((resolve) => { resolve(confSnapshot); }));
    // const sendOk = { body: 'OK' };
    // res.send
    //   .mockImplementationOnce(() => sendOk);
    const firebase = mockFirebase();

    const fn = setup(firebase, mockedAxios, config);
    await fn(req as Request, res as Response);

    expect(mockedSetup.getConf.mock.calls).toEqual([[firebase]]);
    expect(mockedSetup.updateVersion.mock.calls).toEqual([]);
    expect(mockedSetup.updateData.mock.calls).toEqual([[firebase, confSnapshot]]);
    expect(mockedSetup.install.mock.calls).toEqual([[
      firebase,
      config.initial.email,
      config.initial.password,
      config.initial.url,
    ]]);
    // expect(res.send.mock.calls).toEqual([['OK']]);
    // expect(ret).toEqual(sendOk);
  });
});

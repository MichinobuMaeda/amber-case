// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');
const express = require('express');
const axios = require('axios');
const {
  mockFirebase,
  mockDocAdd,
  mockDocSet,
  mockDocUpdate,
  mockConfExists,
  mockConfData,
} = require('./testConfig');
const {
  init,
} = require('./api');

const config = {
  initial: {
    email: 'primary@example.com',
    password: "primary's password",
    url: 'https://example.com',
  },
};

jest.mock('axios');

afterEach(async () => {
  jest.clearAllMocks();
});

describe('get: /setup', () => {
  it("send text 'OK' and create document 'conf' if document 'conf' is not exists.", async () => {
    const uid = 'id01';
    mockDocAdd.mockImplementationOnce(() => ({ id: uid }));
    mockConfExists.mockImplementationOnce(() => false);

    axios.get.mockResolvedValue({
      data: {
        version: '1.0.0',
      },
    });

    const app = express();
    app.use(express.urlencoded({ extended: true }));
    const request = supertest(init(mockFirebase, config, app, axios));
    const response = await request.get('/setup');

    expect(response.status).toBe(200);
    expect(response.text).toMatch('OK');

    expect(mockDocSet.mock.calls.length).toEqual(3);
    expect(mockDocSet.mock.calls[0][0]).toEqual('service');
    expect(mockDocSet.mock.calls[0][1]).toEqual('conf');
    expect(mockDocSet.mock.calls[0][2].version).toEqual('1.0.0');

    expect(mockDocAdd.mock.calls.length).toEqual(1);
    expect(mockDocUpdate.mock.calls.length).toBeGreaterThan(0);
  });

  it("send text 'OK' if document 'conf' is exists.", async () => {
    axios.get.mockResolvedValue({
      data: {
        version: '1.0.0',
      },
    });

    const app = express();
    app.use(express.urlencoded({ extended: true }));
    const request = supertest(init(mockFirebase, config, app, axios));
    const response = await request.get('/setup');

    expect(response.status).toBe(200);
    expect(response.text).toEqual('OK');

    expect(mockDocAdd.mock.calls.length).toEqual(0);
    expect(mockDocSet.mock.calls.length).toEqual(0);
    expect(mockDocUpdate.mock.calls.length).toEqual(0);
  });

  it("send text 'OK' and set new ver to document 'conf' if document 'conf' is exists.", async () => {
    axios.get.mockResolvedValue({
      data: {
        version: '1.0.1',
      },
    });

    mockConfData.mockImplementationOnce(() => ({
      invitationExpirationTime: 3 * 24 * 3600 * 1000,
      seed: 'seed value',
      version: '1.0.0',
      dataVersion: 1,
    }));

    const app = express();
    app.use(express.urlencoded({ extended: true }));
    const request = supertest(init(mockFirebase, config, app, axios));
    const response = await request.get('/setup');

    expect(response.status).toBe(200);
    expect(response.text).toEqual('OK');

    expect(mockDocAdd.mock.calls.length).toEqual(0);
    expect(mockDocSet.mock.calls.length).toEqual(0);

    expect(mockDocUpdate.mock.calls.length).toEqual(1);
    expect(mockDocUpdate.mock.calls[0][0]).toEqual('service');
    expect(mockDocUpdate.mock.calls[0][1]).toEqual('conf');
    expect(mockDocUpdate.mock.calls[0][2].version).toEqual('1.0.1');
    expect(mockDocUpdate.mock.calls[0][2].updatedAt).toBeDefined();
  });
});

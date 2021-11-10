const supertest = require('supertest');
const express = require('express');
const axios = require('axios');
const { firebase, db, auth } = require('./testConfig');
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

const confRef = db.collection('service').doc('conf');
const ts = new Date('2020-01-01T00:00:00.000Z');

afterAll(async () => {
  await firebase.delete();
});

describe('get: /setup', () => {
  it("send text 'OK' and create document 'conf' if document 'conf' is not exists.", async () => {
    axios.get.mockResolvedValue({
      data: {
        version: '1.0.0',
      },
    });

    const app = express();
    app.use(express.urlencoded({ extended: true }));
    const request = supertest(init(firebase, config, app, axios));
    const response = await request.get('/setup');

    expect(response.status).toBe(200);
    expect(response.text).toMatch('OK');

    const conf = await confRef.get();
    expect(conf.exists).toBeTruthy();
    expect(conf.data().version).toEqual('1.0.0');
  });
  it("send text 'OK' if document 'conf' is exists.", async () => {
    await confRef.set({
      version: '1.0.0',
      createdAt: ts,
      updatedAt: ts,
    });

    axios.get.mockResolvedValue({
      data: {
        version: '1.0.0',
      },
    });

    const app = express();
    app.use(express.urlencoded({ extended: true }));
    const request = supertest(init(firebase, config, app, axios));
    const response = await request.get('/setup');

    expect(response.status).toBe(200);
    expect(response.text).toEqual('OK');

    const conf = await confRef.get();
    expect(conf.exists).toBeTruthy();
    expect(conf.data().version).toEqual('1.0.0');
    expect(conf.data().createdAt.toDate()).toEqual(ts);

    await confRef.delete();
  });
  it("send text 'OK' and set new ver to document 'conf' if document 'conf' is exists.", async () => {
    await confRef.set({
      version: '1.0.0',
      createdAt: ts,
      updatedAt: ts,
    });

    axios.get.mockResolvedValue({
      data: {
        version: '1.0.1',
      },
    });

    const app = express();
    app.use(express.urlencoded({ extended: true }));
    const request = supertest(init(firebase, config, app, axios));
    const response = await request.get('/setup');

    expect(response.status).toBe(200);
    expect(response.text).toEqual('OK');

    const conf = await confRef.get();
    expect(conf.exists).toBeTruthy();
    expect(conf.data().version).toEqual('1.0.1');
    expect(conf.data().createdAt.toDate()).toEqual(ts);
    expect(conf.data().updatedAt.toDate()).not.toEqual(ts);

    const testers = await db.collection('groups').doc('testers').get();
    expect(testers.get('accounts')).toHaveLength(1);
    const uid = testers.get('accounts')[0];
    await auth.deleteUser(uid);

    await confRef.delete();
  });
});

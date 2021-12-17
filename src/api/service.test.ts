import {
  onSnapshot, doc, getDoc, updateDoc,
} from 'firebase/firestore';

import {
  initializeMock, mockContext,
} from '../setupTests';
import {
  listenConf,
  setConfProperties,
} from './service';

jest.mock('firebase/firestore', () => ({
  onSnapshot: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

const handleListenError = jest.fn();

beforeEach(() => {
  onSnapshot.mockImplementation(() => jest.fn());
  initializeMock();
});

describe('listenConf(context)', () => {
  it('start listening realtime data of service.conf.', async () => {
    const docRef = { name: 'doc ref object' };
    const docSnapshot = { id: 'conf', exists: () => true, data: () => {} };
    doc.mockImplementationOnce(() => docRef);
    getDoc.mockImplementationOnce(() => Promise.resolve(true).then(() => docSnapshot));

    await listenConf(mockContext, handleListenError);

    expect(mockContext.unsubConf).toBeDefined();
    expect(doc.mock.calls.length).toEqual(1);
    expect(doc.mock.calls[0][1]).toEqual('service');
    expect(doc.mock.calls[0][2]).toEqual('conf');
    expect(getDoc.mock.calls.length).toEqual(1);
    expect(getDoc.mock.calls[0][0]).toEqual(docRef);
    expect(mockContext.setConf.mock.calls.length).toEqual(1);
    expect(mockContext.setConf.mock.calls[0][0]).toEqual({ id: 'conf' });
    expect(onSnapshot.mock.calls.length).toEqual(1);
    const cb = onSnapshot.mock.calls[0][1];

    cb({
      exists: () => true,
      id: 'id01',
      data: () => ({}),
    });

    expect(mockContext.setConf.mock.calls.length).toEqual(2);
    expect(mockContext.setConf.mock.calls[1][0]).toEqual({ id: 'id01' });

    cb({
      exists: () => false,
    });

    expect(mockContext.setConf.mock.calls.length).toEqual(3);
    expect(mockContext.setConf.mock.calls[2][0]).toEqual({ error: true });

    mockContext.unsubConf = () => 'unsub conf';
    listenConf(mockContext, handleListenError);
    expect(mockContext.setConf.mock.calls.length).toEqual(3);
  });

  it('sets error without service.conf.', async () => {
    const docRef = { name: 'doc ref object' };
    const docSnapshot = { id: 'conf', exists: () => false };
    doc.mockImplementationOnce(() => docRef);
    getDoc.mockImplementationOnce(() => Promise.resolve(true).then(() => docSnapshot));

    await listenConf(mockContext, handleListenError);

    expect(mockContext.unsubConf).toBeDefined();
    expect(doc.mock.calls.length).toEqual(1);
    expect(doc.mock.calls[0][1]).toEqual('service');
    expect(doc.mock.calls[0][2]).toEqual('conf');
    expect(getDoc.mock.calls.length).toEqual(1);
    expect(getDoc.mock.calls[0][0]).toEqual(docRef);
    expect(mockContext.setConf.mock.calls.length).toEqual(1);
    expect(mockContext.setConf.mock.calls[0][0]).toEqual({ error: true });
    expect(onSnapshot.mock.calls.length).toEqual(1);
  });
});

describe('setConfProperties(context, props)', () => {
  it('call updateDoc() with updatedAt.', async () => {
    const confRef = { id: 'conf', exists: () => false };
    doc.mockImplementationOnce(() => confRef);
    await setConfProperties(mockContext, { key1: 'value1' });

    expect(updateDoc.mock.calls.length).toEqual(1);
    expect(updateDoc.mock.calls[0][0]).toEqual(confRef);
    expect(updateDoc.mock.calls[0][1].key1).toEqual('value1');
    expect(updateDoc.mock.calls[0][1].updatedAt).toBeDefined();
  });
});

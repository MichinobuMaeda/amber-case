import {
  onSnapshot, doc, updateDoc,
} from 'firebase/firestore';

import {
  initializeMock, mockContext,
} from '../setupTests';
import {
  listenGroups,
  setGroupProperties,
} from './groups';

jest.mock('firebase/firestore', () => ({
  onSnapshot: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  where: jest.fn(),
  query: jest.fn(),
}));

const handleListenError = jest.fn();

beforeEach(() => {
  onSnapshot.mockImplementation(() => jest.fn());
  initializeMock();
});

describe('listenGroups(context, uid)', () => {
  it('starts listening realtime data of groups '
  + 'if unsub is empty.', async () => {
    listenGroups(mockContext, handleListenError);
    expect(onSnapshot.mock.calls.length).toEqual(1);

    const cb = onSnapshot.mock.calls[0][1];
    const cbError = onSnapshot.mock.calls[0][2];

    mockContext.groups = [];
    cb({
      docChanges: () => [
        {
          type: 'added',
          doc: {
            id: 'group01',
            exists: () => true,
            data: () => ({ key01: 'value01' }),
          },
        },
      ],
    });

    expect(mockContext.setGroups.mock.calls.length).toEqual(1);
    expect(mockContext.setGroups.mock.calls[0][0]).toEqual([
      {
        id: 'group01',
        key01: 'value01',
      },
    ]);

    await cbError();
    expect(handleListenError.mock.calls.length).toEqual(1);
  });

  it('not starts listening realtime data of groups '
  + 'if unsub is not empty.', async () => {
    mockContext.unsub.set('groups', () => {});
    listenGroups(mockContext, handleListenError);
    expect(onSnapshot.mock.calls.length).toEqual(0);
  });
});

describe('setGroupProperties(context, id, props)', () => {
  it('call updateDoc() with updatedAt.', async () => {
    const groupRef = { id: 'id01', name: 'doc ref of me' };
    doc.mockImplementationOnce(() => groupRef);
    await setGroupProperties(mockContext, groupRef.id, { key1: 'value1' });

    expect(updateDoc.mock.calls.length).toEqual(1);
    expect(updateDoc.mock.calls[0][0]).toEqual(groupRef);
    expect(updateDoc.mock.calls[0][1].key1).toEqual('value1');
    expect(updateDoc.mock.calls[0][1].updatedAt).toBeDefined();
  });
});

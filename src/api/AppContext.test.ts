import { User } from 'firebase/auth';

import { initialContext } from './AppContext';
import { Conf, Account, Group } from './models';

describe('initialContext', () => {
  it('is initialized with default values.', () => {
    expect(initialContext.version).toBeDefined();
    expect(initialContext.unsub).toBeDefined();
    expect(initialContext.accounts).toHaveLength(0);
    expect(initialContext.groups).toHaveLength(0);
    expect(initialContext.setThemeMode('light')).not.toBeDefined();
    expect(initialContext.setConf({} as Conf)).not.toBeDefined();
    expect(initialContext.setAuthUser({} as User)).not.toBeDefined();
    expect(initialContext.setMe({} as Account)).not.toBeDefined();
    expect(initialContext.setAccounts([] as Account[])).not.toBeDefined();
    expect(initialContext.setGroups([] as Group[])).not.toBeDefined();
    expect(initialContext.setReauthenticationTimeout(0)).not.toBeDefined();
  });
});

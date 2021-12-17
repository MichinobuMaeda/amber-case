import React from 'react';
import { User } from 'firebase/auth';
import { Unsubscribe } from 'firebase/firestore';

import { version } from '../conf';
import { Conf, Account, Group } from './models';

export interface Context {
  version: string;
  unsubConf?: Unsubscribe;
  unsub: Map<string, Unsubscribe>; // key: path, value: function
  auth?: any;
  db?: any;
  storage?: any;
  functions?: any;
  themeMode?: string;
  setThemeMode(themeMode: string): void;
  preferColorScheme?: string;
  conf?: Conf | null;
  setConf(conf: Conf): void;
  authUser?: User | null;
  setAuthUser(authUser: User): void;
  me?: Account;
  setMe(me: Account): void;
  accounts: Account[];
  setAccounts(accounts: Account[]): void;
  groups: Group[];
  setGroups(groups: Group[]): void;
  reauthenticationTimeout?: number;
  setReauthenticationTimeout(reauthenticationTimeout: number): void;
  authError?: string | null;
  listenError?: string | null;
}

export const initialContext: Context = {
  version,
  unsub: new Map<string, Unsubscribe>(),
  setThemeMode: () => {},
  setConf: () => {},
  setAuthUser: () => {},
  setMe: () => {},
  accounts: [] as Account[],
  setAccounts: () => {},
  groups: [] as Group[],
  setGroups: () => {},
  setReauthenticationTimeout: () => {},
};

export default React.createContext<Context>(initialContext);

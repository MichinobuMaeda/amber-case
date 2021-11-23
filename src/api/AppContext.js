import React from 'react';
import { version } from '../conf';

export default React.createContext({
  version,
  unsubConf: null,
  unsub: {}, // key: path, value: function
});

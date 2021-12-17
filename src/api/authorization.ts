/* eslint-disable @typescript-eslint/lines-between-class-members */
import { ReactElement } from 'react';

import { Context } from './AppContext';

export const currentPriv = (
  context: Context,
) => {
  if (!context.conf?.id || context.authUser === null) return 'loading';
  if (!context.me?.id) return 'guest';
  if (context.authUser?.email && !context.authUser?.emailVerified) return 'pending';
  if (!context.me.admin) return 'user';
  return 'admin';
};

export const hasPriv = (
  context: Context,
  require: string,
): boolean => {
  const priv = currentPriv(context);
  return require === 'any'
    || require === priv
    || (require === 'loaded' && !!context.conf?.id)
    || (require === 'user' && priv === 'admin');
};

export const currentPage = (
  location: any,
  pages: MenuItem[],
) => pages.find(
  (item) => location.pathname === `/${item.path}` || item.path === '*',
);

export class MenuItem {
  path: string = '';
  require: string = '';
  title: string = '';
  icon?: ReactElement;
  element?: ReactElement;
  top?: boolean;
}

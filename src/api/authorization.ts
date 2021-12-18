/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { ReactElement } from 'react';

import { Context } from './AppContext';

export class Priv {
  public static NOROUTE: number = 0;
  public static LOADING: number = 1;
  public static LOADED: number = 2;
  public static GUEST: number = 3;
  public static PENDING: number = 4;
  public static USER: number = 5;
  public static ADMIN: number = 6;
}

export class MenuItem {
  path: string = '';
  require: number = Priv.NOROUTE;
  title: string = '';
  icon?: ReactElement;
  element?: ReactElement;
  top?: boolean;
}

export const currentPriv = (
  context: Context,
) => {
  if (!context.conf?.id || context.authUser === null) return Priv.LOADING;
  if (!context.me?.id) return Priv.GUEST;
  if (context.authUser?.email && !context.authUser?.emailVerified) return Priv.PENDING;
  if (!context.me.admin) return Priv.USER;
  return Priv.ADMIN;
};

export const hasPriv = (
  context: Context,
  require: number,
): boolean => {
  const priv = currentPriv(context);
  return require === priv
    || (require === Priv.LOADED && !!context.conf?.id)
    || (require === Priv.USER && priv === Priv.ADMIN);
};

export const currentPage = (
  location: any,
  pages: MenuItem[],
) => pages.find(
  (item) => location.pathname === `/${item.path}` || item.path === '*',
);

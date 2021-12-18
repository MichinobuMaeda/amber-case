/* eslint-disable @typescript-eslint/lines-between-class-members */
export class ThemeMode {
  public static NOTSET: string = 'notset';
  public static LIGHT: string = 'light';
  public static DARK: string = 'dark';
  public static SYSTEM: string = 'system';
}

export const themeModeList = [
  ThemeMode.NOTSET,
  ThemeMode.LIGHT,
  ThemeMode.DARK,
  ThemeMode.SYSTEM,
];

export const defaultThemeMode = themeModeList.indexOf(ThemeMode.LIGHT);

export interface CastedDoc {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface Conf extends CastedDoc {
  version: string;
  url: string;
  seed: string;
  invitationExpirationTime: number;
  copyright?: string;
  policy?: string;
  error? : boolean;
}

export interface Account extends CastedDoc {
  valid: boolean;
  name?: string;
  admin?: boolean;
  tester?: boolean;
  group?: string;
  themeMode?: number;
  invitation?: string,
  invitedBy?: string,
  invitedAt?: Date,
}

export interface Group extends CastedDoc {
  name?: string;
  desc?: string;
  accounts: string[];
}

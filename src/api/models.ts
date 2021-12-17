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
  themeMode?: string;
  invitation?: string,
  invitedBy?: string,
  invitedAt?: Date,
}

export interface Group extends CastedDoc {
  name?: string;
  desc?: string;
  accounts: string[];
}

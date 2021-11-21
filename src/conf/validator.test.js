import {
  validateReuired,
  validateEmail,
  validatePassword,
} from './validator';

describe('validateReuired(v)', () => {
  it('return true if the value has length > 0 as trimed string.', async () => {
    expect(validateReuired('1')).toBeTruthy();
    expect(validateReuired(' a ')).toBeTruthy();

    expect(validateReuired()).toBeFalsy();
    expect(validateReuired(null)).toBeFalsy();
    expect(validateReuired(false)).toBeFalsy();
    expect(validateReuired(0)).toBeFalsy();
    expect(validateReuired(1)).toBeFalsy();
    expect(validateReuired([])).toBeFalsy();
    expect(validateReuired({})).toBeFalsy();
    expect(validateReuired('')).toBeFalsy();
    expect(validateReuired(' ')).toBeFalsy();
  });
});

describe('validateEmail(v)', () => {
  it('return true if the value is empty or valid email address.', async () => {
    expect(validateEmail()).toBeTruthy();
    expect(validateEmail(null)).toBeTruthy();
    expect(validateEmail(false)).toBeTruthy();
    expect(validateEmail('')).toBeTruthy();
    expect(validateEmail('abc@def.gh')).toBeTruthy();
    expect(validateEmail('a.bc@def.gh')).toBeTruthy();
    expect(validateEmail('a-bc@def.gh')).toBeTruthy();
    expect(validateEmail('a_bc@def.gh')).toBeTruthy();

    expect(validateEmail(0)).toBeFalsy();
    expect(validateEmail(1)).toBeFalsy();
    expect(validateEmail([])).toBeFalsy();
    expect(validateEmail({})).toBeFalsy();
    expect(validateEmail(' ')).toBeFalsy();
    expect(validateEmail('1')).toBeFalsy();
    expect(validateEmail('abc@')).toBeFalsy();
    expect(validateEmail('abc@def')).toBeFalsy();
    expect(validateEmail('@def')).toBeFalsy();
    expect(validateEmail('a bc@def.gh')).toBeFalsy();
    expect(validateEmail('abc@d ef.gh')).toBeFalsy();
    expect(validateEmail('abc@def.g h')).toBeFalsy();
  });
});

describe('validatePassword(v)', () => {
  it('return true if the value is valid password.', async () => {
    expect(validatePassword()).toBeTruthy();
    expect(validatePassword(null)).toBeTruthy();
    expect(validatePassword(false)).toBeTruthy();
    expect(validatePassword('')).toBeTruthy();
    expect(validatePassword('12abCD@$')).toBeTruthy();
    expect(validatePassword('12abCDEF')).toBeTruthy();
    expect(validatePassword('12abcd@$')).toBeTruthy();
    expect(validatePassword('xyabCD@$')).toBeTruthy();

    expect(validatePassword(0)).toBeFalsy();
    expect(validatePassword(1)).toBeFalsy();
    expect(validatePassword([])).toBeFalsy();
    expect(validatePassword({})).toBeFalsy();
    expect(validatePassword(' ')).toBeFalsy();
    expect(validatePassword('1')).toBeFalsy();
    expect(validatePassword('12abCD@')).toBeFalsy();
    expect(validatePassword('12345678')).toBeFalsy();
    expect(validatePassword('abcdefgh')).toBeFalsy();
    expect(validatePassword('ABCDEFGH')).toBeFalsy();
    expect(validatePassword('1234efgh')).toBeFalsy();
    expect(validatePassword('ABCDefgh')).toBeFalsy();
    expect(validatePassword('ABCD5678')).toBeFalsy();
  });
});

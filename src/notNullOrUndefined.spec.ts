import { notNullOrUndefined } from './notNullOrUndefined';

const validNumberValue = 3.1415;
const validStringValue = 'hello';
const emptyStringValue = '';
const nullValue = null;
const undefinedValue = undefined;

describe('When setting a value', () => {
  it('valid number should return true', () => {
    expect(notNullOrUndefined(validNumberValue)).toBe(true);
  });

  it('valid string should return true', () => {
    expect(notNullOrUndefined(validStringValue)).toBe(true);
  });

  it('null value should return false', () => {
    expect(notNullOrUndefined(nullValue)).toBe(false);
  });

  it('undefined value should return false', () => {
    expect(notNullOrUndefined(undefinedValue)).toBe(false);
  });

  it('empty string value should return true', () => {
    expect(notNullOrUndefined(emptyStringValue)).toBe(true);
  });
});

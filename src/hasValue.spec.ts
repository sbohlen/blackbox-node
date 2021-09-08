import { hasValue, hasValueAndIsNotEmptyString } from './hasValue';

const validNumberValue = 3.1415;
const validStringValue = 'hello';
const emptyStringValue = '';
const nullValue = null;
const undefinedValue = undefined;

describe('When setting a value', () => {
  it('valid number should return true', () => {
    expect(hasValue(validNumberValue)).toBe(true);
  });

  it('valid string should return true', () => {
    expect(hasValue(validStringValue)).toBe(true);
  });

  it('null value should return false', () => {
    expect(hasValue(nullValue)).toBe(false);
  });

  it('undefined value should return false', () => {
    expect(hasValue(undefinedValue)).toBe(false);
  });

  it('empty string value should return true', () => {
    expect(hasValue(emptyStringValue)).toBe(true);
  });

  it('empty string value should return false when disallowed', () => {
    expect(hasValue(emptyStringValue, true)).toBe(false);
  });
});

describe('When using helper method to test empty string', () => {
  it('should return false when provided empty string', () => {
    expect(hasValueAndIsNotEmptyString(emptyStringValue)).toBe(false);
  });

  it('should return true when provided non-empty string', () => {
    expect(hasValueAndIsNotEmptyString(validStringValue)).toBe(true);
  });
});

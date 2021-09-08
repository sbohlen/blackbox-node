import { Coordinate } from './Coordinate';

describe('When creating a coordinate with an integer value', () => {
  const testValue = 5;
  const testCoordinate = new Coordinate(testValue);

  it('should set expected value', () => {
    expect(testCoordinate.Value).toEqual(testValue);
  });
});

describe('When creating a coordinate with a decimal value', () => {
  const testValue = 5.1;
  it('should protect against non-integral value', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Coordinate(testValue);
    }).toThrow();
  });
});

describe('When creating a new coordinate', () => {
  const undefinedValue = undefined;
  const nullValue = null;

  it('should protect against an undefined value', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Coordinate(undefinedValue);
    }).toThrow();
  });

  it('should protect against a null value', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Coordinate(nullValue);
    }).toThrow();
  });
});

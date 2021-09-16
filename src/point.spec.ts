import { Point } from './point';

describe('When creating a point', () => {
  const x = 2;
  const y = 4;

  const point = new Point(x, y);

  it('should set expected values', () => {
    expect(point.X).toEqual(x);
    expect(point.Y).toEqual(y);
  });
});

describe('When comparing two instances', () => {
  const testValue = 4;
  const testPoint = new Point(testValue, testValue);
  const samePoint = new Point(testValue, testValue);
  const differentPoint = new Point(testValue + 1, testValue + 1);

  it('should consider same values as equal point', () => {
    expect(testPoint.equals(samePoint)).toBe(true);
  });

  it('should consider different values as unequal points', () => {
    expect(testPoint.equals(differentPoint)).toBe(false);
  });
});

import { Point } from './point';
import { rotatePoint } from './rotatePoint';

describe('When rotating a point clockwise', () => {
  const actual = rotatePoint(new Point(10, 0), 90);

  const expected = new Point(0, -10);

  it('can return expected point', () => {
    expect(actual).toEqual(expected);
  });
});

describe('When rotating a point counter-clockwise', () => {
  const actual = rotatePoint(new Point(10, 0), -90);

  const expected = new Point(0, 10);

  it('can return expected point', () => {
    expect(actual).toEqual(expected);
  });
});

describe('When rotating a point 360-degrees', () => {
  const actual = rotatePoint(new Point(10, 0), 360);

  const expected = new Point(10, 0);

  it('can return expected point', () => {
    expect(actual).toEqual(expected);
  });
});

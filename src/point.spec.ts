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

import { rotate } from './rotateCoordinate';

describe('When rotating a point', () => {
  const actual = rotate(10, 0, 90);

  it('can return expected point', () => {
    expect(Math.round(actual.x)).toEqual(0);
    expect(Math.round(actual.y)).toEqual(-10);
  });
});

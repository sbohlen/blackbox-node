import { buildGridAnnotations } from './buildGridAnnotations';

describe('When building the annotations', () => {
  const dimensionX = 5;
  const dimensionY = 10;

  const annotations = buildGridAnnotations(dimensionX, dimensionY);

  it('should build expected count of annotations', () => {
    const expectedAnnotationsCount = dimensionX * 2 + dimensionY * 2;
    expect([...annotations].length).toEqual(expectedAnnotationsCount);
  });

  it('should use correct range of coordinates', () => {
    const values = [...annotations.values()];

    const xCoords = [...values.map((v) => v.point.X)];
    const yCoords = [...values.map((v) => v.point.Y)];

    const minXCoordinate = Math.min.apply(null, xCoords);
    const maxXCoordinate = Math.max.apply(null, xCoords);
    const minYCoordinate = Math.min.apply(null, yCoords);
    const maxYCoordinate = Math.max.apply(null, yCoords);

    expect(minXCoordinate).toEqual(0);
    expect(maxXCoordinate).toEqual(dimensionX + 1);
    expect(minYCoordinate).toEqual(0);
    expect(maxYCoordinate).toEqual(dimensionY + 1);
  });
});

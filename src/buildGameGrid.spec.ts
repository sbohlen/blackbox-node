import { buildGameGrid } from './buildGameGrid';

describe('When building GameGrid', () => {
  const dimensionX = 5;
  const dimensionY = 10;
  const atomCount = 3;

  const grid = buildGameGrid(dimensionX, dimensionY, atomCount);

  it('should create expected count of cells', () => {
    expect([...grid.values()].length).toEqual(dimensionX * dimensionY);
  });

  it('should create expected count of atoms', () => {
    const actualAtomCount = [...grid.values()].filter(
      (cell) => cell.hasAtom,
    ).length;

    expect(actualAtomCount).toEqual(atomCount);
  });

  it('should report expected min/max X,Y bounds', () => {
    expect(grid.minX).toEqual(1);
    expect(grid.maxX).toEqual(dimensionX);
    expect(grid.minY).toEqual(1);
    expect(grid.maxY).toEqual(dimensionY);
  });
});

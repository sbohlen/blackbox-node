import { buildGrid } from './buildGrid';

describe('When building grid', () => {
  const dimensionX = 5;
  const dimensionY = 10;
  const atomCount = 3;

  const grid = buildGrid(dimensionX, dimensionY, atomCount);

  it('should create expected count of cells', () => {
    expect([...grid.values()].length).toEqual(dimensionX * dimensionY);
  });

  it('should create expected count of atoms', () => {
    const actualAtomCount = [...grid.values()].filter(
      (cell) => cell.hasAtom,
    ).length;

    expect(actualAtomCount).toEqual(atomCount);
  });
});

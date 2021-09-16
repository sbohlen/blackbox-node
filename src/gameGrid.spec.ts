import { buildGameGrid } from './buildGameGrid';

describe('When a grid is rotated', () => {
  const dimensionX = 10;
  const dimensionY = 10;

  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);

  it.each`
    initialOrientation
    ${0}
    ${90}
    ${180}
    ${270}
  `(
    'should return $initialOrientation -degrees to 0 -degrees orientation when reset',
    ({ initialOrientation }) => {
      // apply the parameterized rotation to the grid
      gameGrid.rotate(initialOrientation);

      // reset the orientation
      gameGrid.resetRotation();

      // if successful, all coords will be in the pos. X, Y range
      expect(gameGrid.minX).toBeGreaterThan(0);
      expect(gameGrid.minY).toBeGreaterThan(0);
    },
  );
});

import { Cell } from './Cell';
import { GameGrid } from './GameGrid';
import { Point } from './point';

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function buildGrid(dimensionX, dimensionY, atomCount): GameGrid {
  const grid = new GameGrid();

  // build and add all the cells in the map
  for (let xIndex = 0; xIndex < dimensionX; xIndex += 1) {
    for (let yIndex = 0; yIndex < dimensionY; yIndex += 1) {
      const point = new Point(xIndex, yIndex);
      grid.set(point.toIdString(), new Cell(point, false));
    }
  }

  let atomsPlaced = 0;

  // while there are still more atoms to place...
  while (atomsPlaced < atomCount) {
    // ...select random coordinates
    const randomX = randomIntFromInterval(0, dimensionX - 1);
    const randomY = randomIntFromInterval(0, dimensionY - 1);

    // generate a point from those random coords
    const randomPoint = new Point(randomX, randomY);

    // if the randomly-selected cell does not (already!) have an atom...
    if (!grid.get(randomPoint.toIdString()).hasAtom) {
      // ...set it to contain one
      grid.get(randomPoint.toIdString()).hasAtom = true;
      // increment the counter to move us closer to done
      atomsPlaced += 1;
    }
  }

  return grid;
}

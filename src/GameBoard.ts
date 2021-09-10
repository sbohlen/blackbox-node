import { Cell } from './Cell';
import { hasValue } from './hasValue';
import { Point } from './point';

export class GameBoard {
  #grid: Map<string, Cell>;

  constructor(dimensionX: number, dimensionY: number, atomCount: number) {
    const validationErrors = GameBoard.#validateArgs(
      dimensionX,
      dimensionY,
      atomCount,
    );

    if (hasValue(validationErrors) && validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    this.#populateBoard(dimensionX, dimensionY, atomCount);
  }

  static #randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  #populateBoard(dimensionX, dimensionY, atomCount) {
    this.#grid = new Map<string, Cell>();

    // build and add all the cells in the map
    for (let xIndex = 0; xIndex < dimensionX; xIndex += 1) {
      for (let yIndex = 0; yIndex < dimensionY; yIndex += 1) {
        const point = new Point(xIndex, yIndex);
        this.#grid.set(point.toIdString(), new Cell(point, false));
      }
    }

    let atomsPlaced = 0;

    // while there are still more atoms to place...
    while (atomsPlaced < atomCount) {
      // ...select random coordinates
      const randomX = GameBoard.#randomIntFromInterval(0, dimensionX - 1);
      const randomY = GameBoard.#randomIntFromInterval(0, dimensionY - 1);

      // generate a point from those random coords
      const randomPoint = new Point(randomX, randomY);

      // if the randomly-selected cell does not (already!) have an atom...
      if (!this.#grid.get(randomPoint.toIdString()).hasAtom) {
        // ...set it to contain one
        this.#grid.get(randomPoint.toIdString()).hasAtom = true;
        // increment the counter to move us closer to done
        atomsPlaced += 1;
      }
    }
  }

  static #validateArgs(
    dimensionX: number,
    dimensionY: number,
    atomCount: number,
  ): Array<Error> {
    const errors = new Array<Error>();

    if (!Number.isInteger(dimensionX)) {
      errors.push(
        new Error(`dimensionX must be an integer but was ${dimensionX}`),
      );
    }

    if (!Number.isInteger(dimensionY)) {
      errors.push(
        new Error(`dimensionY must be an integer but was ${dimensionY}`),
      );
    }

    if (!Number.isInteger(atomCount)) {
      errors.push(
        new Error(`dimensionX must be an integer but was ${dimensionX}`),
      );
    }

    if (!(dimensionX > 0)) {
      errors.push(
        new Error(`dimensionX must be greater than zero but was ${dimensionX}`),
      );
    }

    if (!(dimensionY > 0)) {
      errors.push(
        new Error(`dimensionY must be greater than zero but was ${dimensionY}`),
      );
    }

    if (!(atomCount > 0)) {
      errors.push(
        new Error(`atomCount must be greater than zero but was ${atomCount}`),
      );
    }

    if (atomCount > dimensionX * dimensionY) {
      errors.push(
        new Error(
          `atomCount cannot exceed count of cells (${
            dimensionX * dimensionY
          }) but was ${atomCount}`,
        ),
      );
    }

    return errors;
  }
}

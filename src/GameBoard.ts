import { buildGameGrid } from './buildGameGrid';
import { buildGridAnnotations } from './buildGridAnnotations';
import { GameGrid } from './GameGrid';
import { GridAnnotations } from './GridAnnotations';
import { notNullOrUndefined } from './notNullOrUndefined';

export class GameBoard {
  #gameGrid: GameGrid;

  #gridAnnotations: GridAnnotations;

  get GameGrid() {
    return this.#gameGrid;
  }

  get GridAnnotations() {
    return this.#gridAnnotations;
  }

  constructor(dimensionX: number, dimensionY: number, atomCount: number) {
    const validationErrors = GameBoard.#validateArgs(
      dimensionX,
      dimensionY,
      atomCount,
    );

    if (notNullOrUndefined(validationErrors) && validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    this.#gameGrid = buildGameGrid(dimensionX, dimensionY, atomCount);
    this.#gridAnnotations = buildGridAnnotations(dimensionX, dimensionY);
  }

  static #validateArgs(
    dimensionX: number,
    dimensionY: number,
    atomCount: number,
  ): Array<Error> {
    const errors = new Array<Error>();

    if (!notNullOrUndefined(dimensionX)) {
      errors.push(new Error('dimensionX cannot be null or undefined'));
    }

    if (!notNullOrUndefined(dimensionY)) {
      errors.push(new Error('dimensionY cannot be null or undefined'));
    }

    if (!notNullOrUndefined(atomCount)) {
      errors.push(new Error('atomCount cannot be null or undefined'));
    }

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

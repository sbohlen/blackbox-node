import { buildGameGrid } from './buildGameGrid';
import { buildGridAnnotations } from './buildGridAnnotations';
import { GameGrid } from './GameGrid';
import { GameStatistics } from './GameStatistics';
import { GridAnnotations } from './GridAnnotations';
import { notNullOrUndefined } from './notNullOrUndefined';
import { Point } from './point';
import { Direction, traceRay } from './rayTracer';
import {
  addGuess,
  correctGuessCount,
  incorrectGuessCount,
  removeGuess,
  revealAll,
  updateAnnotation,
} from './updateGameBoard';

export enum BoardEdge {
  Top = 'Top',
  Bottom = 'Bottom',
  Left = 'Left',
  Right = 'Right',
}

export class GameBoard {
  #gameGrid: GameGrid;

  #gridAnnotations: GridAnnotations;

  #rayCounter: number;

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

  sendRay(entryEdge: BoardEdge, cellIndex: number) {
    let entryPoint: Point;
    let entryDirection: Direction;

    // translate user-entry to expected params for tracing of the ray
    switch (entryEdge) {
      case BoardEdge.Bottom:
        entryPoint = new Point(cellIndex, this.GameGrid.minY);
        entryDirection = Direction.Up;
        break;
      case BoardEdge.Top:
        entryPoint = new Point(cellIndex, this.GameGrid.maxY);
        entryDirection = Direction.Down;
        break;
      case BoardEdge.Left:
        entryPoint = new Point(this.GameGrid.minX, cellIndex);
        entryDirection = Direction.Right;
        break;
      case BoardEdge.Right:
        entryPoint = new Point(this.GameGrid.maxX, cellIndex);
        entryDirection = Direction.Left;
        break;
      default:
        throw new Error(`Invalid entryEdge: '${entryEdge}' provided!`); // should NEVER get here
    }

    // actually do the trace
    const traceResult = traceRay(entryPoint, this.GameGrid, entryDirection);

    // TODO: update the annotation(s) accordingly
    updateAnnotation(traceResult, this.GridAnnotations);
    // increment the counter for later scoring
    this.#rayCounter += 1;
  }

  addGuess(x: number, y: number) {
    addGuess(new Point(x, y), this.GameGrid);
  }

  removeGuess(x: number, y: number) {
    removeGuess(new Point(x, y), this.GameGrid);
  }

  revealAll() {
    revealAll(this.GameGrid);
  }

  getGameStatistics(): GameStatistics {
    const stats = new GameStatistics();

    stats.raysShot = this.#rayCounter;
    stats.correctGuesses = correctGuessCount(this.GameGrid);
    stats.incorrectGuesses = incorrectGuessCount(this.GameGrid);

    return stats;
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

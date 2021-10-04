import { BoardEdge } from './BoardEdge';
import { buildGameGrid } from './buildGameGrid';
import { buildGridAnnotations } from './buildGridAnnotations';
import { Cell } from './Cell';
import { Direction } from './Direction';
import { GameGrid } from './GameGrid';
import { GameStatistics } from './GameStatistics';
import { getNextLetter } from './getNextCharacter';
import { GridAnnotations } from './GridAnnotations';
import { notNullOrUndefined } from './notNullOrUndefined';
import { Point } from './point';
import { traceRay } from './rayTracer';
import {
  addGuess,
  applyTraceResultToBoard,
  correctGuessCount,
  enableDebugDisplay,
  incorrectGuessCount,
  removeGuess,
  revealAll,
  updateAnnotation,
} from './updateGameBoard';

export class GameBoard {
  private gameGrid: GameGrid;

  private gridAnnotations: GridAnnotations;

  private rayCounter: number = 0;

  private lastUsedAnnotationValue: string;

  private atomCount: number = 0;

  get GameGrid() {
    return this.gameGrid;
  }

  get GridAnnotations() {
    return this.gridAnnotations;
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

    this.gameGrid = buildGameGrid(dimensionX, dimensionY, atomCount);
    this.gridAnnotations = buildGridAnnotations(dimensionX, dimensionY);

    this.atomCount = atomCount;
  }

  getNextAnnotationValue(): string {
    // if we already have a valid prior value...
    if (notNullOrUndefined(this.lastUsedAnnotationValue)) {
      // ...increment the field to the next letter
      this.lastUsedAnnotationValue = getNextLetter(
        this.lastUsedAnnotationValue,
      );
    } else {
      // ...set the initial letter
      this.lastUsedAnnotationValue = 'A';
    }

    // ... as a last step, return the actual value
    return this.lastUsedAnnotationValue;
  }

  getGuesses(): Array<Cell> {
    return Array.from(this.gameGrid.values()).filter(
      (cell) => cell.isGuess === true,
    );
  }

  private determineEntryPointAndDirection(
    entryEdge: BoardEdge,
    cellIndex: number,
  ): [Point, Direction] {
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

    return [entryPoint, entryDirection];
  }

  sendRay(entryEdge: BoardEdge, cellIndex: number) {
    const [entryPoint, entryDirection] = this.determineEntryPointAndDirection(
      entryEdge,
      cellIndex,
    );

    // actually do the trace
    const traceResult = traceRay(entryPoint, this.GameGrid, entryDirection);

    // update the annotation(s) accordingly
    applyTraceResultToBoard(
      entryPoint,
      traceResult,
      entryEdge,
      this.GameGrid,
      this.GridAnnotations,
      () => this.getNextAnnotationValue(),
    );

    // increment the counter for later scoring
    this.rayCounter += 1;
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

  enableDebugDisplay() {
    enableDebugDisplay(this.GameGrid);
  }

  // eslint-disable-next-line class-methods-use-this
  updateAnnotation(point: Point, annotations: GridAnnotations, value: string) {
    updateAnnotation(point, annotations, value);
  }

  getGameStatistics(): GameStatistics {
    const stats = new GameStatistics();

    stats.atomCount = this.atomCount;
    stats.rayCount = this.rayCounter;
    stats.correctGuessCount = correctGuessCount(this.GameGrid);
    stats.incorrectGuessCount = incorrectGuessCount(this.GameGrid);

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

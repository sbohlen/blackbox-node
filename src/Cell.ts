import { CellDisplayString } from './CellDisplayString';
import { Point } from './point';

export class Cell {
  hasAtom: boolean = false;

  isGuess: boolean = false;

  isRevealMode: boolean = false;

  constructor(public point: Point) {}

  toDisplayString(): string {
    if (this.isRevealMode) {
      return this.hasAtom && this.isGuess
        ? CellDisplayString.correctGuess
        : CellDisplayString.incorrectGuess;
    }

    return this.isGuess ? CellDisplayString.guess : CellDisplayString.empty;
  }
}

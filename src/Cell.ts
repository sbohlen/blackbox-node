import { CellDisplayString } from './CellDisplayString';
import { GridElement } from './GridElement';
import { Point } from './point';

export class Cell extends GridElement {
  hasAtom: boolean = false;

  isGuess: boolean = false;

  isRevealMode: boolean = false;

  constructor(public point: Point) {
    super(point);
  }

  toDisplayString(): string {
    if (this.isRevealMode) {
      if (this.isGuess) {
        return this.hasAtom
          ? CellDisplayString.correctGuess
          : CellDisplayString.incorrectGuess;
      }

      return this.hasAtom
        ? CellDisplayString.missedTarget
        : CellDisplayString.empty;
    }

    return this.isGuess ? CellDisplayString.guess : CellDisplayString.empty;
  }
}

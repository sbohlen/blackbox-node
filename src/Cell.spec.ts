import { Cell } from './Cell';
import { CellDisplayString } from './CellDisplayString';
import { Point } from './point';

describe('When in Reveal Mode and contains a guess', () => {
  const cell = new Cell(new Point(0, 0));
  cell.isRevealMode = true;

  it('display string should show INCORRECT guess if no HIT', () => {
    cell.isGuess = true;
    cell.hasAtom = false;

    expect(cell.toDisplayString()).toEqual(CellDisplayString.incorrectGuess);
  });
  it('display string should show CORRECT guess if a HIT', () => {
    cell.isGuess = true;
    cell.hasAtom = true;

    expect(cell.toDisplayString()).toEqual(CellDisplayString.correctGuess);
  });
});

describe('When NOT in Reveal Mode and contains a guess', () => {
  const cell = new Cell(new Point(0, 0));
  cell.isRevealMode = false;

  it('display string should show guess if no HIT', () => {
    cell.isGuess = true;
    cell.hasAtom = false;

    expect(cell.toDisplayString()).toEqual(CellDisplayString.guess);
  });
  it('display string should show guess if a HIT', () => {
    cell.isGuess = true;
    cell.hasAtom = true;

    expect(cell.toDisplayString()).toEqual(CellDisplayString.guess);
  });
});

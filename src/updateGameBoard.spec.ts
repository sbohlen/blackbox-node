import { CellDisplayString } from './CellDisplayString';
import { GameBoard } from './GameBoard';
import { Point } from './point';

const dimensionX = 10;
const dimensionY = 10;
const atomCount = 1;

const guessCellX = 3;
const guessCellY = 5;

describe('When adding a guess', () => {
  const board = new GameBoard(dimensionX, dimensionY, atomCount);

  board.addGuess(guessCellX, guessCellY);

  it('should add the guess to expected cell', () => {
    const actualCell = board.GameGrid.get(
      new Point(guessCellX, guessCellY).toIdString(),
    );

    expect(actualCell.isGuess).toBe(true);
  });
});

describe('When removing a guess', () => {
  const board = new GameBoard(dimensionX, dimensionY, atomCount);

  board.addGuess(guessCellX, guessCellY);

  const actualCell = board.GameGrid.get(
    new Point(guessCellX, guessCellY).toIdString(),
  );

  // fail the whole test suite if the expected precondition is NOT true
  expect(actualCell.isGuess).toBe(true);

  it('should remove the guess from the cell', () => {
    // perform the removal
    board.removeGuess(guessCellX, guessCellY);

    // validate that the result is expected
    expect(actualCell.isGuess).toBe(false);
  });
});

describe('When revealing the board', () => {
  it('should display incorrect guesses', () => {
    const board = new GameBoard(dimensionX, dimensionY, atomCount);

    // add the guess
    board.addGuess(guessCellX, guessCellY);

    // set the only atom to be a different cell than the guess
    board.GameGrid.get(
      new Point(guessCellX + 1, guessCellY).toIdString(),
    ).hasAtom = true;

    // do the reveal
    board.revealAll();

    // get the test cell
    const actualCell = board.GameGrid.get(
      new Point(guessCellX, guessCellY).toIdString(),
    );

    // validate that the result is expected
    expect(actualCell.toDisplayString()).toEqual(
      CellDisplayString.incorrectGuess,
    );
  });

  // TODO: refactor this so its not a 100% dupe the negative test case
  it('should display correct guesses', () => {
    const board = new GameBoard(dimensionX, dimensionY, atomCount);

    // add the guess
    board.addGuess(guessCellX, guessCellY);

    // set the only atom to be a different cell than the guess
    board.GameGrid.get(new Point(guessCellX, guessCellY).toIdString()).hasAtom =
      true;

    // do the reveal
    board.revealAll();

    // get the test cell
    const actualCell = board.GameGrid.get(
      new Point(guessCellX, guessCellY).toIdString(),
    );

    // validate that the result is expected
    expect(actualCell.toDisplayString()).toEqual(
      CellDisplayString.correctGuess,
    );
  });
});

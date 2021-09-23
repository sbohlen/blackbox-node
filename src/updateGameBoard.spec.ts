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
  it.each`
    guessX | guessY | atomX | atomY | guessResult
    ${3}   | ${5}   | ${3}  | ${5}  | ${CellDisplayString.correctGuess}
    ${3}   | ${5}   | ${5}  | ${5}  | ${CellDisplayString.incorrectGuess}
  `(
    'should display expected guess results',
    ({ guessX, guessY, atomX, atomY, guessResult }) => {
      const board = new GameBoard(dimensionX, dimensionY, atomCount);

      // add the guess
      board.addGuess(guessX, guessY);

      // ensure the desired cell has the necessary atom
      board.GameGrid.get(new Point(atomX, atomY).toIdString()).hasAtom = true;

      // do the reveal
      board.revealAll();

      // get the test cell
      const actualCell = board.GameGrid.get(
        new Point(guessX, guessY).toIdString(),
      );

      // validate that the result is expected
      expect(actualCell.toDisplayString()).toEqual(guessResult);
    },
  );
});

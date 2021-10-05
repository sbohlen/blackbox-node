import { GameBoard } from './GameBoard';

describe('When creating GameBoard', () => {
  const validDimension = 10;
  const invalidDimension = 10.3;
  const validAtomCount = 4;
  const invalidAtomCount = 4.56;
  const nullValue = null;
  const undefinedValue = undefined;

  it('should accept integer dimensions', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new GameBoard(validDimension, validDimension, validAtomCount);
    }).not.toThrow();
  });

  it('should reject non-integer dimensions', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new GameBoard(invalidDimension, invalidDimension, invalidAtomCount);
    }).toThrow();
  });

  it('should reject count of atoms that exceeds count of cells', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new GameBoard(validDimension, validDimension, validDimension ** 2 + 1);
    }).toThrow();
  });

  it('should reject null values', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new GameBoard(nullValue, validDimension, validAtomCount);
    }).toThrow();

    expect(() => {
      // eslint-disable-next-line no-new
      new GameBoard(validDimension, nullValue, validAtomCount);
    }).toThrow();

    expect(() => {
      // eslint-disable-next-line no-new
      new GameBoard(validDimension, validDimension, nullValue);
    }).toThrow();
  });

  it('should reject undefined values', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new GameBoard(undefinedValue, validDimension, validAtomCount);
    }).toThrow();

    expect(() => {
      // eslint-disable-next-line no-new
      new GameBoard(validDimension, undefinedValue, validAtomCount);
    }).toThrow();

    expect(() => {
      // eslint-disable-next-line no-new
      new GameBoard(validDimension, validDimension, undefinedValue);
    }).toThrow();
  });
});

describe('When retrieving Guesses', () => {
  const gameBoard = new GameBoard(10, 10, 1);

  for (let i = 1; i <= 5; i += 1) {
    gameBoard.addGuess(i, i);
  }

  it('should retrieve expected guesses', () => {
    expect(gameBoard.getGuesses().length).toEqual(5);
  });
});

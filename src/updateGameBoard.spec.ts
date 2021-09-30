/* eslint-disable max-len */
import { BoardEdge } from './BoardEdge';
import { CellDisplayString } from './CellDisplayString';
import { GameBoard } from './GameBoard';
import { Point } from './point';
import { TraceResult } from './rayTracer';
import { applyTraceResultToBoard } from './updateGameBoard';
import { utilityClearAllAtomsFromBoard } from './utilityClearAllAtomsFromBoard';

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

      // remove all existing atoms from the board
      utilityClearAllAtomsFromBoard(board);

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

describe.each`
  testCaseName                       | entryPoint          | entryEdge           | finalPoint          | exitEdge            | annotationCell1 | annotationCell2
  ${'entry from RIGHT not at edge'}  | ${new Point(10, 2)} | ${BoardEdge.Right}  | ${new Point(1, 2)}  | ${BoardEdge.Left}   | ${'11,2'}       | ${'0,2'}
  ${'entry from RIGHT at edge'}      | ${new Point(10, 1)} | ${BoardEdge.Right}  | ${new Point(1, 1)}  | ${BoardEdge.Left}   | ${'11,1'}       | ${'0,1'}
  ${'entry from LEFT not at edge'}   | ${new Point(1, 2)}  | ${BoardEdge.Left}   | ${new Point(10, 2)} | ${BoardEdge.Right}  | ${'11,2'}       | ${'0,2'}
  ${'entry from LEFT at edge'}       | ${new Point(1, 1)}  | ${BoardEdge.Left}   | ${new Point(10, 1)} | ${BoardEdge.Right}  | ${'11,1'}       | ${'0,1'}
  ${'entry from BOTTOM not at edge'} | ${new Point(2, 1)}  | ${BoardEdge.Bottom} | ${new Point(2, 10)} | ${BoardEdge.Top}    | ${'2,0'}        | ${'2,11'}
  ${'entry from BOTTOM at edge'}     | ${new Point(1, 1)}  | ${BoardEdge.Bottom} | ${new Point(1, 10)} | ${BoardEdge.Top}    | ${'1,0'}        | ${'1,11'}
  ${'entry from TOP not at edge'}    | ${new Point(2, 10)} | ${BoardEdge.Top}    | ${new Point(2, 1)}  | ${BoardEdge.Bottom} | ${'2,0'}        | ${'2,11'}
  ${'entry from TOP at edge'}        | ${new Point(1, 10)} | ${BoardEdge.Top}    | ${new Point(1, 1)}  | ${BoardEdge.Bottom} | ${'1,0'}        | ${'1,11'}
`(
  'When updating annotations',
  ({
    testCaseName,
    entryPoint,
    entryEdge,
    finalPoint,
    exitEdge,
    annotationCell1,
    annotationCell2,
  }) => {
    it(`${testCaseName} > should assign expected annotations`, () => {
      const board = new GameBoard(10, 10, 1);
      utilityClearAllAtomsFromBoard(board);

      const traceResult = new TraceResult();

      traceResult.finalPoint = finalPoint;
      traceResult.exitEdge = exitEdge;

      applyTraceResultToBoard(
        entryPoint,
        traceResult,
        entryEdge,
        board.GameGrid,
        board.GridAnnotations,
        () => board.getNextAnnotationValue(),
      );

      expect(
        board.GridAnnotations.get(annotationCell1).toDisplayString(),
      ).toEqual('A');
      expect(
        board.GridAnnotations.get(annotationCell2).toDisplayString(),
      ).toEqual('A');
    });
  },
);

import { BoardEdge } from './BoardEdge';
import { GameBoard } from './GameBoard';
import { render } from './renderGameBoard';
import { utilityClearAllAtomsFromBoard } from './utilityClearAllAtomsFromBoard';

describe('When firing all rays on an empty game board', () => {
  it('should update all expected annotation values', () => {
    const dimensionX = 10;
    const dimensionY = 10;
    const atomCount = 1;

    // make board
    const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

    utilityClearAllAtomsFromBoard(gameBoard);

    // iterate each annotation slot (traverse the X axis)
    for (let x = 1; x <= dimensionX; x += 1) {
      gameBoard.sendRay(BoardEdge.Bottom, x);

      // if the annotation isn't already occupied, run a trace from it
      if (gameBoard.GridAnnotations.get(`${x},11`).toDisplayString() === '') {
        gameBoard.sendRay(BoardEdge.Top, x);
      }
    }

    // iterate each annotation slot (traverse the Y axis)
    for (let y = 1; y <= dimensionY; y += 1) {
      gameBoard.sendRay(BoardEdge.Left, y);
      // if the annotation isn't already occupied, run a trace from it
      if (gameBoard.GridAnnotations.get(`11,${y}`).toDisplayString() === '') {
        gameBoard.sendRay(BoardEdge.Right, y);
      }
    }

    const expectedHorizontalAnnotationSequence = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
    ];

    const expectedVerticalAnnotationSequence = [
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
    ];

    // validate BOTTOM row of annotations
    for (let i = 1; i <= 10; i += 1) {
      expect(gameBoard.GridAnnotations.get(`${i},0`).toDisplayString()).toEqual(
        expectedHorizontalAnnotationSequence[i - 1],
      );
    }

    // validate TOP row of annotations
    for (let i = 1; i <= 10; i += 1) {
      expect(
        gameBoard.GridAnnotations.get(`${i},11`).toDisplayString(),
      ).toEqual(expectedHorizontalAnnotationSequence[i - 1]);
    }

    // validate LEFT column of annotations
    for (let i = 1; i <= 10; i += 1) {
      expect(gameBoard.GridAnnotations.get(`0,${i}`).toDisplayString()).toEqual(
        expectedVerticalAnnotationSequence[i - 1],
      );
    }

    // validate RIGHT column of annotations
    for (let i = 1; i <= 10; i += 1) {
      expect(
        gameBoard.GridAnnotations.get(`11,${i}`).toDisplayString(),
      ).toEqual(expectedVerticalAnnotationSequence[i - 1]);
    }

    // next steps are to provide visual validation of results
    gameBoard.revealAll();

    const output = render(gameBoard);

    // eslint-disable-next-line no-console
    console.log(output.toString());
  });
});

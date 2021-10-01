import { AnnotationDisplayString } from './AnnotationDisplayString';
import { BoardEdge } from './BoardEdge';
import { GameBoard } from './GameBoard';
import { Point } from './point';
import { render } from './renderGameBoard';
import { utilityClearAllAtomsFromBoard } from './utilityClearAllAtomsFromBoard';

describe.each`
  entryPointX | entryPointY | exitPointX | exitPointY | entryCellIndex | entryBoardEdge
  ${2}        | ${0}        | ${2}       | ${11}      | ${2}           | ${BoardEdge.Bottom}
  ${2}        | ${11}       | ${2}       | ${0}       | ${2}           | ${BoardEdge.Top}
  ${0}        | ${2}        | ${11}      | ${2}       | ${2}           | ${BoardEdge.Left}
  ${11}       | ${2}        | ${0}       | ${2}       | ${2}           | ${BoardEdge.Right}
`(
  'When shooting rays that are a STRAIGHT MISS',
  ({
    entryPointX,
    entryPointY,
    exitPointX,
    exitPointY,
    entryCellIndex,
    entryBoardEdge,
  }) => {
    const dimensionX = 10;
    const dimensionY = 10;
    const atomCount = 1;

    const atomPoint = new Point(5, 5);

    const entryPoint = new Point(entryPointX, entryPointY);
    const exitPoint = new Point(exitPointX, exitPointY);

    const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

    utilityClearAllAtomsFromBoard(gameBoard);

    // set single atom at expected location
    gameBoard.GameGrid.get(atomPoint.toIdString()).hasAtom = true;

    // send the ray that will NOT be influenced by the single atom
    gameBoard.sendRay(entryBoardEdge, entryCellIndex);

    it('should set entry annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(
          entryPoint.toIdString(),
        ).toDisplayString(),
      ).toEqual('A');
    });

    it('should set exit annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(exitPoint.toIdString()).toDisplayString(),
      ).toEqual('A');
    });
  },
);

describe.each`
  entryPointX | entryPointY | exitPointX | exitPointY | entryCellIndex | entryBoardEdge
  ${6}        | ${0}        | ${11}      | ${4}       | ${6}           | ${BoardEdge.Bottom}
  ${6}        | ${11}       | ${11}      | ${6}       | ${6}           | ${BoardEdge.Top}
  ${0}        | ${6}        | ${4}       | ${11}      | ${6}           | ${BoardEdge.Left}
  ${11}       | ${6}        | ${6}       | ${11}      | ${6}           | ${BoardEdge.Right}
`(
  'When shooting rays that are a DEFLECTED MISS',
  ({
    entryPointX,
    entryPointY,
    exitPointX,
    exitPointY,
    entryCellIndex,
    entryBoardEdge,
  }) => {
    const dimensionX = 10;
    const dimensionY = 10;
    const atomCount = 1;

    const atomPoint = new Point(5, 5);

    const entryPoint = new Point(entryPointX, entryPointY);
    const exitPoint = new Point(exitPointX, exitPointY);

    const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

    utilityClearAllAtomsFromBoard(gameBoard);

    // set single atom at expected location
    gameBoard.GameGrid.get(atomPoint.toIdString()).hasAtom = true;

    // send the ray that will NOT be influenced by the single atom
    gameBoard.sendRay(entryBoardEdge, entryCellIndex);

    it('should set entry annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(
          entryPoint.toIdString(),
        ).toDisplayString(),
      ).toEqual('A');
    });

    it('should set exit annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(exitPoint.toIdString()).toDisplayString(),
      ).toEqual('A');
    });
  },
);

describe.each`
  entryPointX | entryPointY | entryCellIndex | entryBoardEdge
  ${5}        | ${0}        | ${5}           | ${BoardEdge.Bottom}
  ${5}        | ${11}       | ${5}           | ${BoardEdge.Top}
  ${0}        | ${5}        | ${5}           | ${BoardEdge.Left}
  ${11}       | ${5}        | ${5}           | ${BoardEdge.Right}
`(
  'When shooting rays that are a HIT',
  ({ entryPointX, entryPointY, entryCellIndex, entryBoardEdge }) => {
    const dimensionX = 10;
    const dimensionY = 10;
    const atomCount = 1;

    const atomPoint = new Point(5, 5);

    const entryPoint = new Point(entryPointX, entryPointY);

    const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

    utilityClearAllAtomsFromBoard(gameBoard);

    // set single atom at expected location
    gameBoard.GameGrid.get(atomPoint.toIdString()).hasAtom = true;

    // send the ray that will HIT the single atom
    gameBoard.sendRay(entryBoardEdge, entryCellIndex);

    it('should set entry annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(
          entryPoint.toIdString(),
        ).toDisplayString(),
      ).toEqual(AnnotationDisplayString.hit);
    });
  },
);

describe.each`
  entryPointX | entryPointY | entryCellIndex | entryBoardEdge      | expectedAnnotation
  ${5}        | ${0}        | ${5}           | ${BoardEdge.Bottom} | ${AnnotationDisplayString.reflectBottom}
  ${5}        | ${11}       | ${5}           | ${BoardEdge.Top}    | ${AnnotationDisplayString.reflectTop}
  ${0}        | ${5}        | ${5}           | ${BoardEdge.Left}   | ${AnnotationDisplayString.reflectLeft}
  ${11}       | ${5}        | ${5}           | ${BoardEdge.Right}  | ${AnnotationDisplayString.reflectRight}
`(
  'When shooting rays that are a REFLECT',
  ({
    entryPointX,
    entryPointY,
    entryCellIndex,
    entryBoardEdge,
    expectedAnnotation,
  }) => {
    const dimensionX = 10;
    const dimensionY = 10;
    const atomCount = 1;

    // setup necessary atoms to reflect
    const atomPoints = new Array<Point>();
    atomPoints.push(new Point(4, 4));
    atomPoints.push(new Point(6, 4));
    atomPoints.push(new Point(4, 6));
    atomPoints.push(new Point(6, 6));

    const entryPoint = new Point(entryPointX, entryPointY);

    const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

    utilityClearAllAtomsFromBoard(gameBoard);

    // set all atoms at expected location
    atomPoints.forEach((ap) => {
      gameBoard.GameGrid.get(ap.toIdString()).hasAtom = true;
    });

    // send the ray that will be REFLECTED by the collection of atoms
    gameBoard.sendRay(entryBoardEdge, entryCellIndex);

    it('should set entry annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(
          entryPoint.toIdString(),
        ).toDisplayString(),
      ).toEqual(expectedAnnotation);
    });
  },
);

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

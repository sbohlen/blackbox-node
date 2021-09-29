import { AnnotationDisplayString } from './AnnotationDisplayString';
import { BoardEdge } from './BoardEdge';
import { GameBoard } from './GameBoard';
import { Point } from './point';
import { utilityClearAllAtomsFromBoard } from './utilityClearAllAtomsFromBoard';

describe.each`
  entryPointX | entryPointY | exitPointX | exitPointY | entryCellIndex | entryBoardEdge
  ${2}        | ${0}        | ${2}       | ${11}      | ${2}           | ${BoardEdge.Bottom}
  ${2}        | ${11}       | ${2}       | ${0}       | ${2}           | ${BoardEdge.Top}
  ${0}        | ${2}        | ${11}      | ${2}       | ${2}           | ${BoardEdge.Left}
  ${11}       | ${2}        | ${0}       | ${2}       | ${2}           | ${BoardEdge.Right}
`(
  'When shooting a rays that are a STRAIGHT MISS',
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
  'When shooting a rays that are a DEFLECTED MISS',
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
  'When shooting a rays that are a HIT',
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
  'When shooting a rays that are a REFLECT',
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

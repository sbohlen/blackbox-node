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
  'When shooting a rays that are a MISS',
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

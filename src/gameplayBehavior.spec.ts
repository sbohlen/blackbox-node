import { applyToAllGameGridCells } from './applyToAllGameGridCells';
import { BoardEdge } from './BoardEdge';
import { Cell } from './Cell';
import { GameBoard } from './GameBoard';
import { Point } from './point';

function clearAllAtomsFromBoard(gameBoard: GameBoard) {
  applyToAllGameGridCells(gameBoard.GameGrid, (cell: Cell) => {
    // eslint-disable-next-line no-param-reassign
    cell.hasAtom = false;
  });
}

describe.each`
  entryPointX | entryPointY | exitPointX | exitPointY | entryBoardEdge
  ${2}        | ${0}        | ${2}       | ${11}      | ${BoardEdge.Bottom}
  ${2}        | ${11}       | ${2}       | ${0}       | ${BoardEdge.Top}
  ${0}        | ${2}        | ${11}      | ${2}       | ${BoardEdge.Left}
  ${11}       | ${2}        | ${0}       | ${2}       | ${BoardEdge.Right}
`(
  'When shooting a rays that are a MISS',
  ({ entryPointX, entryPointY, exitPointX, exitPointY, entryBoardEdge }) => {
    const dimensionX = 10;
    const dimensionY = 10;
    const atomCount = 1;

    const atomPoint = new Point(5, 5);

    const entryPoint = new Point(entryPointX, entryPointY);
    const exitPoint = new Point(exitPointX, exitPointY);

    const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

    clearAllAtomsFromBoard(gameBoard);

    // set single atom at expected location
    gameBoard.GameGrid.get(atomPoint.toIdString()).hasAtom = true;

    // send the ray that will NOT be influenced by the single atom
    gameBoard.sendRay(entryBoardEdge, entryPointX);

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

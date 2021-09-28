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

describe('the GAME-PLAY test', () => {
  const dimensionX = 10;
  const dimensionY = 10;
  const atomCount = 1;

  const atomPoint = new Point(5, 5);

  const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

  clearAllAtomsFromBoard(gameBoard);

  // set single atom at expected location
  gameBoard.GameGrid.get(atomPoint.toIdString()).hasAtom = true;

  // send the ray that will NOT be influenced by the single atom
  gameBoard.sendRay(BoardEdge.Bottom, 2);

  it('should set entry annotation correctly', () => {
    expect(gameBoard.GridAnnotations.get('2,0').toDisplayString()).toEqual('A');
  });
});

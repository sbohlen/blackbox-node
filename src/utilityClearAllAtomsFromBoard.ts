import { applyToAllGameGridCells } from './applyToAllGameGridCells';
import { Cell } from './Cell';
import { GameBoard } from './GameBoard';

export function utilityClearAllAtomsFromBoard(gameBoard: GameBoard) {
  applyToAllGameGridCells(gameBoard.GameGrid, (cell: Cell) => {
    // eslint-disable-next-line no-param-reassign
    cell.hasAtom = false;
  });
}

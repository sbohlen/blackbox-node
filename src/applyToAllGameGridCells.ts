import { Cell } from './Cell';
import { GameGrid } from './GameGrid';

export function applyToAllGameGridCells(
  gameGrid: GameGrid,
  applyTo: (cell: Cell) => void,
): void {
  const keys = Array.from(gameGrid.keys());

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    const cell = gameGrid.get(key);
    applyTo(cell);
  }
}

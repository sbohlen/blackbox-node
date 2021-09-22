import { GameGrid } from './GameGrid';
import { GridAnnotations } from './GridAnnotations';
import { Point } from './point';
import { TraceResult } from './rayTracer';

export function addGuess(point: Point, gameGrid: GameGrid) {
  const cell = gameGrid.get(point.toIdString());
  cell.isGuess = true;
}

export function removeGuess(point: Point, gameGrid: GameGrid) {
  const cell = gameGrid.get(point.toIdString());
  cell.isGuess = false;
}

export function revealAll(gameGrid: GameGrid) {
  const keys = Array.from(gameGrid.keys());

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    const cell = gameGrid.get(key);
    cell.isRevealMode = true;
  }
}

export function enableAlternateDisplayOption(gameGrid: GameGrid) {
  const keys = Array.from(gameGrid.keys());

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    const cell = gameGrid.get(key);
    cell.useAlternateDisplayString = true;
  }
}

export function correctGuessCount(gameGrid: GameGrid): number {
  return Array.from(gameGrid.values()).filter(
    (cell) => cell.isGuess && cell.hasAtom,
  ).length;
}

export function incorrectGuessCount(gameGrid: GameGrid): number {
  return Array.from(gameGrid.values()).filter(
    (cell) => cell.isGuess && !cell.hasAtom,
  ).length;
}

export function updateAnnotation(
  traceResult: TraceResult,
  gridAnnotations: GridAnnotations,
): number {
  throw new Error(`not implemented yet ${traceResult} ${gridAnnotations}`);
}

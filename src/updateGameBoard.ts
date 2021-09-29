import { AnnotationDisplayString } from './AnnotationDisplayString';
import { applyToAllGameGridCells } from './applyToAllGameGridCells';
import { BoardEdge } from './BoardEdge';
import { Cell } from './Cell';
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
  applyToAllGameGridCells(gameGrid, (cell: Cell) => {
    // eslint-disable-next-line no-param-reassign
    cell.isRevealMode = true;
  });
}

export function enableDebugDisplay(gameGrid: GameGrid) {
  applyToAllGameGridCells(gameGrid, (cell: Cell) => {
    // eslint-disable-next-line no-param-reassign
    cell.useDebugDisplay = true;
  });
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
  point: Point,
  annotations: GridAnnotations,
  value: string,
) {
  const element = annotations.get(point.toIdString());
  element.annotation = value;
}

function getReflectionDisplayStringFor(entryEdge: BoardEdge): string {
  switch (entryEdge) {
    case BoardEdge.Top:
      return AnnotationDisplayString.reflectTop;

    case BoardEdge.Bottom:
      return AnnotationDisplayString.reflectBottom;

    case BoardEdge.Left:
      return AnnotationDisplayString.reflectLeft;

    case BoardEdge.Right:
      return AnnotationDisplayString.reflectRight;

    default:
      throw new Error(`Invalid BoardEdge '${entryEdge}' provided.`); // should never happen
  }
}

export function applyTraceResultToBoard(
  entryPoint: Point,
  traceResult: TraceResult,
  entryEdge: BoardEdge,
  gameGrid: GameGrid,
  gridAnnotations: GridAnnotations,
  getNextAnnotationValueProvider: () => string,
) {
  let entryAnnotationX: number;
  let entryAnnotationY: number;
  let exitAnnotationX: number;
  let exitAnnotationY: number;

  // determine the coordinates of the entry annotation cell
  switch (entryEdge) {
    case BoardEdge.Top:
      entryAnnotationX = entryPoint.X;
      entryAnnotationY = entryPoint.Y + 1;
      break;
    case BoardEdge.Bottom:
      entryAnnotationX = entryPoint.X;
      entryAnnotationY = entryPoint.Y - 1;
      break;
    case BoardEdge.Left:
      entryAnnotationX = entryPoint.X - 1;
      entryAnnotationY = entryPoint.Y;
      break;
    case BoardEdge.Right:
      entryAnnotationX = entryPoint.X + 1;
      entryAnnotationY = entryPoint.Y;
      break;
    default:
      throw new Error(`Invalid BoardEdge '${entryEdge}' provided.`); // should never happen
  }

  const entryAnnotationPoint: Point = new Point(
    entryAnnotationX,
    entryAnnotationY,
  );

  if (traceResult.isHit) {
    updateAnnotation(
      entryAnnotationPoint,
      gridAnnotations,
      AnnotationDisplayString.hit,
    );

    return;
  }

  if (traceResult.isReflect) {
    updateAnnotation(
      entryAnnotationPoint,
      gridAnnotations,
      getReflectionDisplayStringFor(entryEdge),
    );

    return;
  }

  // if we're here, then we have to update *both* the ENTRY and EXIT annotations

  // determine the coordinates of the exit annotation cell

  if (traceResult.finalPoint.X === gameGrid.minX) {
    exitAnnotationX = traceResult.finalPoint.X - 1;
    exitAnnotationY = traceResult.finalPoint.Y;
  }

  if (traceResult.finalPoint.X === gameGrid.maxX) {
    exitAnnotationX = traceResult.finalPoint.X + 1;
    exitAnnotationY = traceResult.finalPoint.Y;
  }

  if (traceResult.finalPoint.Y === gameGrid.minY) {
    exitAnnotationX = traceResult.finalPoint.X;
    exitAnnotationY = traceResult.finalPoint.Y - 1;
  }

  if (traceResult.finalPoint.Y === gameGrid.maxY) {
    exitAnnotationX = traceResult.finalPoint.X;
    exitAnnotationY = traceResult.finalPoint.Y + 1;
  }

  const exitAnnotationPoint: Point = new Point(
    exitAnnotationX,
    exitAnnotationY,
  );

  const value = getNextAnnotationValueProvider();

  updateAnnotation(entryAnnotationPoint, gridAnnotations, value);
  updateAnnotation(exitAnnotationPoint, gridAnnotations, value);
}

import { Cell } from './Cell';
import { GameGrid } from './GameGrid';
import { Point } from './point';

enum Direction {
  'Up',
  'Down',
  'Left',
  'Right',
  'Indeterminate',
}

enum CellAnalysisResult {
  'Reflect',
  'MakeLeftTurn',
  'MakeRightTurn',
  'ContinueStraight',
}

function determineEntryDirection(
  entryPoint: Point,
  gameGrid: GameGrid,
): Direction {
  let entryDirection: Direction;

  if (entryPoint.X === gameGrid.minX) {
    entryDirection = Direction.Left;
  } else if (entryPoint.Y === gameGrid.minY) {
    entryDirection = Direction.Up;
  } else if (entryPoint.Y === gameGrid.maxY) {
    entryDirection = Direction.Down;
  } else if (entryPoint.X === gameGrid.maxX) {
    entryDirection = Direction.Right;
  } else {
    entryDirection = Direction.Indeterminate;
  }

  return entryDirection;
}

function getLeftCell(
  currentPosition: Point,
  entryDirection: Direction,
  gameGrid: GameGrid,
): Cell {
  let selectPoint: Point;

  switch (entryDirection) {
    case Direction.Left:
      selectPoint = new Point(currentPosition.X, currentPosition.Y + 1);

      break;

    case Direction.Right:
      selectPoint = new Point(currentPosition.X, currentPosition.Y - 1);

      break;

    case Direction.Up:
      selectPoint = new Point(currentPosition.X - 1, currentPosition.Y);
      break;

    case Direction.Down:
      selectPoint = new Point(currentPosition.X + 1, currentPosition.Y);

      break;

    default:
      break;
  }

  return gameGrid.get(selectPoint.toIdString());
}

function getRightCell(
  currentPosition: Point,
  entryDirection: Direction,
  gameGrid: GameGrid,
): Cell {
  let selectPoint: Point;

  switch (entryDirection) {
    case Direction.Left:
      selectPoint = new Point(currentPosition.X, currentPosition.Y - 1);

      break;

    case Direction.Right:
      selectPoint = new Point(currentPosition.X, currentPosition.Y + 1);

      break;

    case Direction.Up:
      selectPoint = new Point(currentPosition.X + 1, currentPosition.Y);
      break;

    case Direction.Down:
      selectPoint = new Point(currentPosition.X - 1, currentPosition.Y);

      break;

    default:
      break;
  }

  return gameGrid.get(selectPoint.toIdString());
}

function getUpperRightCell(
  currentPosition: Point,
  entryDirection: Direction,
  gameGrid: GameGrid,
): Cell {
  let selectPoint: Point;

  switch (entryDirection) {
    case Direction.Left:
      selectPoint = new Point(currentPosition.X + 1, currentPosition.Y - 1);

      break;

    case Direction.Right:
      selectPoint = new Point(currentPosition.X - 1, currentPosition.Y + 1);

      break;

    case Direction.Up:
      selectPoint = new Point(currentPosition.X + 1, currentPosition.Y + 1);
      break;

    case Direction.Down:
      selectPoint = new Point(currentPosition.X - 1, currentPosition.Y - 1);

      break;

    default:
      break;
  }

  return gameGrid.get(selectPoint.toIdString());
}

function getUpperLeftCell(
  currentPosition: Point,
  entryDirection: Direction,
  gameGrid: GameGrid,
): Cell {
  let selectPoint: Point;

  switch (entryDirection) {
    case Direction.Left:
      selectPoint = new Point(currentPosition.X + 1, currentPosition.Y + 1);

      break;

    case Direction.Right:
      selectPoint = new Point(currentPosition.X - 1, currentPosition.Y - 1);

      break;

    case Direction.Up:
      selectPoint = new Point(currentPosition.X - 1, currentPosition.Y + 1);
      break;

    case Direction.Down:
      selectPoint = new Point(currentPosition.X + 1, currentPosition.Y - 1);

      break;

    default:
      break;
  }

  return gameGrid.get(selectPoint.toIdString());
}

function analyzeCellContext(
  gameGrid: GameGrid,
  currentCell: Cell,
  leftCell: Cell,
  rightCell: Cell,
  upperLeftCell: Cell,
  upperRightCell: Cell,
): CellAnalysisResult {
  throw new Error('Function not implemented.');
}

function traceFrom(
  currentPosition: Point,
  entryDirection: Direction,
  gameGrid: GameGrid,
): TraceResult {
  // test for a hit on an atom
  if (gameGrid.get(currentPosition.toIdString()).hasAtom) {
    // immediately return if found b/c no point in further processing
    return { hasAtom: true };
  }

  const leftCell = getLeftCell(currentPosition, entryDirection, gameGrid);
  const rightCell = getRightCell(currentPosition, entryDirection, gameGrid);
  const upperLeftCell = getUpperLeftCell(
    currentPosition,
    entryDirection,
    gameGrid,
  );
  const upperRightCell = getUpperRightCell(
    currentPosition,
    entryDirection,
    gameGrid,
  );

  const currentCell = gameGrid.get(currentPosition.toIdString());

  const analysisResult: CellAnalysisResult = analyzeCellContext(
    gameGrid,
    currentCell,
    leftCell,
    rightCell,
    upperLeftCell,
    upperRightCell,
  );

  let nextPoint: Point;

  return { hasAtom: false, nextPoint };
}

class TraceResult {
  hasAtom: boolean;

  nextPoint?: Point;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function traceRay(entryPoint: Point, gameGrid: GameGrid): Point {
  const entryDirection = determineEntryDirection(entryPoint, gameGrid);

  const traceResult = traceFrom(entryPoint, entryDirection, gameGrid);

  return new Point(entryPoint.X, entryPoint.Y);
}

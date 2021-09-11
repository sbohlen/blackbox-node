import { Cell } from './Cell';
import { GameGrid } from './GameGrid';
import { notNullOrUndefined } from './notNullOrUndefined';
import { Point } from './point';
import { rotatePoint } from './rotatePoint';

enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
  Indeterminate = 'Indeterminate',
}

enum CellAnalysisResult {
  Hit = 'Hit',
  Reflect = 'Reflect',
  MakeLeftTurn = 'MakeLeftTurn',
  MakeRightTurn = 'MakeRightTurn',
  ContinueStraight = 'ContinueStraight',
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

function getLeftCell(currentPosition: Point, gameGrid: GameGrid): Cell {
  const selectPoint = new Point(currentPosition.X - 1, currentPosition.Y);
  return gameGrid.get(selectPoint.toIdString());
}

function getRightCell(currentPosition: Point, gameGrid: GameGrid): Cell {
  const selectPoint = new Point(currentPosition.X + 1, currentPosition.Y);
  return gameGrid.get(selectPoint.toIdString());
}

function getUpperRightCell(currentPosition: Point, gameGrid: GameGrid): Cell {
  const selectPoint = new Point(currentPosition.X + 1, currentPosition.Y + 1);
  return gameGrid.get(selectPoint.toIdString());
}

function getUpperLeftCell(currentPosition: Point, gameGrid: GameGrid): Cell {
  const selectPoint = new Point(currentPosition.X - 1, currentPosition.Y + 1);
  return gameGrid.get(selectPoint.toIdString());
}

/**
 *          +----- the cell [??] to analyze
 *          |
 *          V
 *  +----+    +----+
 *  | UL |    | UR |
 *  +----+----+----+
 *  | L  | ?? | R  |
 *  +----+----+----+
 *          ^
 *          |
 *      entry vector (direction=UP)
 */
function analyzeCellContext(
  gameGrid: GameGrid,
  currentCell: Cell,
  leftCell: Cell,
  rightCell: Cell,
  upperLeftCell: Cell,
  upperRightCell: Cell,
): CellAnalysisResult {
  if (currentCell.hasAtom) {
    return CellAnalysisResult.Hit;
  }

  if (leftCell.hasAtom || rightCell.hasAtom) {
    return CellAnalysisResult.Reflect;
  }

  if (
    upperLeftCell.hasAtom &&
    upperRightCell.hasAtom &&
    !leftCell.hasAtom &&
    !rightCell.hasAtom
  ) {
    return CellAnalysisResult.Reflect;
  }

  if (
    upperLeftCell.hasAtom &&
    !upperRightCell.hasAtom &&
    !leftCell.hasAtom &&
    !rightCell.hasAtom
  ) {
    return CellAnalysisResult.MakeRightTurn;
  }

  if (
    upperRightCell.hasAtom &&
    !upperLeftCell.hasAtom &&
    !leftCell.hasAtom &&
    !rightCell.hasAtom
  ) {
    return CellAnalysisResult.MakeLeftTurn;
  }
  return CellAnalysisResult.ContinueStraight;
}

// check whether any of the coords of the point match the coordinate of the bounds of the grid...
function checkPerimeterReached(point: Point, gameGrid: GameGrid): Boolean {
  return (
    point.X === gameGrid.minX ||
    point.X === gameGrid.maxX ||
    point.Y === gameGrid.minY ||
    point.Y === gameGrid.maxY
  );
}

function traceFrom(currentPosition: Point, gameGrid: GameGrid): TraceResult {
  // test for a hit on an atom
  if (gameGrid.get(currentPosition.toIdString()).hasAtom) {
    // immediately return if found b/c no point in further processing
    return { hasAtom: true };
  }

  const leftCell = getLeftCell(currentPosition, gameGrid);
  const rightCell = getRightCell(currentPosition, gameGrid);
  const upperLeftCell = getUpperLeftCell(currentPosition, gameGrid);
  const upperRightCell = getUpperRightCell(currentPosition, gameGrid);

  const currentCell = gameGrid.get(currentPosition.toIdString());

  let reachedPerimeter: boolean = false;

  const originalPosition = currentPosition;

  while (!reachedPerimeter) {
    const analysisResult: CellAnalysisResult = analyzeCellContext(
      gameGrid,
      currentCell,
      leftCell,
      rightCell,
      upperLeftCell,
      upperRightCell,
    );

    const continueStraightTranslation = new Point(
      currentPosition.X,
      currentPosition.Y + 1,
    );

    const makeLeftTurnTranslation = new Point(
      currentPosition.X - 1,
      currentPosition.Y,
    );

    const makeRightTurnTranslation = new Point(
      currentPosition.X + 1,
      currentPosition.Y,
    );

    switch (analysisResult) {
      case CellAnalysisResult.Hit:
        return { hasAtom: true, finalPoint: originalPosition };

      case CellAnalysisResult.ContinueStraight:
        if (checkPerimeterReached(continueStraightTranslation, gameGrid)) {
          reachedPerimeter = true;
          return { hasAtom: false, finalPoint: continueStraightTranslation };
        }
        return traceFrom(continueStraightTranslation, gameGrid);

      case CellAnalysisResult.MakeLeftTurn:
        if (checkPerimeterReached(makeLeftTurnTranslation, gameGrid)) {
          reachedPerimeter = true;
          return { hasAtom: false, finalPoint: makeLeftTurnTranslation };
        }
        return traceFrom(makeLeftTurnTranslation, gameGrid);

      case CellAnalysisResult.MakeRightTurn:
        if (checkPerimeterReached(makeRightTurnTranslation, gameGrid)) {
          reachedPerimeter = true;
          return { hasAtom: false, finalPoint: makeRightTurnTranslation };
        }
        return traceFrom(makeRightTurnTranslation, gameGrid);

      case CellAnalysisResult.Reflect:
        reachedPerimeter = true;
        return { hasAtom: false, finalPoint: originalPosition };
      default:
        break;
    }
  }
  throw new Error('Unable to trace ray; should NEVER get to this line!');
}
class TraceResult {
  hasAtom: boolean;

  finalPoint?: Point;
}

export function traceRay(entryPoint: Point, gameGrid: GameGrid): TraceResult {
  const entryDirection = determineEntryDirection(entryPoint, gameGrid);

  let rotatedEntryPoint = entryPoint;

  // create a dictionary of the rotation angle necessary for each entry vector direction
  const rotationValueMap = new Map<Direction, number>();
  rotationValueMap.set(Direction.Down, 180);
  rotationValueMap.set(Direction.Left, -90);
  rotationValueMap.set(Direction.Right, 90);
  rotationValueMap.set(Direction.Up, 0);

  // lookup the appropriate rotation angle based on the entry vector direction
  const activeRotationAngle = rotationValueMap.get(entryDirection);

  // rotate the grid and the entryPoint to align with expectations for entry vector direction being UP^
  gameGrid.rotate(activeRotationAngle);
  rotatedEntryPoint = rotatePoint(entryPoint, activeRotationAngle);

  const traceResult = traceFrom(rotatedEntryPoint, gameGrid);

  // rotate the grid back to its original orientation
  // TODO: determine whether this is actually necessary (if passed by-ref instead of by-val)
  gameGrid.rotate(activeRotationAngle * -1);

  // rotate the resultant point back to its original orientation
  if (notNullOrUndefined(traceResult.finalPoint)) {
    const reverseRotatedPoint = rotatePoint(
      traceResult.finalPoint,
      activeRotationAngle * -1,
    );

    return { hasAtom: traceResult.hasAtom, finalPoint: reverseRotatedPoint };
  }

  return traceResult;
}

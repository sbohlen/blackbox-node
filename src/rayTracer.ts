import { Cell } from './Cell';
import { GameGrid } from './GameGrid';
import { notNullOrUndefined } from './notNullOrUndefined';
import { Point } from './point';
import { rotatePoint } from './rotatePoint';
import { logger } from './logger';

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
  logger.debug('Determining entry vector direction...');

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

  logger.debug(`Entry vector direction determined: '${entryDirection}'`);

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
  currentCell: Cell,
  leftCell: Cell,
  rightCell: Cell,
  upperLeftCell: Cell,
  upperRightCell: Cell,
): CellAnalysisResult {
  logger.debug(
    `Analyzing cell '${currentCell.point.toIdString()}' to determine next action...`,
  );

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
  logger.debug(
    `Checking point '${point.toIdString()}' to determine whether perimeter of grid has been reached.`,
  );

  const result =
    point.X === gameGrid.minX ||
    point.X === gameGrid.maxX ||
    point.Y === gameGrid.minY ||
    point.Y === gameGrid.maxY;

  logger.debug(`Perimeter check for point '${point.toIdString()}': ${result}`);

  return result;
}

function traceFrom(currentPosition: Point, gameGrid: GameGrid): TraceResult {
  logger.debug(`Tracing ray from point: '${currentPosition.toIdString()}'`);

  const currentCell = gameGrid.get(currentPosition.toIdString());

  // test for a hit on an atom
  if (currentCell.hasAtom) {
    logger.debug(
      `Current position '${currentPosition.toIdString()}' has atom:TRUE, aborting further analysis.`,
    );
    // immediately return if found b/c no point in further processing
    return { isHit: true };
  }

  const leftCell = getLeftCell(currentPosition, gameGrid);
  const rightCell = getRightCell(currentPosition, gameGrid);
  const upperLeftCell = getUpperLeftCell(currentPosition, gameGrid);
  const upperRightCell = getUpperRightCell(currentPosition, gameGrid);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const analysisResult: CellAnalysisResult = analyzeCellContext(
      currentCell,
      leftCell,
      rightCell,
      upperLeftCell,
      upperRightCell,
    );

    logger.debug(
      `Analysis of cell '${currentCell.point.toIdString()}' complete, result: '${analysisResult}'`,
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
        return { isHit: true };

      case CellAnalysisResult.ContinueStraight:
        if (checkPerimeterReached(continueStraightTranslation, gameGrid)) {
          logger.debug(
            `Perimeter reached at position '${continueStraightTranslation.toIdString()}', exiting analysis loop`,
          );
          return { finalPoint: continueStraightTranslation };
        }
        return traceFrom(continueStraightTranslation, gameGrid);

      case CellAnalysisResult.MakeLeftTurn:
        if (checkPerimeterReached(makeLeftTurnTranslation, gameGrid)) {
          logger.debug(
            `Perimeter reached at position '${makeLeftTurnTranslation.toIdString()}', exiting analysis loop`,
          );
          return { finalPoint: makeLeftTurnTranslation };
        }
        return traceFrom(makeLeftTurnTranslation, gameGrid);

      case CellAnalysisResult.MakeRightTurn:
        if (checkPerimeterReached(makeRightTurnTranslation, gameGrid)) {
          logger.debug(
            `Perimeter reached at position '${makeRightTurnTranslation.toIdString()}', exiting analysis loop`,
          );
          return { finalPoint: makeRightTurnTranslation };
        }
        return traceFrom(makeRightTurnTranslation, gameGrid);

      case CellAnalysisResult.Reflect:
        logger.debug(
          `reflection detected at position '${currentPosition.toIdString()}', exiting analysis loop`,
        );
        return { isReflect: true };
      default:
        break;
    }
  }
  throw new Error('Unable to trace ray; should NEVER get to this line!');
}
class TraceResult {
  isHit?: boolean = false;

  isReflect?: boolean = false;

  finalPoint?: Point;
}

// create a dictionary of the rotation angle necessary for each entry vector direction
const rotationValueMap = new Map<Direction, number>();
rotationValueMap.set(Direction.Down, 180);
rotationValueMap.set(Direction.Left, -90);
rotationValueMap.set(Direction.Right, 90);
rotationValueMap.set(Direction.Up, 0);

export function traceRay(entryPoint: Point, gameGrid: GameGrid): TraceResult {
  const entryDirection = determineEntryDirection(entryPoint, gameGrid);

  let rotatedEntryPoint = entryPoint;

  // lookup the appropriate rotation angle based on the entry vector direction
  const activeRotationAngle = rotationValueMap.get(entryDirection);

  // rotate the grid and the entryPoint to align with expectations for entry vector direction being UP^
  gameGrid.rotate(activeRotationAngle);
  rotatedEntryPoint = rotatePoint(entryPoint, activeRotationAngle);

  const traceResult = traceFrom(rotatedEntryPoint, gameGrid);

  // rotate the grid back to its original orientation
  // TODO: determine whether this is actually necessary (if passed by-ref instead of by-val)
  gameGrid.rotate(activeRotationAngle * -1);

  // if we have a hit, return that with entry point as final point
  if (traceResult.isHit) {
    return { isHit: traceResult.isHit, finalPoint: entryPoint };
  }

  // if we have a reflect, return that with entry point as final point
  if (traceResult.isReflect) {
    return { isReflect: traceResult.isReflect, finalPoint: entryPoint };
  }

  // if we don't have a hit or a reflect...
  if (notNullOrUndefined(traceResult.finalPoint)) {
    // ...rotate the resultant point back to its original orientation...
    const reverseRotatedPoint = rotatePoint(
      traceResult.finalPoint,
      activeRotationAngle * -1,
    );

    // ...and return that point as the final
    return { finalPoint: reverseRotatedPoint };
  }

  throw new Error('No hit, no reflect, no point returned; should never happen');
}

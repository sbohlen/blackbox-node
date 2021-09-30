import { BoardEdge } from './BoardEdge';
import { Cell } from './Cell';
import { CellAnalysisResult } from './CellAnalysisResult';
import { Direction } from './Direction';
import { GameGrid } from './GameGrid';
import { logger } from './logger';
import { notNullOrUndefined } from './notNullOrUndefined';
import { Point } from './point';
import { rotatePoint } from './rotatePoint';

function getForwardCell(currentPosition: Point, gameGrid: GameGrid): Cell {
  const selectPoint = new Point(currentPosition.X, currentPosition.Y + 1);
  return gameGrid.get(selectPoint.toIdString()) ?? new Cell(selectPoint);
}

function getLeftCell(currentPosition: Point, gameGrid: GameGrid): Cell {
  const selectPoint = new Point(currentPosition.X - 1, currentPosition.Y);
  return gameGrid.get(selectPoint.toIdString()) ?? new Cell(selectPoint);
}

function getRightCell(currentPosition: Point, gameGrid: GameGrid): Cell {
  const selectPoint = new Point(currentPosition.X + 1, currentPosition.Y);
  return gameGrid.get(selectPoint.toIdString()) ?? new Cell(selectPoint);
}

function getUpperRightCell(currentPosition: Point, gameGrid: GameGrid): Cell {
  const selectPoint = new Point(currentPosition.X + 1, currentPosition.Y + 1);
  return gameGrid.get(selectPoint.toIdString()) ?? new Cell(selectPoint);
}

function getUpperLeftCell(currentPosition: Point, gameGrid: GameGrid): Cell {
  const selectPoint = new Point(currentPosition.X - 1, currentPosition.Y + 1);
  return gameGrid.get(selectPoint.toIdString()) ?? new Cell(selectPoint);
}

/**
 *
 * Cheat-sheet
 * (all analysis occurs on cells having been rotated/oriented
 *   such that entry vector is UP)
 *
 *
 *  [??] = the cell to analyze
 *
 *
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
  forwardCell: Cell,
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
    point.X < gameGrid.minX ||
    point.X > gameGrid.maxX ||
    point.Y < gameGrid.minY ||
    point.Y > gameGrid.maxY;

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

  const forwardCell = getForwardCell(currentPosition, gameGrid);
  const leftCell = getLeftCell(currentPosition, gameGrid);
  const rightCell = getRightCell(currentPosition, gameGrid);
  const upperLeftCell = getUpperLeftCell(currentPosition, gameGrid);
  const upperRightCell = getUpperRightCell(currentPosition, gameGrid);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const analysisResult: CellAnalysisResult = analyzeCellContext(
      currentCell,
      forwardCell,
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

    const makeLeftTurnRotation = 90;
    const makeRightTurnRotation = 270;

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
          gameGrid.rotate(makeLeftTurnRotation);
          const rotatedLeftTurnTranslation = rotatePoint(
            makeLeftTurnTranslation,
            makeLeftTurnRotation,
          );
          return { finalPoint: rotatedLeftTurnTranslation };
        }

        gameGrid.rotate(makeLeftTurnRotation);
        return traceFrom(
          rotatePoint(makeLeftTurnTranslation, makeLeftTurnRotation),
          gameGrid,
        );

      case CellAnalysisResult.MakeRightTurn:
        if (checkPerimeterReached(makeRightTurnTranslation, gameGrid)) {
          logger.debug(
            `Perimeter reached at position '${makeRightTurnTranslation.toIdString()}', exiting analysis loop`,
          );
          gameGrid.rotate(makeRightTurnRotation);
          const rotatedRightTurnTranslation = rotatePoint(
            makeRightTurnTranslation,
            makeRightTurnRotation,
          );
          return { finalPoint: rotatedRightTurnTranslation };
        }

        gameGrid.rotate(makeRightTurnRotation);
        return traceFrom(
          rotatePoint(makeRightTurnTranslation, makeRightTurnRotation),
          gameGrid,
        );

      case CellAnalysisResult.Reflect:
        logger.debug(
          `reflection detected at position '${currentPosition.toIdString()}', exiting analysis loop`,
        );
        return { isReflect: true };
      default:
        throw new Error('Unable to trace ray; should NEVER get to this line!');
    }
  }
}
export class TraceResult {
  isHit?: boolean = false;

  isReflect?: boolean = false;

  finalPoint?: Point;

  exitEdge?: BoardEdge;
}

function translateToActualFinalPoint(
  currentPoint: Point,
  entryDirection: Direction,
): Point {
  switch (entryDirection) {
    case Direction.Up:
      return new Point(currentPoint.X, currentPoint.Y - 1);
    case Direction.Down:
      return new Point(currentPoint.X, currentPoint.Y + 1);
    case Direction.Left:
      return new Point(currentPoint.X + 1, currentPoint.Y);
    case Direction.Right:
      return new Point(currentPoint.X - 1, currentPoint.Y);
    default:
      throw new Error(`Invalid direction: ${entryDirection}`);
  }
}

// create a dictionary of the rotation angle necessary for each entry vector direction
const rotationValueMap = new Map<Direction, number>();
rotationValueMap.set(Direction.Down, 180);
rotationValueMap.set(Direction.Left, 90);
rotationValueMap.set(Direction.Right, 270);
rotationValueMap.set(Direction.Up, 0);

function getExitDirection(gameGrid: GameGrid): Direction {
  logger.debug('Determining exit vector direction...');

  let exitDirection: Direction;

  switch (gameGrid.currentResetRotationAngle()) {
    case 0:
      exitDirection = Direction.Up;
      break;

    case 90:
      exitDirection = Direction.Right;
      break;

    case 180:
      exitDirection = Direction.Down;
      break;

    case 270:
      exitDirection = Direction.Left;
      break;

    default:
      exitDirection = Direction.Indeterminate;
      break;
  }

  logger.debug(`Exit vector direction determined: '${exitDirection}'`);

  return exitDirection;
}

export function traceRay(
  entryPoint: Point,
  gameGrid: GameGrid,
  entryDirection: Direction,
): TraceResult {
  let rotatedEntryPoint = entryPoint;

  // lookup the appropriate rotation angle based on the entry vector direction
  const activeRotationAngle = rotationValueMap.get(entryDirection);

  // rotate the grid and the entryPoint to align with expectations for entry vector direction being UP^
  gameGrid.rotate(activeRotationAngle);
  rotatedEntryPoint = rotatePoint(entryPoint, activeRotationAngle);

  const traceResult = traceFrom(rotatedEntryPoint, gameGrid);

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
    // ...rotate the resultant point back to its original orientation
    const reverseRotatedPoint = rotatePoint(
      traceResult.finalPoint,
      gameGrid.currentResetRotationAngle(),
    );

    const exitDirection = getExitDirection(gameGrid);

    // as a final pre-return step, rotate the grid back to its original orientation
    // TODO: determine whether this is actually necessary (if passed by-ref instead of by-val)
    gameGrid.resetRotation();

    const translatedFinalPoint = translateToActualFinalPoint(
      reverseRotatedPoint,
      exitDirection,
    );

    // return the counter-rotated point as the final
    return { finalPoint: translatedFinalPoint };
  }

  throw new Error('No hit, no reflect, no point returned; should never happen');
}

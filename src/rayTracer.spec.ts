/* eslint-disable no-multi-str */
import { buildGameGrid } from './buildGameGrid';
import { Point } from './point';
import { traceRay } from './rayTracer';

const dimensionX = 10;
const dimensionY = 10;

describe('When traversing a clear path heading UP', () => {
  /**
   *              exit
   *                ^
   *                |
   *   +----+----+----+----+----+
   *   |    |    |  ^ |    |    |
   *   +----+----+----+----+----+
   *   |    |    |  ^ |    |    |
   *   +----+----+----+----+----+
   *   |    |    |  ^ |    |    |
   *   +----+----+----+----+----
   *   |    |    |  ^ |    |    |
   *   +----+----+----+----+----+
   *   |    |    |  ^ |    |    |
   *   +----+----+----+----+----+
   *                ^
   *                |
   *            entry vector
   *
   */

  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(5, 1);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(5, 10));
  });
});

describe('When traversing a clear path headed DOWN', () => {
  /**
   *           entry vector
   *                |
   *                v
   *   +----+----+----+----+----+
   *   |    |    |  v |    |    |
   *   +----+----+----+----+----+
   *   |    |    |  v |    |    |
   *   +----+----+----+----+----+
   *   |    |    |  v |    |    |
   *   +----+----+----+----+----+
   *   |    |    |  v |    |    |
   *   +----+----+----+----+----+
   *   |    |    |  v |    |    |
   *   +----+----+----+----+----+
   *                |
   *                v
   *              exit
   *
   */

  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(5, 10);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(5, 1));
  });
});

describe('When traversing a clear path headed RIGHT', () => {
  /**
   *
   *                +----+----+----+----+----+
   *                |    |    |    |    |    |
   *                +----+----+----+----+----+
   *                |    |    |    |    |    |
   *                +----+----+----+----+----+
   * entry vector-> | >  | >  | >  | >  | >  | -> exit
   *                +----+----+----+----+----+
   *                |    |    |    |    |    |
   *                +----+----+----+----+----+
   *                |    |    |    |    |    |
   *                +----+----+----+----+----+
   *
   */

  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(1, 5);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(10, 5));
  });
});

describe('When traversing a clear path headed LEFT', () => {
  /**
   *
   *         +----+----+----+----+----+
   *         |    |    |    |    |    |
   *         +----+----+----+----+----+
   *         |    |    |    |    |    |
   *         +----+----+----+----+----+
   * exit <- | <  | <  | <  | <  | <  | <- entry vector
   *         +----+----+----+----+----+
   *         |    |    |    |    |    |
   *         +----+----+----+----+----+
   *         |    |    |    |    |    |
   *         +----+----+----+----+----+
   *
   */

  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(10, 5);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(1, 5));
  });
});

describe('When atom is in path', () => {
  /**
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    |    | XX |    |    |
   *   +----+----+----+----+----
   *   |    |    |  ^ |    |    |
   *   +----+----+----+----+----+
   *   |    |    |  ^ |    |    |
   *   +----+----+----+----+----+
   *                ^
   *                |
   *            entry vector
   *
   */

  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const pointHavingAtom = new Point(5, 5);

  // set the cell to have the atom
  gameGrid.get(pointHavingAtom.toIdString()).hasAtom = true;

  const rayEntryPoint = new Point(5, 1);
  const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

  it('should return entry point as final point', () => {
    expect(rayTraceResult.finalPoint).toEqual(rayEntryPoint);
  });

  it('should return hit', () => {
    expect(rayTraceResult.isHit).toEqual(true);
  });
});

describe('When atom in upper-left of path', () => {
  /**
   *
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    | XX |    |    |    |
   *   +----+----+----+----+----+
   *   |    |    |  + | >  | >  | -> exit
   *   +----+----+----+----+----+
   *   |    |    |  ^ |    |    |
   *   +----+----+----+----+----+
   *   |    |    |  ^ |    |    |
   *   +----+----+----+----+----+
   *                ^
   *                |
   *            entry vector
   *
   */

  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const pointHavingAtom = new Point(5, 5);

  // set the cell to have the atom
  gameGrid.get(pointHavingAtom.toIdString()).hasAtom = true;

  const rayEntryPoint = new Point(6, 1);

  const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

  it('should make right turn', () => {
    expect(rayTraceResult.finalPoint).toEqual(new Point(10, 4));
  });
});

describe('When atom in upper-right of path', () => {
  /**
   *
   *         +----+----+----+----+----+
   *         |    |    |    |    |    |
   *         +----+----+----+----+----+
   *         |    |    |    | XX |    |
   *         +----+----+----+----+----+
   * exit <- |  < | <  |  + |    |    |
   *         +----+----+----+----+----+
   *         |    |    |  ^ |    |    |
   *         +----+----+----+----+----+
   *         |    |    |  ^ |    |    |
   *         +----+----+----+----+----+
   *                      ^
   *                      |
   *                  entry vector
   *
   */
  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const pointHavingAtom = new Point(5, 5);

  // set the cell to have the atom
  gameGrid.get(pointHavingAtom.toIdString()).hasAtom = true;

  const rayEntryPoint = new Point(4, 1);

  const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

  it('should make left turn', () => {
    expect(rayTraceResult.finalPoint).toEqual(new Point(1, 4));
  });
});

describe('When atoms are in both upper-left and upper-right of path', () => {
  /**
   *
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    | XX |    | XX |    |
   *   +----+----+----+----+----+
   *   |    |    |  R |    |    |
   *   +----+----+----+----+----+
   *   |    |    | v^ |    |    |
   *   +----+----+----+----+----+
   *   |    |    | v^ |    |    |
   *   +----+----+----+----+----+
   *                ^
   *                |
   *            entry vector
   *    (and also REFLECT result cell)
   *
   */
  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);

  const rayEntryPoint = new Point(5, 1);

  // set the cells to have the atoms
  gameGrid.get(new Point(rayEntryPoint.X - 1, 5).toIdString()).hasAtom = true;
  gameGrid.get(new Point(rayEntryPoint.X + 1, 5).toIdString()).hasAtom = true;

  const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

  it('should return entry point as final point', () => {
    expect(rayTraceResult.finalPoint).toEqual(rayEntryPoint);
  });

  it('should reflect', () => {
    expect(rayTraceResult.isReflect).toEqual(true);
  });
});

describe('When atom is adjacent to entry', () => {
  /**
   *
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    | XX |  R |    |    |
   *   +----+----+----+----+----+
   *               v^
   *                |
   *            entry vector
   *    (and also REFLECT result cell)
   *
   */

  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);

  const rayEntryPoint = new Point(5, 1);

  // set the cell to have the atom
  gameGrid.get(
    new Point(rayEntryPoint.X - 1, rayEntryPoint.Y).toIdString(),
  ).hasAtom = true;

  const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

  it('should return entry point as final point', () => {
    expect(rayTraceResult.finalPoint).toEqual(rayEntryPoint);
  });

  it('should reflect', () => {
    expect(rayTraceResult.isReflect).toEqual(true);
  });
});

describe('When two atoms are adjacent to entry', () => {
  /**
   *
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    |    |    |    |    |
   *   +----+----+----+----+----+
   *   |    | XX |  R | XX |    |
   *   +----+----+----+----+----+
   *               v^
   *                |
   *            entry vector
   *    (and also REFLECT result cell)
   *
   */

  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);

  const rayEntryPoint = new Point(5, 1);

  // set the cells to have the atoms
  gameGrid.get(
    new Point(rayEntryPoint.X - 1, rayEntryPoint.Y).toIdString(),
  ).hasAtom = true;
  gameGrid.get(
    new Point(rayEntryPoint.X + 1, rayEntryPoint.Y).toIdString(),
  ).hasAtom = true;

  const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

  it('should return entry point as final point', () => {
    expect(rayTraceResult.finalPoint).toEqual(rayEntryPoint);
  });

  it('should reflect', () => {
    expect(rayTraceResult.isReflect).toEqual(true);
  });
});

describe('When making multiple turns', () => {
  /**
   *         exit
   *           ^
   *           |
   *   +----+----+----+----+----+
   *   |    |  ^ |    |    |    |
   *   +----+----+----+----+----+
   *   |    |  ^ |    | XX |    |
   *   +----+----+----+----+----+
   *   |    |  + |  + |    |    |
   *   +----+----+----+----+----+
   *   | XX |    |  ^ |    |    |
   *   +----+----+----+----+----+
   *   |    |    |  ^ |    |    |
   *   +----+----+----+----+----+
   *                ^
   *                |
   *            entry vector
   *    (and also REFLECT result cell)
   *
   */

  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);

  const rayEntryPoint = new Point(5, 1);

  // set the cells to have the atoms
  gameGrid.get(
    new Point(rayEntryPoint.X + 1, rayEntryPoint.Y + 5).toIdString(),
  ).hasAtom = true;
  gameGrid.get(
    new Point(rayEntryPoint.X - 2, rayEntryPoint.Y + 3).toIdString(),
  ).hasAtom = true;

  const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

  it('should return expected final point', () => {
    const expectedFinalPoint = new Point(rayEntryPoint.X - 1, dimensionY);

    expect(rayTraceResult.finalPoint).toEqual(expectedFinalPoint);
  });
});

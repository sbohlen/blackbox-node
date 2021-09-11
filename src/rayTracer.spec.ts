import { buildGameGrid } from './buildGameGrid';
import { logger } from './logger';
import { Point } from './point';
import { traceRay } from './rayTracer';

const dimensionX = 10;
const dimensionY = 10;

describe('When traversing a clear path UP', () => {
  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(5, 1);

  it('should exit on the opposite side of the grid', () => {
    logger.debug(`*****TEST: UP should exit on the opposite side of the grid`);
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(5, 10));
  });
});

describe('When traversing a clear path DOWN', () => {
  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(5, 10);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(5, 1));
  });
});

describe('When traversing a clear path RIGHT', () => {
  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(1, 5);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(10, 5));
  });
});

describe('When traversing a clear path LEFT', () => {
  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(10, 5);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(1, 5));
  });
});

describe('When atom is in path', () => {
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
    expect(rayTraceResult.hasAtom).toEqual(true);
  });
});

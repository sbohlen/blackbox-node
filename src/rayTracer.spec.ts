import { buildGameGrid } from './buildGameGrid';
import { Point } from './point';
import { traceRay } from './rayTracer';

const dimensionX = 10;
const dimensionY = 10;
const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);

describe('When traversing a clear path UP', () => {
  const rayEntryPoint = new Point(5, 1);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(5, 10));
  });
});

describe('When traversing a clear path DOWN', () => {
  const rayEntryPoint = new Point(5, 10);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(5, 1));
  });
});

describe('When traversing a clear path RIGHT', () => {
  const rayEntryPoint = new Point(1, 5);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(10, 5));
  });
});

describe('When traversing a clear path LEFT', () => {
  const rayEntryPoint = new Point(10, 5);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(1, 5));
  });
});

import { buildGameGrid } from './buildGameGrid';
import { Point } from './point';
import { traceRay } from './rayTracer';

describe('When traversing a clear vertical path', () => {
  const dimensionX = 10;
  const dimensionY = 10;

  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(5, 1);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(5, 10));
  });
});

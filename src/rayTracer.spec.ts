import { buildGameGrid } from './buildGameGrid';
import { Point } from './point';
import { traceRay } from './rayTracer';

const dimensionX = 10;
const dimensionY = 10;

describe('When traversing a clear path heading UP', () => {
  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(5, 1);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(5, 10));
  });
});

describe('When traversing a clear path headed DOWN', () => {
  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(5, 10);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(5, 1));
  });
});

describe('When traversing a clear path headed RIGHT', () => {
  const gameGrid = buildGameGrid(dimensionX, dimensionY, 0);
  const rayEntryPoint = new Point(1, 5);

  it('should exit on the opposite side of the grid', () => {
    const rayTraceResult = traceRay(rayEntryPoint, gameGrid);

    expect(rayTraceResult.finalPoint).toEqual(new Point(10, 5));
  });
});

describe('When traversing a clear path headed LEFT', () => {
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
    expect(rayTraceResult.isHit).toEqual(true);
  });
});

describe('When atom in upper-left', () => {
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

describe('When atom in upper-right', () => {
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

describe('When atom is in upper-left and upper-right', () => {
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

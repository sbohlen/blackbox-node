import { Point } from './point';

export abstract class GridElement {
  constructor(readonly point: Point) {}

  abstract toDisplayString(): string;
}

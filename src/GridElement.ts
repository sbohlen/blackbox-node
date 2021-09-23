import { Point } from './point';

export abstract class GridElement {
  constructor(readonly point: Point) {}

  useDebugDisplay: boolean = false;

  toDisplayString(): string {
    if (this.useDebugDisplay) {
      return this.buildDebugDisplayString();
    }

    return this.buildDefaultDisplayString();
  }

  buildDebugDisplayString(): string {
    const valueToDisplay =
      this.buildDefaultDisplayString() === ''
        ? ''
        : `:${this.buildDefaultDisplayString()}`;
    return `[${this.point.toIdString()}]${valueToDisplay}`;
  }

  abstract buildDefaultDisplayString(): string;
}

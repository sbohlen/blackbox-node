import { Point } from './point';

export abstract class GridElement {
  constructor(readonly point: Point) {}

  useAlternateDisplayString: boolean = false;

  toDisplayString(): string {
    if (this.useAlternateDisplayString) {
      return this.buildAlternateDisplayString();
    }

    return this.buildDefaultDisplayString();
  }

  buildAlternateDisplayString(): string {
    const valueToDisplay =
      this.buildDefaultDisplayString() === ''
        ? ''
        : `:${this.buildDefaultDisplayString()}`;
    return `[${this.point.toIdString()}]${valueToDisplay}`;
  }

  abstract buildDefaultDisplayString(): string;
}

import { CellDisplayString } from './CellDisplayString';
import { GridElement } from './GridElement';
import { Point } from './point';

export class GridAnnotation extends GridElement {
  annotation: string = CellDisplayString.empty;

  constructor(readonly point: Point) {
    super(point);
  }

  buildDefaultDisplayString(): string {
    return this.annotation;
  }
}

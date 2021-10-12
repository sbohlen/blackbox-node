import { AnnotationDisplayString } from './AnnotationDisplayString';
import { GridElement } from './GridElement';
import { Point } from './point';

export class GridAnnotation extends GridElement {
  annotation: string = AnnotationDisplayString.empty;

  constructor(readonly point: Point) {
    super(point);
  }

  buildDefaultDisplayString(): string {
    return this.annotation;
  }
}

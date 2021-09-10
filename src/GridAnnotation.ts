import { Point } from './point';

export class GridAnnotation {
  annotation: string;

  constructor(readonly point: Point) {}
}

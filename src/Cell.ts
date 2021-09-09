import { Point } from './point';

export class Cell {
  constructor(readonly point: Point, public hasAtom: boolean = false) {}
}

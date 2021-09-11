import { Point } from './point';

export class Cell {
  constructor(public point: Point, public hasAtom: boolean = false) {}
}

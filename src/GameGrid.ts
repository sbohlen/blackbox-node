import { Cell } from './Cell';

export class GameGrid extends Map<string, Cell> {
  get minX(): number {
    return Math.min.apply(
      null,
      [...this.values()].map((v) => v.point.X),
    );
  }

  get minY(): number {
    return Math.min.apply(
      null,
      [...this.values()].map((v) => v.point.Y),
    );
  }

  get maxX(): number {
    return Math.max.apply(
      null,
      [...this.values()].map((v) => v.point.X),
    );
  }

  get maxY(): number {
    return Math.max.apply(
      null,
      [...this.values()].map((v) => v.point.Y),
    );
  }
}

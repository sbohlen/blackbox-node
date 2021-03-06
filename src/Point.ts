import { Coordinate } from './Coordinate';

export class Point {
  private readonly x: Coordinate;

  private readonly y: Coordinate;

  constructor(x: number, y: number) {
    this.x = new Coordinate(x);
    this.y = new Coordinate(y);
  }

  get X(): number {
    return this.x.Value;
  }

  get Y(): number {
    return this.y.Value;
  }

  equals(other: Point): boolean {
    return this.X === other.X && this.Y === other.Y;
  }

  toIdString(): string {
    return `${this.X},${this.Y}`;
  }
}

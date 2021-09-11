import { Cell } from './Cell';
import { rotatePoint } from './rotatePoint';

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

  rotate(angleDegreesClockwise: number) {
    // get all the existing keys
    const originalKeys = Array.from(this.keys());

    // create a new temp map to hold the rotated values
    const tempMap = new Map<string, Cell>();

    // rotate each existing point/cell and add to temp map
    for (let index = 0; index < originalKeys.length; index += 1) {
      const key = originalKeys[index];
      const currentCell = this.get(key);
      const newPoint = rotatePoint(currentCell.point, angleDegreesClockwise);
      currentCell.point = newPoint;
      tempMap.set(newPoint.toIdString(), currentCell);
    }

    // clear out the original map to make room for all new entries
    this.clear();

    // get all the temp keys
    const tempKeys = Array.from(tempMap.keys());

    // add each temp entry to the original (this) map
    for (let index = 0; index < tempKeys.length; index += 1) {
      const key = tempKeys[index];
      const cell = tempMap.get(key);
      this.set(cell.point.toIdString(), cell);
    }
  }
}

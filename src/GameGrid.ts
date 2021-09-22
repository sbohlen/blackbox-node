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

  /**
   *
   * Given coordinates in ONE of the following cartesian quadrants,
   * rotate all points back into their original (upper-right) quadrant.
   *
   * Because all prior possible prior rotations in this system would have been about the [0,0] origin,
   * its possible to infer from evaluating the minimum X and minimum Y of the collection in which of
   * the four possible quadrants 100% of the points are located at any given moment.  From that we can
   * derive the necessary counter-rotation needed to be applied to return all points back to their original
   * (desired) quadrant (e.g., the upper-right, [+X,+Y] region).
   *
   *           |
   *   [-X,+Y] |  [+X,+Y]
   *           |
   *  ---------+--------- (origin/center is 0,0)
   *           |
   *  [-X,-Y]  |  [+X,-Y]
   *           |
   *
   *
   */

  resetRotation() {
    const angle: number = this.currentResetRotationAngle();

    // if we have a non-zero angle, apply it
    // (a no-op if we're already in desired state/rotation and there's no  work to do)
    if (angle !== 0) {
      this.rotate(angle);
    }
  }

  currentRotationAngle(): number {
    // this is the **inverse** of the counter-rotation angle
    return this.currentResetRotationAngle() * -1;
  }

  // angle necessary to rotate all points about origin (0,0) to return to
  //  desired [+x,+Y] coordinate range
  currentResetRotationAngle(): number {
    let angle: number = 0;

    // because its (semi-)expensive to re-calc minX/minY for each test case,
    //   retrieve the values ONCE for re-use in each if(...) block
    const minimumX = this.minX;
    const minimumY = this.minY;

    // if we're in the Upper-Right quadrant
    // (note: this statement offered for comprehensiveness only
    //   because in this case we need not apply a counter-rotation)
    if (minimumX > 0 && minimumY > 0) {
      angle = 0;
    }

    // if we're in the Upper-Left quadrant
    if (minimumX < 0 && minimumY > 0) {
      angle = 90;
    }

    // if we're in the Lower-Left quadrant
    if (minimumX < 0 && minimumY < 0) {
      angle = 180;
    }

    // if we're in the Lower-Right quadrant
    if (minimumX > 0 && minimumY < 0) {
      angle = 270;
    }

    return angle;
  }
}

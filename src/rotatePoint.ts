import { Point } from './point';

/**
 *
 *
 * @export
 * @param {number} x coordinate of point
 * @param {number} y coordinate of point
 * @param {number} angle in degrees *clockwise*
 * @param {number} [centerX=0] x coordinate to rotate about (optional, defaults to 0)
 * @param {number} [centerY=0] y coordinate to rotate about (optional, defaults to 0)
 * @return {*}  { x: number; y: number } coordinates of rotated point
 */
function rotate(
  x: number,
  y: number,
  angle: number,
  centerX: number = 0,
  centerY: number = 0,
): { x: number; y: number } {
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = cos * (x - centerX) + sin * (y - centerY) + centerX;
  const ny = cos * (y - centerY) - sin * (x - centerX) + centerY;
  return { x: nx, y: ny };
}

export function rotatePoint(
  sourcePoint: Point,
  rotationAngleClockwise: number,
): Point {
  const newCoords = rotate(
    sourcePoint.X,
    sourcePoint.Y,
    rotationAngleClockwise,
  );
  return new Point(Math.round(newCoords.x), Math.round(newCoords.y));
}

import { GridAnnotation } from './GridAnnotation';
import { GridAnnotations } from './GridAnnotations';
import { Point } from './point';

export function buildGridAnnotations(
  dimensionX: number,
  dimensionY: number,
): GridAnnotations {
  const annotations = new GridAnnotations();

  // create top and bottom annotations
  for (let i = 1; i <= dimensionX; i += 1) {
    const bottomPoint = new Point(i, 0);
    const topPoint = new Point(i, dimensionY + 1);
    annotations.set(bottomPoint.toIdString(), new GridAnnotation(bottomPoint));
    annotations.set(topPoint.toIdString(), new GridAnnotation(topPoint));
  }

  // create left and right annotations
  for (let i = 1; i <= dimensionY; i += 1) {
    const leftPoint = new Point(0, i);
    const rightPoint = new Point(dimensionX + 1, i);
    annotations.set(leftPoint.toIdString(), new GridAnnotation(leftPoint));
    annotations.set(rightPoint.toIdString(), new GridAnnotation(rightPoint));
  }

  return annotations;
}

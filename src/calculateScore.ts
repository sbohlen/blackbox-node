import { AnnotationDisplayString } from './AnnotationDisplayString';
import { GridAnnotation } from './GridAnnotation';
import { GridAnnotations } from './GridAnnotations';

const missedGuessPenalty = 5;

function isReflect(annotation: GridAnnotation): boolean {
  return (
    annotation.toDisplayString() === AnnotationDisplayString.reflectTop ||
    annotation.toDisplayString() === AnnotationDisplayString.reflectBottom ||
    annotation.toDisplayString() === AnnotationDisplayString.reflectLeft ||
    annotation.toDisplayString() === AnnotationDisplayString.reflectRight
  );
}

function getHitRayCount(annotations: GridAnnotations): number {
  return Array.from(annotations.values()).filter(
    (anno) => anno.toDisplayString() === AnnotationDisplayString.hit,
  ).length;
}

function getReflectRayCount(annotations: GridAnnotations): number {
  return Array.from(annotations.values()).filter((anno) => isReflect(anno))
    .length;
}

function getMissedRayCount(
  annotations: GridAnnotations,
  hitRayCount: number,
  reflectRayCount: number,
): number {
  const usedAnnotationsCount = Array.from(annotations.values()).filter(
    (anno) => anno.toDisplayString() !== AnnotationDisplayString.empty,
  ).length;

  return usedAnnotationsCount - hitRayCount - reflectRayCount;
}

export function calculateScore(
  annotations: GridAnnotations,
  incorrectGuessCount: number,
): number {
  const hitRayCount = getHitRayCount(annotations);
  const reflectRayCount = getReflectRayCount(annotations);
  const missedRayCount = getMissedRayCount(
    annotations,
    hitRayCount,
    reflectRayCount,
  );

  const score =
    missedRayCount +
    hitRayCount +
    reflectRayCount +
    incorrectGuessCount * missedGuessPenalty;

  return score;
}

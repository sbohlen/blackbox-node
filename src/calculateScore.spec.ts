import { AnnotationDisplayString } from './AnnotationDisplayString';
import { calculateScore } from './calculateScore';
import { GridAnnotation } from './GridAnnotation';
import { GridAnnotations } from './GridAnnotations';
import { Point } from './point';

function buildAnnotations(
  dimensionX: number,
  dimensionY: number,
): GridAnnotations {
  const annotations = new GridAnnotations();

  for (let x = 0; x < dimensionX; x += 1) {
    for (let y = 0; y < dimensionY; y += 1) {
      annotations.set(`${x},${y}`, new GridAnnotation(new Point(x, y)));
    }
  }
  return annotations;
}

describe('When all empty annotations', () => {
  const annotations = buildAnnotations(10, 10);
  it('should return expected score', () => {
    expect(calculateScore(annotations, 0)).toEqual(0);
  });
});

describe.each`
  testCaseName        | annotationValue
  ${'HIT'}            | ${AnnotationDisplayString.hit}
  ${'REFLECT-top'}    | ${AnnotationDisplayString.reflectTop}
  ${'REFLECT-bottom'} | ${AnnotationDisplayString.reflectBottom}
  ${'REFLECT-left'}   | ${AnnotationDisplayString.reflectLeft}
  ${'REFLECT-right'}  | ${AnnotationDisplayString.reflectRight}
`('When annotations are present', ({ testCaseName, annotationValue }) => {
  const annotations = buildAnnotations(10, 10);

  annotations.get('1,1').annotation = annotationValue;
  annotations.get('1,2').annotation = annotationValue;
  annotations.get('1,3').annotation = annotationValue;

  it(`should return expected score for ${testCaseName}`, () => {
    expect(calculateScore(annotations, 0)).toEqual(3);
  });
});

describe('When all annotations are misses', () => {
  const annotations = buildAnnotations(10, 10);

  annotations.get('1,1').annotation = 'A';
  annotations.get('1,2').annotation = 'B';
  annotations.get('1,3').annotation = 'C';

  it('should return expected score', () => {
    expect(calculateScore(annotations, 0)).toEqual(3);
  });
});

describe('When all empty annotations and incorrect guesses are present', () => {
  const annotations = buildAnnotations(10, 10);

  it('should return expected score', () => {
    expect(calculateScore(annotations, 2)).toEqual(10);
  });
});

describe('When a mixture of annotations and incorrect guesses are present', () => {
  const annotations = buildAnnotations(10, 10);

  annotations.get('1,1').annotation = 'A';
  annotations.get('1,2').annotation = 'B';
  annotations.get('1,3').annotation = 'C';
  annotations.get('1,4').annotation = AnnotationDisplayString.hit;
  annotations.get('1,5').annotation = AnnotationDisplayString.hit;
  annotations.get('1,6').annotation = AnnotationDisplayString.reflectLeft;
  annotations.get('1,7').annotation = AnnotationDisplayString.reflectTop;

  it('should return expected score', () => {
    expect(calculateScore(annotations, 1)).toEqual(12);
  });
});

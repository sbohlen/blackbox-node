import { AnnotationDisplayString } from './AnnotationDisplayString';
import { BoardEdge } from './BoardEdge';
import { GameBoard } from './GameBoard';
import { Point } from './point';
import { render } from './renderGameBoard';
import { utilityClearAllAtomsFromBoard } from './utilityClearAllAtomsFromBoard';

describe.each`
  entryPointX | entryPointY | exitPointX | exitPointY | entryCellIndex | entryBoardEdge
  ${2}        | ${0}        | ${2}       | ${11}      | ${2}           | ${BoardEdge.Bottom}
  ${2}        | ${11}       | ${2}       | ${0}       | ${2}           | ${BoardEdge.Top}
  ${0}        | ${2}        | ${11}      | ${2}       | ${2}           | ${BoardEdge.Left}
  ${11}       | ${2}        | ${0}       | ${2}       | ${2}           | ${BoardEdge.Right}
`(
  'When shooting rays that are a STRAIGHT MISS',
  ({
    entryPointX,
    entryPointY,
    exitPointX,
    exitPointY,
    entryCellIndex,
    entryBoardEdge,
  }) => {
    const dimensionX = 10;
    const dimensionY = 10;
    const atomCount = 1;

    const atomPoint = new Point(5, 5);

    const entryPoint = new Point(entryPointX, entryPointY);
    const exitPoint = new Point(exitPointX, exitPointY);

    const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

    utilityClearAllAtomsFromBoard(gameBoard);

    // set single atom at expected location
    gameBoard.GameGrid.get(atomPoint.toIdString()).hasAtom = true;

    // send the ray that will NOT be influenced by the single atom
    gameBoard.sendRay(entryBoardEdge, entryCellIndex);

    it('should set entry annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(
          entryPoint.toIdString(),
        ).toDisplayString(),
      ).toEqual('A');
    });

    it('should set exit annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(exitPoint.toIdString()).toDisplayString(),
      ).toEqual('A');
    });
  },
);

describe.each`
  entryPointX | entryPointY | exitPointX | exitPointY | entryCellIndex | entryBoardEdge
  ${6}        | ${0}        | ${11}      | ${4}       | ${6}           | ${BoardEdge.Bottom}
  ${6}        | ${11}       | ${11}      | ${6}       | ${6}           | ${BoardEdge.Top}
  ${0}        | ${6}        | ${4}       | ${11}      | ${6}           | ${BoardEdge.Left}
  ${11}       | ${6}        | ${6}       | ${11}      | ${6}           | ${BoardEdge.Right}
`(
  'When shooting rays that are a DEFLECTED MISS',
  ({
    entryPointX,
    entryPointY,
    exitPointX,
    exitPointY,
    entryCellIndex,
    entryBoardEdge,
  }) => {
    const dimensionX = 10;
    const dimensionY = 10;
    const atomCount = 1;

    const atomPoint = new Point(5, 5);

    const entryPoint = new Point(entryPointX, entryPointY);
    const exitPoint = new Point(exitPointX, exitPointY);

    const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

    utilityClearAllAtomsFromBoard(gameBoard);

    // set single atom at expected location
    gameBoard.GameGrid.get(atomPoint.toIdString()).hasAtom = true;

    // send the ray that will NOT be influenced by the single atom
    gameBoard.sendRay(entryBoardEdge, entryCellIndex);

    it('should set entry annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(
          entryPoint.toIdString(),
        ).toDisplayString(),
      ).toEqual('A');
    });

    it('should set exit annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(exitPoint.toIdString()).toDisplayString(),
      ).toEqual('A');
    });
  },
);

describe.each`
  entryPointX | entryPointY | entryCellIndex | entryBoardEdge
  ${5}        | ${0}        | ${5}           | ${BoardEdge.Bottom}
  ${5}        | ${11}       | ${5}           | ${BoardEdge.Top}
  ${0}        | ${5}        | ${5}           | ${BoardEdge.Left}
  ${11}       | ${5}        | ${5}           | ${BoardEdge.Right}
`(
  'When shooting rays that are a HIT',
  ({ entryPointX, entryPointY, entryCellIndex, entryBoardEdge }) => {
    const dimensionX = 10;
    const dimensionY = 10;
    const atomCount = 1;

    const atomPoint = new Point(5, 5);

    const entryPoint = new Point(entryPointX, entryPointY);

    const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

    utilityClearAllAtomsFromBoard(gameBoard);

    // set single atom at expected location
    gameBoard.GameGrid.get(atomPoint.toIdString()).hasAtom = true;

    // send the ray that will HIT the single atom
    gameBoard.sendRay(entryBoardEdge, entryCellIndex);

    it('should set entry annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(
          entryPoint.toIdString(),
        ).toDisplayString(),
      ).toEqual(AnnotationDisplayString.hit);
    });
  },
);

describe.each`
  entryPointX | entryPointY | entryCellIndex | entryBoardEdge      | expectedAnnotation
  ${5}        | ${0}        | ${5}           | ${BoardEdge.Bottom} | ${AnnotationDisplayString.reflectBottom}
  ${5}        | ${11}       | ${5}           | ${BoardEdge.Top}    | ${AnnotationDisplayString.reflectTop}
  ${0}        | ${5}        | ${5}           | ${BoardEdge.Left}   | ${AnnotationDisplayString.reflectLeft}
  ${11}       | ${5}        | ${5}           | ${BoardEdge.Right}  | ${AnnotationDisplayString.reflectRight}
`(
  'When shooting rays that are a REFLECT',
  ({
    entryPointX,
    entryPointY,
    entryCellIndex,
    entryBoardEdge,
    expectedAnnotation,
  }) => {
    const dimensionX = 10;
    const dimensionY = 10;
    const atomCount = 1;

    // setup necessary atoms to reflect
    const atomPoints = new Array<Point>();
    atomPoints.push(new Point(4, 4));
    atomPoints.push(new Point(6, 4));
    atomPoints.push(new Point(4, 6));
    atomPoints.push(new Point(6, 6));

    const entryPoint = new Point(entryPointX, entryPointY);

    const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

    utilityClearAllAtomsFromBoard(gameBoard);

    // set all atoms at expected location
    atomPoints.forEach((ap) => {
      gameBoard.GameGrid.get(ap.toIdString()).hasAtom = true;
    });

    // send the ray that will be REFLECTED by the collection of atoms
    gameBoard.sendRay(entryBoardEdge, entryCellIndex);

    it('should set entry annotation correctly', () => {
      expect(
        gameBoard.GridAnnotations.get(
          entryPoint.toIdString(),
        ).toDisplayString(),
      ).toEqual(expectedAnnotation);
    });
  },
);

describe('When firing all possible rays on an empty game board', () => {
  const dimensionX = 10;
  const dimensionY = 10;
  const atomCount = 1;

  // counter to track the number of rays actually fired
  let expectedRayCount: number = 0;

  // make board
  const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

  utilityClearAllAtomsFromBoard(gameBoard);

  // iterate each annotation slot (traverse the X axis)
  for (let x = 1; x <= dimensionX; x += 1) {
    expectedRayCount += 1;
    gameBoard.sendRay(BoardEdge.Bottom, x);

    // if the annotation isn't already occupied, run a trace from it
    if (
      gameBoard.GridAnnotations.get(`${x},11`).toDisplayString() ===
      AnnotationDisplayString.empty
    ) {
      expectedRayCount += 1;
      gameBoard.sendRay(BoardEdge.Top, x);
    }
  }

  // iterate each annotation slot (traverse the Y axis)
  for (let y = 1; y <= dimensionY; y += 1) {
    expectedRayCount += 1;
    gameBoard.sendRay(BoardEdge.Left, y);
    // if the annotation isn't already occupied, run a trace from it
    if (
      gameBoard.GridAnnotations.get(`11,${y}`).toDisplayString() ===
      AnnotationDisplayString.empty
    ) {
      expectedRayCount += 1;
      gameBoard.sendRay(BoardEdge.Right, y);
    }
  }

  const expectedHorizontalAnnotationSequence = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
  ];

  const expectedVerticalAnnotationSequence = [
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
  ];

  it('should update all expected annotation values', () => {
    // validate BOTTOM row of annotations
    for (let i = 1; i <= 10; i += 1) {
      expect(gameBoard.GridAnnotations.get(`${i},0`).toDisplayString()).toEqual(
        expectedHorizontalAnnotationSequence[i - 1],
      );
    }

    // validate TOP row of annotations
    for (let i = 1; i <= 10; i += 1) {
      expect(
        gameBoard.GridAnnotations.get(`${i},11`).toDisplayString(),
      ).toEqual(expectedHorizontalAnnotationSequence[i - 1]);
    }

    // validate LEFT column of annotations
    for (let i = 1; i <= 10; i += 1) {
      expect(gameBoard.GridAnnotations.get(`0,${i}`).toDisplayString()).toEqual(
        expectedVerticalAnnotationSequence[i - 1],
      );
    }

    // validate RIGHT column of annotations
    for (let i = 1; i <= 10; i += 1) {
      expect(
        gameBoard.GridAnnotations.get(`11,${i}`).toDisplayString(),
      ).toEqual(expectedVerticalAnnotationSequence[i - 1]);
    }

    // next steps are to provide visual validation of results
    gameBoard.revealAll();

    const output = render(gameBoard);

    // eslint-disable-next-line no-console
    console.log(output.toString());
  });

  it('should track correct count of rays fired', () => {
    expect(gameBoard.getGameStatistics().rayCount).toEqual(expectedRayCount);
  });
});

function buildExpectedAnnotationValuesMap(): Map<string, string> {
  const values = new Map<string, string>();
  // set bottom row annotation values
  values.set('1,0', 'A');
  values.set('2,0', 'B');
  values.set('3,0', 'C');
  values.set('4,0', AnnotationDisplayString.hit);
  values.set('5,0', AnnotationDisplayString.reflectBottom);
  values.set('6,0', AnnotationDisplayString.hit);
  values.set('7,0', 'D');
  values.set('8,0', 'E');
  values.set('9,0', AnnotationDisplayString.hit);
  values.set('10,0', 'F');

  // set left column annotation values
  values.set('0,1', 'E');
  values.set('0,2', AnnotationDisplayString.hit);
  values.set('0,3', 'C');
  values.set('0,4', AnnotationDisplayString.hit);
  values.set('0,5', 'G');
  values.set('0,6', 'J');
  values.set('0,7', 'K');
  values.set('0,8', 'L');
  values.set('0,9', AnnotationDisplayString.hit);
  values.set('0,10', AnnotationDisplayString.hit);

  // set top row annotation values
  values.set('1,11', 'A');
  values.set('2,11', 'B');
  values.set('3,11', 'G');
  values.set('4,11', AnnotationDisplayString.reflectTop);
  values.set('5,11', AnnotationDisplayString.hit);
  values.set('6,11', AnnotationDisplayString.reflectTop);
  values.set('7,11', 'H');
  values.set('8,11', 'D');
  values.set('9,11', AnnotationDisplayString.hit);
  values.set('10,11', 'I');

  // set right column annotation values
  values.set('11,1', 'F');
  values.set('11,2', AnnotationDisplayString.hit);
  values.set('11,3', 'I');
  values.set('11,4', AnnotationDisplayString.hit);
  values.set('11,5', 'H');
  values.set('11,6', 'J');
  values.set('11,7', 'K');
  values.set('11,8', 'L');
  values.set('11,9', AnnotationDisplayString.hit);
  values.set('11,10', AnnotationDisplayString.hit);

  return values;
}

describe('When firing all possible rays on a non-empty game board', () => {
  /**
   *
   *            A    B   G     v    !    v    H    D    !     I
   *            1    2   3     4    5    6    7    8    9    10
   *         +----+----+----+----+----+----+----+----+----+----+
   *    ! 10 |    |    |    |    | X  |    |    |    |    |    | 10 !
   *         +----+----+----+----+----+----+----+----+----+----+
   *    !  9 |    |    |    |    |    |    |    |    |    |    | 9  !
   *         +----+----+----+----+----+----+----+----+----+----+
   *    L  8 |    |    |    |    |    |    |    |    |    |    | 8  L
   *         +----+----+----+----+----+----+----+----+----+----+
   *    K  7 |    |    |    |    |    |    |    |    |    |    | 7  K
   *         +----+----+----+----+----+----+----+----+----+----+
   *    J  6 |    |    |    |    |    |    |    |    |    |    | 6  J
   *         +----+----+----+----+----+----+----+----+----+----+
   *    G  5 |    |    |    |    |    |    |    |    |    |    | 5  H
   *         +----+----+----+----+----+----+----+----+----+----+
   *    !  4 |    |    |    | X  |    |  X |    |    |    |    | 4  !
   *         +----+----+----+----+----+----+----+----+----+----+
   *    C  3 |    |    |    |    |    |    |    |    |    |    | 3  I
   *         +----+----+----+----+----+----+----+----+----+----+
   *    !  2 |    |    |    |    |    |    |    |    | X  |    | 2  !
   *         +----+----+----+----+----+----+----+----+----+----+
   *    E  1 |    |    |    |    |    |    |    |    |    |    | 1  F
   *         +----+----+----+----+----+----+----+----+----+----+
   *            1    2    3    4   5    6     7    8    9   10
   *            A    B    C    !   ^    !     D    E    !    F
   *
   *      Key
   *      ----------------------------------------
   *         X --> cell containing an atom
   *   ^,<,>,v --> reflected ray annotation
   *         ! --> ray that hits an atom
   *       A-Z --> entry/exit path pair
   *
   */

  const expectedAnnotationValues: Map<string, string> =
    buildExpectedAnnotationValuesMap();

  const dimensionX = 10;
  const dimensionY = 10;
  const atomCount = 1;

  // counter to track the number of rays actually fired
  let expectedRayCount: number = 0;

  // make board
  const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

  // remove the randomly-generated atom(s) from the board
  utilityClearAllAtomsFromBoard(gameBoard);

  // set atoms in a predictable/known cell
  gameBoard.GameGrid.get('9,2').hasAtom = true;
  gameBoard.GameGrid.get('4,4').hasAtom = true;
  gameBoard.GameGrid.get('6,4').hasAtom = true;
  gameBoard.GameGrid.get('5,10').hasAtom = true;

  // send a ray from each annotation along the bottom edge of the board
  for (let x = 1; x <= dimensionX; x += 1) {
    // if the annotation isn't already occupied, send a ray from it
    if (
      gameBoard.GridAnnotations.get(`${x},0`).toDisplayString() ===
      AnnotationDisplayString.empty
    ) {
      expectedRayCount += 1;
      gameBoard.sendRay(BoardEdge.Bottom, x);
    }
  }

  // send a ray from each annotation along the top edge of the board
  for (let x = 1; x <= dimensionX; x += 1) {
    // if the annotation isn't already occupied, send a ray from it
    if (
      gameBoard.GridAnnotations.get(`${x},11`).toDisplayString() ===
      AnnotationDisplayString.empty
    ) {
      expectedRayCount += 1;
      gameBoard.sendRay(BoardEdge.Top, x);
    }
  }

  // send a ray from each annotation along the left edge of the board
  for (let y = 1; y <= dimensionY; y += 1) {
    // if the annotation isn't already occupied, send a ray from it
    if (
      gameBoard.GridAnnotations.get(`0,${y}`).toDisplayString() ===
      AnnotationDisplayString.empty
    ) {
      expectedRayCount += 1;
      gameBoard.sendRay(BoardEdge.Left, y);
    }
  }

  // send a ray from each annotation along the right edge of the board
  for (let y = 1; y <= dimensionY; y += 1) {
    // if the annotation isn't already occupied, send a ray from it
    if (
      gameBoard.GridAnnotations.get(`11,${y}`).toDisplayString() ===
      AnnotationDisplayString.empty
    ) {
      expectedRayCount += 1;
      gameBoard.sendRay(BoardEdge.Right, y);
    }
  }

  it('should update all annotations with non-empty value', () => {
    Array.from(gameBoard.GridAnnotations.values()).forEach((anno) =>
      expect(anno.toDisplayString()).not.toEqual(AnnotationDisplayString.empty),
    );
  });

  // for each annotation, lookup its expected value and compare
  it('should update all annotations with expected values', () => {
    Array.from(gameBoard.GridAnnotations.values()).forEach((anno) =>
      expect(anno.toDisplayString()).toEqual(
        expectedAnnotationValues.get(anno.point.toIdString()),
      ),
    );
  });

  it('should track correct count of rays fired', () => {
    expect(gameBoard.getGameStatistics().rayCount).toEqual(expectedRayCount);
  });
});

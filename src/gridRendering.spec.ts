import { buildGameGrid } from './buildGameGrid';
import { Cell } from './Cell';
import { Point } from './point';

const Table = require('cli-table');

describe('When rendering table', () => {
  const dimensionX = 10;
  const dimensionY = 10;
  const atomCount = 5;

  it('should render', () => {
    const table = new Table({
      chars: {
        top: '═',
        'top-mid': '╤',
        'top-left': '╔',
        'top-right': '╗',
        bottom: '═',
        'bottom-mid': '╧',
        'bottom-left': '╚',
        'bottom-right': '╝',
        left: '║',
        'left-mid': '╟',
        mid: '─',
        'mid-mid': '┼',
        right: '║',
        'right-mid': '╢',
        middle: '│',
      },
    });

    const gameGrid = buildGameGrid(dimensionX, dimensionY, atomCount);

    for (let y = dimensionY; y >= 1; y -= 1) {
      const row: Array<string> = new Array<string>();
      for (let x = 1; x <= dimensionX; x += 1) {
        const point: Point = new Point(x, y);
        row.push(gameGrid.get(point.toIdString()).point.toIdString());
      }

      table.push(row);
    }

    // table.push(['foo', 'bar', 'baz'], ['frob', 'bar', 'quuz']);

    // eslint-disable-next-line no-console
    console.log(table.toString());
  });
});

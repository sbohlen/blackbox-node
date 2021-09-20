import { buildGameGrid } from './buildGameGrid';
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
      colAligns: Array(dimensionX + 2).fill('middle'),
    });

    const gameGrid = buildGameGrid(dimensionX, dimensionY, atomCount);

    for (let y = dimensionY + 1; y >= 0; y -= 1) {
      const row: Array<string> = new Array<string>();

      if (y === 0 || y > dimensionY) {
        for (let x = 0; x <= dimensionX + 1; x += 1) {
          if (x === 0) {
            row.push('');
          } else if (x <= dimensionX) {
            row.push(x.toString());
          } else {
            row.push('');
          }
        }
      }

      if (y <= dimensionY && y > 0) {
        row.push(y.toString());

        for (let x = 1; x <= dimensionX; x += 1) {
          const point: Point = new Point(x, y);
          row.push(`[${gameGrid.get(point.toIdString()).point.toIdString()}]`);
        }

        row.push(y.toString());
      }

      table.push(row);
    }

    // table.push(['foo', 'bar', 'baz'], ['frob', 'bar', 'quuz']);

    // eslint-disable-next-line no-console
    console.log(table.toString());
  });
});

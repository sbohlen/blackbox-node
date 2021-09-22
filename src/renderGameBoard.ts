import { GameBoard } from './GameBoard';
import { Point } from './point';

const Table = require('cli-table');

export function render(gameBoard: GameBoard) {
  const gameBoardToRender = new Table({
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
    colAligns: Array(gameBoard.GameGrid.maxX + 4).fill('middle'),
  });

  // for each row in the entire board from TOP to BOTTOM...
  for (
    let currentRowIndex = gameBoard.GameGrid.maxY + 2;
    currentRowIndex >= gameBoard.GameGrid.minY - 2;
    currentRowIndex -= 1
  ) {
    const row: Array<string> = new Array<string>();

    // ********** process outer-most TOP and BOTTOM rows
    if (
      currentRowIndex === gameBoard.GameGrid.maxY + 2 ||
      currentRowIndex === gameBoard.GameGrid.minY - 2
    ) {
      // fill all columns
      for (
        let currentColumnIndex = gameBoard.GameGrid.minX - 2;
        currentColumnIndex <= gameBoard.GameGrid.maxX + 2;
        currentColumnIndex += 1
      ) {
        // if we're within the range of the playable grid
        if (
          currentColumnIndex >= gameBoard.GameGrid.minX &&
          currentColumnIndex <= gameBoard.GameGrid.maxX
        ) {
          // ...display the index
          row.push(currentColumnIndex.toString());
        } else {
          // ...otherwise display empty string
          row.push('');
        }
      }
    }
    // ***********************************************

    // ********** process TOP and BOTTOM annotation rows
    if (
      currentRowIndex === gameBoard.GameGrid.maxY + 1 ||
      currentRowIndex === gameBoard.GameGrid.minY - 1
    ) {
      // fill all columns
      for (
        let currentColumnIndex = gameBoard.GameGrid.minX - 2;
        currentColumnIndex <= gameBoard.GameGrid.maxX + 2;
        currentColumnIndex += 1
      ) {
        // if we're within the range of the playable grid
        if (
          currentColumnIndex >= gameBoard.GameGrid.minX &&
          currentColumnIndex <= gameBoard.GameGrid.maxX
        ) {
          // ...display the annotation
          row.push(`Anno ${currentColumnIndex.toString()}`);
        } else {
          // ...otherwise display empty string
          row.push('');
        }
      }
    }
    // ***********************************************

    // ********** process rows containing playable grid
    if (
      currentRowIndex <= gameBoard.GameGrid.maxY &&
      currentRowIndex >= gameBoard.GameGrid.minY
    ) {
      // fill all columns
      for (
        let currentColumnIndex = gameBoard.GameGrid.minX - 2;
        currentColumnIndex <= gameBoard.GameGrid.maxX + 2;
        currentColumnIndex += 1
      ) {
        // if we're within the range of the playable grid
        if (
          currentColumnIndex >= gameBoard.GameGrid.minX &&
          currentColumnIndex <= gameBoard.GameGrid.maxX
        ) {
          // ...display the coordinate
          const point = new Point(currentColumnIndex, currentRowIndex);
          row.push(
            `[${gameBoard.GameGrid.get(
              point.toIdString(),
            ).point.toIdString()}]`,
          );
        }

        // if we're in the outermost LEFT or RIGHT column...
        if (
          currentColumnIndex === gameBoard.GameGrid.minX - 2 ||
          currentColumnIndex === gameBoard.GameGrid.maxX + 2
        ) {
          // ...display the index
          row.push(currentRowIndex.toString());
        }

        // if we're in the LEFT or RIGHT annotation column...
        if (
          currentColumnIndex === gameBoard.GameGrid.minX - 1 ||
          currentColumnIndex === gameBoard.GameGrid.maxX + 1
        ) {
          // ...display the index
          row.push(`Anno ${currentColumnIndex.toString()}`);
        }
      }
    }

    gameBoardToRender.push(row);
  }

  return gameBoardToRender;
}

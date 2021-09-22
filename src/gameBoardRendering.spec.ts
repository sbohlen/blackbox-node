import { GameBoard } from './GameBoard';
import { render } from './renderGameBoard';

describe('When rendering GameBoard', () => {
  const dimensionX = 10;
  const dimensionY = 10;
  const atomCount = 5;

  it('should render', () => {
    const gameBoard = new GameBoard(dimensionX, dimensionY, atomCount);

    gameBoard.addGuess(3, 3);

    gameBoard.enableAlternateDisplayOption();

    gameBoard.revealAll();

    const gameBoardToRender = render(gameBoard);

    // eslint-disable-next-line no-console
    console.log(gameBoardToRender.toString());
  });
});

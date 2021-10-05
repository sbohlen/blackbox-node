/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import * as Open from 'open';
import * as Prompts from 'prompts';
import { AnnotationDisplayString } from './AnnotationDisplayString';
import { BoardEdge } from './BoardEdge';
import { CellDisplayString } from './CellDisplayString';
import { GameBoard } from './GameBoard';
import { Point } from './point';
import { render } from './renderGameBoard';

let gameBoard: GameBoard;

enum TopMenuSelection {
  newGame = 'newGame',
  tutorial = 'tutorial',
  exit = 'exit',
}

enum GamePlayMenuSelection {
  sendRay = 'sendRay',
  addGuess = 'addGuess',
  removeGuess = 'removeGuess',
  revealBoard = 'revealBoard',
  showStatistics = 'showStatistics',
  abortGamePlay = 'abortGamePlay',
  renderBoard = 'renderBoard',
}

async function gamePlayPrompt(): Promise<GamePlayMenuResponse> {
  const response: any = await Prompts.prompt({
    type: 'select',
    name: 'value',
    message: 'select an option',
    choices: [
      {
        title: 'Show Board',
        description: 'Display the current game board',
        value: GamePlayMenuSelection.renderBoard,
      },
      {
        title: 'New Ray',
        description: 'Send a new Ray into the board',
        value: GamePlayMenuSelection.sendRay,
      },
      {
        title: 'Add Guess',
        description: 'Add a new Guess to the board',
        value: GamePlayMenuSelection.addGuess,
      },
      {
        title: 'Remove Guess',
        description: 'Remove an existing Guess from the board',
        value: GamePlayMenuSelection.removeGuess,
      },
      {
        title: 'Show Score',
        description: 'Display current game statistics/score',
        value: GamePlayMenuSelection.showStatistics,
      },
      {
        title: 'End Game',
        description: 'End the game and reveal the board',
        value: GamePlayMenuSelection.revealBoard,
      },
      {
        title: 'Cancel game',
        description: 'Abort the game and exit',
        value: GamePlayMenuSelection.abortGamePlay,
      },
    ],
  });

  return response;
}

async function topPrompt(): Promise<TopMenuResponse> {
  const response: any = await Prompts.prompt({
    type: 'select',
    name: 'value',
    message: 'select an option',
    choices: [
      {
        title: 'New Game',
        description: 'start a new game',
        value: TopMenuSelection.newGame,
      },
      {
        title: 'Tutorial',
        description: 'explore the tutorial',
        value: TopMenuSelection.tutorial,
      },
      {
        title: 'Exit/Quit',
        description: 'end the program',
        value: TopMenuSelection.exit,
      },
    ],
  });

  return response;
}

function getSendRayCellIndexMin(previous): number {
  if (
    previous.BoardEdge === BoardEdge.Bottom ||
    previous.BoardEdge === BoardEdge.Top
  ) {
    return gameBoard.GameGrid.minX;
  }

  return gameBoard.GameGrid.minY;
}

function getSendRayCellIndexMax(previous): number {
  if (
    previous.BoardEdge === BoardEdge.Bottom ||
    previous.BoardEdge === BoardEdge.Top
  ) {
    return gameBoard.GameGrid.maxX;
  }

  return gameBoard.GameGrid.maxY;
}

function validateGuessXCoordinate(value: number): boolean {
  return value >= gameBoard.GameGrid.minX && value <= gameBoard.GameGrid.maxX;
}

function validateGuessYCoordinate(value: number): boolean {
  return value >= gameBoard.GameGrid.minY && value <= gameBoard.GameGrid.maxY;
}

async function sendRayPrompt(): Promise<SendRayResponse> {
  const response: any = await Prompts.prompt([
    {
      type: 'select',
      name: 'boardEdge',
      message: 'Select edge of board from which to shoot the ray',
      hint: '',
      choices: [
        {
          title: 'Bottom',
          description: 'Shoot the ray from the BOTTOM edge of the board',
          value: BoardEdge.Bottom,
        },
        {
          title: 'Top',
          description: 'Shoot the ray from the TOP edge of the board',
          value: BoardEdge.Top,
        },
        {
          title: 'Left',
          description: 'Shoot the ray from the LEFT edge of the board',
          value: BoardEdge.Left,
        },
        {
          title: 'Right',
          description: 'Shoot the ray from the RIGHT edge of the board',
          value: BoardEdge.Right,
        },
      ],
    },
    {
      type: 'number',
      name: 'cellIndex',
      message:
        'Enter the number of the cell along the selected edge from which to shoot the ray:',
      min: getSendRayCellIndexMin,
      max: getSendRayCellIndexMax,
    },
  ]);

  return response;
}

async function addGuessPrompt(): Promise<AddGuessResponse> {
  const response: any = await Prompts.prompt([
    {
      type: 'number',
      name: 'x',
      message: 'X coordinate:',
      validate: validateGuessXCoordinate,
    },
    {
      type: 'number',
      name: 'y',
      message: 'Y coordinate:',
      validate: validateGuessYCoordinate,
    },
  ]);

  return response;
}

async function removeGuessPrompt(): Promise<RemoveGuessResponse> {
  const choices: Array<{ title: string; value: Point }> = gameBoard
    .getGuesses()
    .map((guess) => ({ title: guess.point.toIdString(), value: guess.point }));

  const response: any = await Prompts.prompt({
    type: 'select',
    name: 'point',
    message: 'Select the guess to remove',
    choices,
  });

  return response;
}

async function newGamePrompt(): Promise<NewGameResponse> {
  const response: any = await Prompts.prompt([
    {
      type: 'number',
      name: 'dimensionX',
      message: 'Enter horizontal dimension for the board (1-20):',
      min: 1,
      max: 20,
      initial: 8,
    },
    {
      type: 'number',
      name: 'dimensionY',
      message: 'Enter vertical dimension for the board (1-20):',
      min: 1,
      max: 20,
      initial: 8,
    },
    {
      type: 'number',
      name: 'atomCount',
      message: 'Enter number of atoms to hide on the board:',
      min: 1,
      initial: 4,
    },
  ]);

  return response;
}

function validateNewGameResponse(response: NewGameResponse): boolean {
  return response.atomCount <= response.dimensionX * response.dimensionY;
}

type AddGuessResponse = {
  x: number;
  y: number;
};

type RemoveGuessResponse = {
  point: Point;
};

type SendRayResponse = {
  boardEdge: BoardEdge;
  cellIndex: number;
};

type NewGameResponse = {
  dimensionX: number;
  dimensionY: number;
  atomCount: number;
};

type TopMenuResponse = {
  value: TopMenuSelection;
};

type GamePlayMenuResponse = {
  value: GamePlayMenuSelection;
};

function renderGameBoardActiveGameSymbolsKey() {
  console.log('\n');
  console.log(`Ray entry/exit pair | A-Z`);
  console.log(`Entry = HIT         | ${AnnotationDisplayString.hit}`);
  console.log(
    // eslint-disable-next-line max-len
    `Entry = REFLECT     | ${AnnotationDisplayString.reflectTop}, ${AnnotationDisplayString.reflectBottom}, ${AnnotationDisplayString.reflectLeft}, ${AnnotationDisplayString.reflectRight}`,
  );
  console.log(`Current Guesses     | ${CellDisplayString.guess}`);
  console.log('\n');
}

function renderGameBoard() {
  console.log(`${render(gameBoard).toString()}\n`);
  renderGameBoardActiveGameSymbolsKey();
}

function renderGameBoardRevealSymbolsKey() {
  console.log('\nRevealed Board Symbols');
  console.log('----------------|------');
  console.log(`Correct Guess   | ${CellDisplayString.correctGuess}`);
  console.log(`Incorrect Guess | ${CellDisplayString.incorrectGuess}`);
  console.log(`Missed Target   | ${CellDisplayString.missedTarget}`);
}

function renderStatistics(isFinal: boolean): void {
  const stats = gameBoard.getGameStatistics();

  if (isFinal) {
    console.log('\n*****************\n** FINAL STATS **\n*****************');
    console.log(`Rays Fired: ${stats.rayCount}`);
    console.log(`Atoms Found: ${stats.correctGuessCount}/${stats.atomCount}`);
    console.log(`Correct Guesses: ${stats.correctGuessCount}`);
    console.log(`Incorrect Guesses: ${stats.incorrectGuessCount}`);
  } else {
    console.log(
      '\n*******************\n** CURRENT STATS ** \n*******************',
    );
    console.log(`Rays Fired: ${stats.rayCount}`);
    console.log(`Total Atoms: ${stats.atomCount}`);
    console.log(
      `Current Guesses: ${stats.correctGuessCount + stats.incorrectGuessCount}`,
    );
  }
}

async function handleRenderBoardGamePlayMenuSelection() {
  renderGameBoard();
}

async function handleSendRayGamePlayMenuSelection() {
  const response = await sendRayPrompt();

  gameBoard.sendRay(response.boardEdge, response.cellIndex);
  renderGameBoard();
}

async function handleAddGuessGamePlayMenuSelection() {
  const response = await addGuessPrompt();

  gameBoard.addGuess(response.x, response.y);
  renderGameBoard();
}

async function handleRemoveGuessGamePlayMenuSelection() {
  if (gameBoard.getGuesses().length > 0) {
    const response = await removeGuessPrompt();
    gameBoard.removeGuess(response.point.X, response.point.Y);
  } else {
    console.log('You have no guesses to remove!');
  }

  renderGameBoard();
}

async function handleRevealBoardGamePlayMenuSelection() {
  gameBoard.revealAll();
  renderGameBoard();
  renderGameBoardRevealSymbolsKey();
  renderStatistics(true);
}

async function handleShowStatisticsGamePlayMenuSelection() {
  renderStatistics(false);
}

async function handleAbortGamePlayGamePlayMenuSelection() {
  console.log('Canceling and returning to main menu...');
}

async function playGame(): Promise<void> {
  let gamePlayMenuSelection: GamePlayMenuResponse;

  while (
    gamePlayMenuSelection?.value !== GamePlayMenuSelection.abortGamePlay &&
    gamePlayMenuSelection?.value !== GamePlayMenuSelection.revealBoard
  ) {
    gamePlayMenuSelection = await gamePlayPrompt();

    switch (gamePlayMenuSelection.value) {
      case GamePlayMenuSelection.renderBoard:
        await handleRenderBoardGamePlayMenuSelection();
        break;
      case GamePlayMenuSelection.sendRay:
        await handleSendRayGamePlayMenuSelection();
        break;
      case GamePlayMenuSelection.addGuess:
        await handleAddGuessGamePlayMenuSelection();
        break;
      case GamePlayMenuSelection.removeGuess:
        await handleRemoveGuessGamePlayMenuSelection();
        break;
      case GamePlayMenuSelection.revealBoard:
        await handleRevealBoardGamePlayMenuSelection();
        break;
      case GamePlayMenuSelection.showStatistics:
        await handleShowStatisticsGamePlayMenuSelection();
        break;
      case GamePlayMenuSelection.abortGamePlay:
        await handleAbortGamePlayGamePlayMenuSelection();
        break;
      default:
        throw new Error(
          `invalid GamePlayMenuSelection:  ${gamePlayMenuSelection.value}`,
        ); // should never happen
    }
  }
}
async function handleNewGameTopMenuSelection(
  response: NewGameResponse,
): Promise<void> {
  if (validateNewGameResponse(response)) {
    gameBoard = new GameBoard(
      response.dimensionX,
      response.dimensionY,
      response.atomCount,
    );

    await playGame();
  } else {
    console.log(
      `You attempted to place ${
        response.atomCount
      } atoms on a board having only ${(
        response.dimensionX * response.dimensionY
      ).toString()} cells.  Try again!`,
    );
  }
}

async function handleTutorialTopMenuSelection(): Promise<void> {
  await Open.default('https://en.wikipedia.org/wiki/Black_Box_(game)');
}

async function handleExitTopMenuSelection(): Promise<void> {
  console.log('thanks for playing!');
}

// main entry point async IIFE function

(async () => {
  let topMenuSelection: TopMenuResponse;

  while (topMenuSelection?.value !== TopMenuSelection.exit) {
    topMenuSelection = await topPrompt();

    let newGameResponse: NewGameResponse;

    switch (topMenuSelection.value) {
      case TopMenuSelection.newGame:
        newGameResponse = await newGamePrompt();
        await handleNewGameTopMenuSelection(newGameResponse);
        break;

      case TopMenuSelection.tutorial:
        await handleTutorialTopMenuSelection();
        break;

      case TopMenuSelection.exit:
        await handleExitTopMenuSelection();
        break;
      default:
        throw new Error(`invalid selection: ${topMenuSelection.value}`); // should never happen
    }
  } // while not exit
})();

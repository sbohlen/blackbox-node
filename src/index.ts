/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import * as Prompts from 'prompts';
import { BoardEdge } from './BoardEdge';
import { GameBoard } from './GameBoard';
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
      { title: 'Start a new game', value: TopMenuSelection.newGame },
      { title: 'Tutorial', value: TopMenuSelection.tutorial },
      { title: 'Exit/Quit', value: TopMenuSelection.exit },
    ],
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
      initial: 10,
    },
    {
      type: 'number',
      name: 'dimensionY',
      message: 'Enter vertical dimension for the board (1-20):',
      min: 1,
      max: 20,
      initial: 10,
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

function renderGameBoard() {
  console.log(render(gameBoard).toString());
}

async function handleRenderBoardGamePlayMenuSelection() {
  renderGameBoard();
}

async function handleSendRayGamePlayMenuSelection() {
  console.log('sending a ray....!');
  gameBoard.sendRay(BoardEdge.Bottom, 5);
  renderGameBoard();
}

async function handleAddGuessGamePlayMenuSelection() {
  throw new Error('Function not implemented.');
}

async function handleRemoveGuessGamePlayMenuSelection() {
  throw new Error('Function not implemented.');
}

async function handleRevealBoardGamePlayMenuSelection() {
  throw new Error('Function not implemented.');
}

async function handleShowStatisticsGamePlayMenuSelection() {
  const stats = gameBoard.getGameStatistics();
  // TODO: should NOT display guess data here since game != over)
  console.log(JSON.stringify(stats));
  // renderGameBoard();
}

async function handleAbortGamePlayGamePlayMenuSelection() {
  console.log('Canceling and returning to main menu...');
}

async function playGame(): Promise<void> {
  let gamePlayMenuSelection: GamePlayMenuResponse;

  while (gamePlayMenuSelection?.value !== GamePlayMenuSelection.abortGamePlay) {
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
  console.log('***TODO: tutorial goes here***');
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

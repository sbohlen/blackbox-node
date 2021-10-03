/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import * as Prompts from 'prompts';
import { GameBoard } from './GameBoard';
import { render } from './renderGameBoard';

let gameBoard: GameBoard;

enum TopMenuSelection {
  newGame = 'newGame',
  tutorial = 'tutorial',
  exit = 'exit',
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

async function playGame(): Promise<void> {
  console.log(render(gameBoard).toString());
}

async function handleNewGameSelection(
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

async function handleTutorialSelection(): Promise<void> {
  console.log('***TODO: tutorial goes here***');
}

async function handleExitSelection(): Promise<void> {
  console.log('thanks for playing!');
}

(async () => {
  let topMenuSelection: TopMenuResponse;

  while (topMenuSelection?.value !== TopMenuSelection.exit) {
    topMenuSelection = await topPrompt();

    let newGameResponse: NewGameResponse;

    switch (topMenuSelection.value) {
      case TopMenuSelection.newGame:
        newGameResponse = await newGamePrompt();
        await handleNewGameSelection(newGameResponse);
        break;

      case TopMenuSelection.tutorial:
        await handleTutorialSelection();
        break;

      case TopMenuSelection.exit:
        await handleExitSelection();
        break;
      default:
        throw new Error(`invalid selection: ${topMenuSelection.value}`); // should never happen
    }
  } // while not exit
})();

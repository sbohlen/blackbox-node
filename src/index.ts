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

async function topPrompt(): Promise<any> {
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
      message: 'enter horizontal dimension for the board:',
      min: 1,
      max: 20,
      initial: 10,
    },
    {
      type: 'number',
      name: 'dimensionY',
      message: 'enter vertical dimension for the board:',
      min: 1,
      max: 20,
      initial: 10,
    },
    {
      type: 'number',
      name: 'atomCount',
      message: 'enter number of atoms to hide on the board:',
      min: 1,
      initial: 3,
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

function playGame(): void {
  console.log(render(gameBoard).toString());
}

function handleNewGameSelection(response: NewGameResponse) {
  if (validateNewGameResponse(response)) {
    gameBoard = new GameBoard(
      response.dimensionX,
      response.dimensionY,
      response.atomCount,
    );

    playGame();
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

function handleTutorialSelection() {
  console.log('***TODO: tutorial goes here***');
}

function handleExitSelection() {
  console.log('thanks for playing!');
}

(async () => {
  let topMenuSelection: any;

  while (topMenuSelection?.value !== TopMenuSelection.exit) {
    topMenuSelection = await topPrompt();

    let newGameResponse: NewGameResponse;

    switch (topMenuSelection.value) {
      case TopMenuSelection.newGame:
        newGameResponse = await newGamePrompt();
        handleNewGameSelection(newGameResponse);
        break;

      case TopMenuSelection.tutorial:
        handleTutorialSelection();
        break;

      case TopMenuSelection.exit:
        handleExitSelection();
        break;
      default:
        throw new Error(`invalid selection: ${topMenuSelection.value}`); // should never happen
    }
  } // while not exit
})();

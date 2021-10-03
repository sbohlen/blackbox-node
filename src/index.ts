/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import * as Prompts from 'prompts';

enum TopMenuSelection {
  newGame = 'newGame',
  tutorial = 'tutorial',
  exit = 'exit',
}

async function displayTopPrompt(): Promise<any> {
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

(async () => {
  let topMenuSelection: any;

  while (topMenuSelection?.value !== TopMenuSelection.exit) {
    topMenuSelection = await displayTopPrompt();

    switch (topMenuSelection.value) {
      case TopMenuSelection.newGame:
        console.log('***STARTING NEW GAME***');
        break;

      case TopMenuSelection.tutorial:
        console.log('***tutorial goes here***');
        break;

      case TopMenuSelection.exit:
        console.log('thanks for playing!');
        break;
      default:
        throw new Error(`invalid selection: ${topMenuSelection.value}`);
    }
  } // while not exit
})();

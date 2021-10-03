/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import * as Prompts from 'prompts';

function validateLevelOneResponse(input: any): boolean | string {
  switch (input) {
    case 'hello':
      return true;

    case 'exit':
      return true;

    case 'next':
      return true;

    default:
      return `'${input}'' wasn't a good response, try again or 'exit' to quit`;
  }
}

function validateLevelTwoResponse(input: any): boolean | string {
  switch (input) {
    case 'hello2':
      return true;

    case 'back':
      return true;

    default:
      return `'${input}'' wasn't a good response, try again or 'back' to return`;
  }
}
async function levelTwoMenu(): Promise<any> {
  const levelTwoResponse = await Prompts.prompt({
    type: 'text',
    name: 'value',
    message: "commands: 'hello2'; 'back' to return:",
    validate: validateLevelTwoResponse,
  });

  return levelTwoResponse;
}

async function levelOneMenu(): Promise<any> {
  const levelOneResponse: any = await Prompts.prompt({
    type: 'text',
    name: 'value',
    message: "commands: 'hello'; 'next' for sub-menu; type 'exit' to end:",
    validate: validateLevelOneResponse,
  });

  if (levelOneResponse?.value === 'hello') {
    console.log('hello from the system!');
  }

  if (levelOneResponse?.value === 'next') {
    let levelTwoResponse: any;
    while (levelTwoResponse?.value !== 'back') {
      levelTwoResponse = await levelTwoMenu();
    }
    // TODO: do we need this?
    return levelTwoResponse;
  }

  return levelOneResponse;
}

(async () => {
  let levelOneResponse: any;

  while (levelOneResponse?.value !== 'exit') {
    levelOneResponse = await levelOneMenu();

    console.log(levelOneResponse.value);
  } // while levelOneResponse
})();

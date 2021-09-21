/* eslint-disable no-await-in-loop */
import * as Prompts from 'prompts';

function validateResponse(input: any): boolean | string {
  const evaluation = input === 'hello' || input === 'exit';

  if (evaluation) {
    return true;
  }
  return `'${input}'' wasn't a good response, try again or 'exit' to quit`;
}

(async () => {
  let response: any;

  while (response?.value !== 'exit') {
    response = await Prompts.prompt({
      type: 'text',
      name: 'value',
      message: "all values but 'hello' result in an error; type 'exit' to end:",
      validate: validateResponse,
    });

    console.log(response.value);
  }
})();

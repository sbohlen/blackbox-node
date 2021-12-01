# blackbox-node

## Overview

This project is a reference implementation in [node.js](https://nodejs.org/)/[TypeScript](https://typescriptlang.org/) of the classic board game, [Black Box](<https://en.wikipedia.org/wiki/Black_Box_(game)>). For more information about the game itself (including history, in-depth rules, game-play concepts), refer to the preceding link(s).

## Running the code

### Dependencies

The only dependency (beyond those included in the project/code itself) is that of the `node.js` runtime (and an accompanying `npm` package manager). This code was developed against the node.js runtime v16.8.0. It has not been tested against either earlier or later versions of node.js, and so attempting to run the code against other versions is left as an experiment for the reader ;)

The project itself has a dependency upon the TypeScript language compiler, but this dependency will be resolved by the `npm` package manager during the steps in the [How-To-Run](#How-to-Run) or [Running Tests](#Running-Tests) sections. TypeScript has been specified as an `npm` package dependency so that it will not conflict with any other pre-installed versions of TypeScript on your system.

In the event of targeting a significantly earlier version of node.js, it may be necessary to adjust the TypeScript transpiler targeting to produce an earlier version of Javascript as identified in the [Typescript and JavaScript compatibility](#Typescript-and-JavaScript-compatibility) section of this doc.

### Typescript and JavaScript compatibility

This project is configured to transpile the TypeScript source files into ECMAscript 2020-compatible Javascript. If a different Javascript compatibility target is desired, you may modify the provided `tsconfig.json` file accordingly. See [What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) for more information.

### How-to-Run

1. install node.js (see [Dependencies](#Dependencies) for node runtime compatibility guidance)
1. clone this repo
1. from the root of the repo, run the command `npm install` to hydrate all required package dependencies
1. from the root of the repo, run the command `npm start` to transpile the TypeScript to Javascript and start the app

The app itself is menu-driven and should be (largely!) self-explanatory in re: how to interact with the interface and play the game. Note that prior familiarity with the game play rules is assumed but there is a built-in tutorial also provided as a refresher.

### Running Tests

1. install node.js (see [Dependencies](#Dependencies) for node runtime compatibility guidance)
1. clone this repo
1. from the root of the repo, run the command `npm install` to hydrate all required package dependencies
1. run one of the following commands as appropriate:

| command                 | intent                                                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `npm run test`          | run all tests                                                                                                                |
| `npm run test:debug`    | run tests after attaching the VSCode debugger (assumes the repo is open in [the VSCode IDE](https://code.visualstudio.com/)) |
| `npm run test:coverage` | run all tests and provide code-coverage report                                                                               |
| `npm run test:verbose`  | run all tests with maximum verbosity of output                                                                               |

## Contributing

Contributions are always welcome. To contribute to this project, fork the repository, file a new [issue](https://github.com/sbohlen/blackbox-node/issues) correlated to your proposed contribution, and open a new pull request.

Developers please take note of the several 'convenience' `npm` commands already defined in the `package.json` file intended to improve the developer experience (specifically the several `npm run watch:...` commands provided to accelerate the feedback from the developer build-run-test-debug loop).

## Reporting Issues

Issues, bug reports, suggestions, recommendations, etc. are always welcome. Please file a new [issue](https://github.com/sbohlen/blackbox-node/issues) describing the problem or suggestion in as much detail as possible. In the case of problems/bugs encountered, reporters are encouraged to include sufficient detail to support reproducing the problem/bug if at all possible.

## License

This project is licensed in its entirety under the MIT License. See [LICENSE](https://github.com/sbohlen/blackbox-node/blob/main/LICENSE) file for details.

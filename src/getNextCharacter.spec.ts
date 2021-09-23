import { getNextLetter as getNextCharacter } from './getNextCharacter';

describe('When selecting next character', () => {
  it.each`
    startingCharacter | expectedNextCharacter
    ${'c'}            | ${'d'}
    ${'R'}            | ${'S'}
    ${'z'}            | ${'aa'}
    ${'Z'}            | ${'AA'}
    ${'BC'}           | ${'BD'}
    ${'bc'}           | ${'bd'}
  `(
    'should return proper-cased next value',
    ({ startingCharacter, expectedNextCharacter }) => {
      const actual = getNextCharacter(startingCharacter);

      expect(actual).toEqual(expectedNextCharacter);
    },
  );
});

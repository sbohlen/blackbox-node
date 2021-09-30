import { getNextLetter as getNextCharacter } from './getNextCharacter';

describe.each`
  testCaseName                          | startingCharacter | expectedNextCharacter
  ${'lowercase starting character'}     | ${'c'}            | ${'d'}
  ${'uppercase starting character'}     | ${'R'}            | ${'S'}
  ${'lowercase "z" starting character'} | ${'z'}            | ${'aa'}
  ${'uppercase "Z" starting character'} | ${'Z'}            | ${'AA'}
  ${'uppercase double-character start'} | ${'BC'}           | ${'BD'}
  ${'lowercase double-character start'} | ${'bc'}           | ${'bd'}
`(
  'When selecting next character',
  ({ testCaseName, startingCharacter, expectedNextCharacter }) => {
    it(`${testCaseName} > should return proper-cased next value`, () => {
      const actual = getNextCharacter(startingCharacter);

      expect(actual).toEqual(expectedNextCharacter);
    });
  },
);

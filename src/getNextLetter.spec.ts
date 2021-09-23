import { getNextLetter } from './getNextLetter';

describe('When starting from an uppercase character', () => {
  const startingCharacter = 'C';
  const expectedNextCharacter = 'D';

  it('should return proper-cased next character', () => {
    const actual = getNextLetter(startingCharacter);

    expect(actual).toEqual(expectedNextCharacter);
  });
});

describe('When starting from a lowercase character', () => {
  const startingCharacter = 'c';
  const expectedNextCharacter = 'd';

  it('should return proper-cased next character', () => {
    const actual = getNextLetter(startingCharacter);

    expect(actual).toEqual(expectedNextCharacter);
  });
});

describe('When starting from a double-character designation', () => {
  const startingCharacter = 'cc';
  const expectedNextCharacter = 'cd';

  it('should return proper-cased next double-character', () => {
    const actual = getNextLetter(startingCharacter);

    expect(actual).toEqual(expectedNextCharacter);
  });
});

describe('When starting from a the end of the single-character range', () => {
  const startingCharacter = 'z';
  const expectedNextCharacter = 'aa';

  it('should return proper-cased next double-character', () => {
    const actual = getNextLetter(startingCharacter);

    expect(actual).toEqual(expectedNextCharacter);
  });
});

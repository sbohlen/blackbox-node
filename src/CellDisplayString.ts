import { bgGreen, bgRed, black, white } from 'kleur/colors';

export class CellDisplayString {
  static readonly guess = '?';

  static readonly correctGuess = bgGreen(black(' X '));

  static readonly incorrectGuess = bgRed(white(' O '));

  static readonly missedTarget = bgRed(white(' T '));

  static readonly empty = '   ';
}

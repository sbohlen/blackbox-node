import {
  bgCyan,
  bgGreen,
  bgRed,
  black,
  gray,
  inverse,
  white,
} from 'kleur/colors';

export class CellDisplayString {
  static readonly guess = bgCyan(black(' ? '));

  static readonly correctGuess = bgGreen(black(' X '));

  static readonly incorrectGuess = bgRed(white(' X '));

  static readonly missedTarget = bgCyan(black(' T '));

  static readonly empty = inverse(gray('   '));
}

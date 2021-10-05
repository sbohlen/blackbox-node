import { bgRed, bgYellow, black, white } from 'kleur/colors';

export class AnnotationDisplayString {
  static readonly hit = bgRed(white(' ! '));

  static readonly reflectBottom = bgYellow(black(' ^ '));

  static readonly reflectTop = bgYellow(black(' v '));

  static readonly reflectLeft = bgYellow(black(' > '));

  static readonly reflectRight = bgYellow(black(' < '));

  static readonly empty = '   ';
}

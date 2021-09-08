export class Coordinate {
  constructor(private readonly value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('Invalid value; must be an integer!');
    }
  }

  get Value() {
    return this.value;
  }
}

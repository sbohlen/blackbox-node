export class Coordinate {
  constructor(private readonly value: number) {
    if (!Number.isInteger(value)) {
      throw new Error(`Invalid value; expected integer but was ${value}`);
    }
  }

  get Value() {
    return this.value;
  }

  equals(other: Coordinate): boolean {
    return this.value === other.value;
  }
}

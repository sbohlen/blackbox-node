export function hasValue(
  value: any,
  failOnEmptyString: boolean = false,
): boolean {
  let isEmptyString = true;

  if (failOnEmptyString) {
    isEmptyString = !(value === '');
  }

  return value !== null && value !== undefined && isEmptyString;
}

export function hasValueAndIsNotEmptyString(value: any): boolean {
  return hasValue(value, true);
}

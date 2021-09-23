export function getNextLetter(key: string): string {
  if (key === 'Z' || key === 'z') {
    return (
      String.fromCharCode(key.charCodeAt(0) - 25) +
      String.fromCharCode(key.charCodeAt(0) - 25)
    ); // AA or aa
  }
  const lastChar = key.slice(-1);
  const sub = key.slice(0, -1);
  if (lastChar === 'Z' || lastChar === 'z') {
    // If a string of length > 1 ends in Z/z,
    // increment the string (excluding the last Z/z) recursively,
    // and append A/a (depending on casing) to it
    return (
      getNextLetter(sub) + String.fromCharCode(lastChar.charCodeAt(0) - 25)
    );
  }
  // (take till last char) append with (increment last char)
  return sub + String.fromCharCode(lastChar.charCodeAt(0) + 1);
}

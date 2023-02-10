export function truncate(str: string, len: number = 50) {
  if (str.length >= len) {
    return `${str.slice(0, len)}...`;
  }
  return str;
}

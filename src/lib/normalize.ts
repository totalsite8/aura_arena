export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»"„“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

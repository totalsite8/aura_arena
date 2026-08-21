const ru = new Intl.NumberFormat("ru-RU");

export function formatPrice(n: number): string {
  return `${ru.format(Math.round(n))}₽`;
}

export function formatPoints(n: number): string {
  return ru.format(Math.round(n));
}

export function pointsToRub(points: number): number {
  return Math.round(points / 10);
}

export function rubToPoints(rub: number): number {
  return Math.round(rub * 10);
}

export function formatRating(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

export function normalizeQuery(s: string): string {
  return s
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[«»"'“”.,!?()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function clamp(n: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, n));
}

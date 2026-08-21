export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed: string): () => number {
  let x = hashStr(seed) || 1;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >> 17;
    x >>>= 0;
    x ^= x << 5;
    x >>>= 0;
    return (x >>> 0) / 4294967296;
  };
}

export function pick<T>(rand: () => number, list: readonly T[]): T {
  const item = list[Math.floor(rand() * list.length)];
  return item ?? list[0]!;
}

export const springSoft = { type: "spring" as const, stiffness: 100, damping: 15 };
export const springSnappy = { type: "spring" as const, stiffness: 260, damping: 22 };

export function timelineScale(fast: boolean, reduced: boolean): number {
  if (reduced) return 0.02;
  if (fast) return 0.16;
  return 1;
}

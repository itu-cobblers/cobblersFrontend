/** Fraction of `value` over `max`, clamped to a 0–100 percentage. */
export function getProgressPercent(value: number, max: number): number {
  if (max <= 0) return 0
  const percent = (value / max) * 100
  return Math.max(0, Math.min(100, percent))
}

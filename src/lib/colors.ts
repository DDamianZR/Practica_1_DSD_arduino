// Paleta consistente entre LEDs, ondas y tabla.
export const BIT_COLORS = [
  "#22d3ee", // Q0 cyan
  "#34d399", // Q1 emerald
  "#f59e0b", // Q2 amber
  "#f472b6", // Q3 pink
] as const;

export const CLK_COLOR = "#a78bfa";
export const DIN_COLOR = "#e5e7eb";

export function bitColor(index: number): string {
  return BIT_COLORS[index] ?? "#94a3b8";
}

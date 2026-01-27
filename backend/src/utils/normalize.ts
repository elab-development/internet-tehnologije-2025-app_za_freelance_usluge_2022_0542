export function norm(s: string) {
  return s.trim().toLowerCase();
}

export function splitCsv(input?: string) {
  if (!input) return [];
  return input
    .split(",")
    .map((x) => norm(x))
    .filter(Boolean);
}

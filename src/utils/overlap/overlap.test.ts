import { mergeIntervals, overlapDays } from "./overlap";

const d = (s: string) => new Date(s + "T00:00:00Z");

test("mergeIntervals: merges only overlapping (not back-to-back)", () => {
  const out = mergeIntervals([
    { start: d("2024-01-01"), end: d("2024-01-05") },
    { start: d("2024-01-05"), end: d("2024-01-10") }, // overlaps on the 5th
    { start: d("2024-01-12"), end: d("2024-01-15") }, // no overlap
  ]);
  expect(out).toHaveLength(2);
  expect(out[0].start.toISOString().slice(0,10)).toBe("2024-01-01");
  expect(out[0].end.toISOString().slice(0,10)).toBe("2024-01-10");
});

test("overlapDays: inclusive days", () => {
  const a = { start: d("2024-01-01"), end: d("2024-01-10") };
  const b = { start: d("2024-01-05"), end: d("2024-01-06") };
  expect(overlapDays(a, b)).toBe(2);
});

test("overlapDays: no overlap", () => {
  const a = { start: d("2024-01-01"), end: d("2024-01-03") };
  const b = { start: d("2024-01-04"), end: d("2024-01-06") };
  expect(overlapDays(a, b)).toBe(0);
});

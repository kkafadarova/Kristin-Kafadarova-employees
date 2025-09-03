import type { Interval } from "../../types";
import { daysDiffInclusive } from "../dates/dates";

/**
 * Merges intervals that **overlap** (inclusive).
 * Example:
 *   [1–3] and [3–6]  → merged to [1–6]  (because they overlap at day 3)
 *   [1–3] and [4–6]  → NOT merged       (4 is the day after 3, no overlap)
 */
export function mergeIntervals(intervals: Interval[]): Interval[] {
  if (!intervals.length) return [];
  const sorted = [...intervals].sort((a, b) => a.start.getTime() - b.start.getTime());

  const merged: Interval[] = [{ ...sorted[0] }];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const curr = sorted[i];

    // If current starts on or before last.end → they overlap → extend the last interval.
    if (curr.start.getTime() <= last.end.getTime()) {
      if (curr.end.getTime() > last.end.getTime()) {
        last.end = curr.end; // extend the end
      }
    } else {
      merged.push({ ...curr });
    }
  }
  return merged;
}

/**
 * Returns the number of **inclusive** overlapping days between two intervals.
 * If they don't overlap, returns 0.
 */
export function overlapDays(a: Interval, b: Interval): number {
  const start = a.start.getTime() > b.start.getTime() ? a.start : b.start; // max(startA, startB)
  const end   = a.end.getTime()   < b.end.getTime()   ? a.end   : b.end;   // min(endA, endB)
  if (end.getTime() < start.getTime()) return 0;
  return daysDiffInclusive(start, end);
}

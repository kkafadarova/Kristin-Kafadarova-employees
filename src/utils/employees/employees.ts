import type { Interval, PairKey, PairProjectItem, Result, Row } from "../../types";
import { mergeIntervals, overlapDays } from "../overlap/overlap";

/** Returns all employee pairs (optionally top N), sorted by total common days. */
export function computeTopPairs(rows: Row[], limit = Infinity): Result[] {
  if (!rows.length) return [];

  /** Group: project -> employee -> intervals */
  const byProject = new Map<string, Map<string, Interval[]>>();
  for (const r of rows) {
    if (!byProject.has(r.projectId)) byProject.set(r.projectId, new Map());
    const perEmp = byProject.get(r.projectId)!;
    const list = perEmp.get(r.empId) ?? [];
    list.push({ start: r.from, end: r.to });
    perEmp.set(r.empId, list);
  }

  /** Merge each employee's intervals within a project (remove internal overlaps) */
  for (const perEmp of byProject.values()) {
    for (const [emp, list] of perEmp) perEmp.set(emp, mergeIntervals(list));
  }

  /** Accumulate: for each pair in a project → sum overlap days + per-project breakdown */
  const totalDays = new Map<PairKey, number>();                       /** emp1|emp2 -> totalDays */
  const perProjectDays = new Map<PairKey, Map<string, number>>();  /** emp1|emp2 -> (projectId -> days) */

  /** Sum inclusive overlap across two interval lists */
  const sumOverlap = (a: Interval[], b: Interval[]) => {
    let s = 0;
    for (const x of a) for (const y of b) s += overlapDays(x, y);
    return s;
  };

  for (const [projectId, perEmp] of byProject) {
    const emps = [...perEmp.keys()].sort();
    for (let i = 0; i < emps.length; i++) {
      for (let j = i + 1; j < emps.length; j++) {
        const e1 = emps[i], e2 = emps[j];
        const days = sumOverlap(perEmp.get(e1)!, perEmp.get(e2)!);
        if (!days) continue;

        const key = `${e1}|${e2}` as PairKey;
        totalDays.set(key, (totalDays.get(key) ?? 0) + days);

        const mp = perProjectDays.get(key) ?? new Map<string, number>();
        mp.set(projectId, (mp.get(projectId) ?? 0) + days);
        perProjectDays.set(key, mp);
      }
    }
  }

  if (!totalDays.size) return [];

  /**  Build results and asc sort */
  const pairsSorted = [...totalDays.entries()].sort((a, b) => b[1] - a[1]);
  const take = Math.min(pairsSorted.length, limit);

  const results: Result[] = [];
  for (let i = 0; i < take; i++) {
    const [pairKey, totalDays] = pairsSorted[i];
    const [emp1, emp2] = pairKey.split("|");

    const items: PairProjectItem[] = [];
    for (const [projectId, d] of perProjectDays.get(pairKey)!) {
      items.push({ emp1, emp2, projectId, days: d });
    }
    items.sort((a, b) => b.days - a.days);

    results.push({ emp1, emp2, totalDays, items });
  }
  return results;
}

export function computeLongestPair(rows: Row[]): Result | null {
  return computeTopPairs(rows, 1)[0] ?? null;
}

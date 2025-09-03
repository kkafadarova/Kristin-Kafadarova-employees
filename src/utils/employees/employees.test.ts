import { computeTopPairs } from "./employees";
import type { Row } from "../../types";

const d = (s: string) => new Date(s + "T00:00:00Z");

test("computeTopPairs: ranks pairs by total overlap", () => {
  const rows: Row[] = [
    // Project X: with ids -> 101 and 106-> overlaps 5 days
    { empId: "101", projectId: "X", from: d("2024-01-01"), to: d("2024-01-10") },
    { empId: "106", projectId: "X", from: d("2024-01-06"), to: d("2024-01-15") },

    // Project Y: with ids -> 102 and 107-> overlaps 3 days
    { empId: "102", projectId: "Y", from: d("2024-02-01"), to: d("2024-02-05") },
    { empId: "107", projectId: "Y", from: d("2024-02-03"), to: d("2024-02-07") },

    // Project Z: with ids -> 101 and 106-> overlaps 2 days , plus 5 days above
    { empId: "101", projectId: "Z", from: d("2024-03-01"), to: d("2024-03-04") },
    { empId: "106", projectId: "Z", from: d("2024-03-03"), to: d("2024-03-10") },
  ];

  const top = computeTopPairs(rows);
  expect(top.length).toBeGreaterThanOrEqual(2);

  // first pair -> 101-106, 7days
  expect(top[0].emp1).toBe("101");
  expect(top[0].emp2).toBe("106");
  expect(top[0].totalDays).toBe(7);

  // asc days sorting
  expect(top[0].items[0].projectId).toBe("X");
  expect(top[0].items[0].days).toBe(5);
  expect(top[0].items[1].projectId).toBe("Z");
  expect(top[0].items[1].days).toBe(2);
});

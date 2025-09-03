import { describe, it, expect } from "vitest";
import { itemsToCsv } from "./exportCsv";
import type { PairProjectItem } from "../../types";

describe("exportCsv utils", () => {
  describe("itemsToCsv", () => {
    it("builds CSV with header and CRLF, escaping commas and quotes", () => {
      const items: PairProjectItem[] = [
        { emp1: "101", emp2: "106", projectId: "P1", days: 12 },
        { emp1: "A,1", emp2: 'B"2', projectId: "P3", days: 5 },
      ];

      const csv = itemsToCsv(items);
      // rows are separated by CRLF
      const lines = csv.split("\r\n");
      expect(lines).toHaveLength(1 + items.length);

      // header
      expect(lines[0]).toBe(
        "Employee ID #1,Employee ID #2,Project ID,Days worked"
      );

      // first row — no escaping
      expect(lines[1]).toBe("101,106,P1,12");

      // second row — escapes comma and quote ("" inside)
      expect(lines[2]).toBe('"A,1","B""2",P3,5');
    });
  });
});

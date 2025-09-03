import {
  makeUTCDate,
  todayUTC,
  isValidDate,
  shortMonthToNumber,
  parseFlexibleDate,
  daysDiffInclusive,
} from "./dates";
import { describe, it, expect } from "vitest";

const iso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);

describe("dates utils", () => {
  it("makeUTCDate returns midnight UTC for given Y-M-D", () => {
    const d = makeUTCDate(2024, 2, 3);
    expect(d.getUTCFullYear()).toBe(2024);
    expect(d.getUTCDate()).toBe(3);
    expect(d.getUTCHours()).toBe(0);
    expect(d.getUTCMinutes()).toBe(0);
    expect(d.getUTCSeconds()).toBe(0);
  });

  it("todayUTC matches today's UTC date (yyyy-mm-dd) at 00:00:00Z", () => {
    const t = todayUTC();
    const todayIso = new Date().toISOString().slice(0, 10);
    expect(iso(t)).toBe(todayIso);
    expect(t.getUTCHours()).toBe(0);
    expect(t.getUTCMinutes()).toBe(0);
  });

  it("isValidDate returns true for valid Date and false for invalid", () => {
    expect(isValidDate(new Date("2024-01-01"))).toBe(true);
    // @ts-expect-error testing invalid
    expect(isValidDate(new Date("not-a-date"))).toBe(false);
  });

  it("shortMonthToNumber maps 3-letter month names (case-insensitive)", () => {
    expect(shortMonthToNumber("Jan")).toBe(1);
    expect(shortMonthToNumber("dec")).toBe(12);
    expect(shortMonthToNumber("Foo")).toBeNull();
  });

  describe("parseFlexibleDate", () => {
    it("parses yyyy-MM-dd", () => {
      expect(iso(parseFlexibleDate("2013-11-01"))).toBe("2013-11-01");
    });

    it("parses yyyy/MM/dd", () => {
      expect(iso(parseFlexibleDate("2013/11/01"))).toBe("2013-11-01");
    });

    it("parses dd.MM.yyyy", () => {
      expect(iso(parseFlexibleDate("01.11.2013"))).toBe("2013-11-01");
    });

    it("parses dd/MM/yyyy vs MM/dd/yyyy heuristics", () => {
      // a > 12 => dd/MM/yyyy
      expect(iso(parseFlexibleDate("13/01/2013"))).toBe("2013-01-13");
      // b > 12 => MM/dd/yyyy
      expect(iso(parseFlexibleDate("01/20/2013"))).toBe("2013-01-20");

    });

    it("parses d-MMM-yyyy and MMM d, yyyy", () => {
      expect(iso(parseFlexibleDate("1-Jan-2013"))).toBe("2013-01-01");
      expect(iso(parseFlexibleDate("Jan 1, 2013"))).toBe("2013-01-01");
      expect(iso(parseFlexibleDate("Aug 9, 2020"))).toBe("2020-08-09");
    });

    it("parses yyyymmdd", () => {
      expect(iso(parseFlexibleDate("20131101"))).toBe("2013-11-01");
    });

    it("treats NULL (and empty) as today when treatNullAsToday=true", () => {
      const today = new Date().toISOString().slice(0, 10);
      expect(iso(parseFlexibleDate("NULL", true))).toBe(today);
      expect(iso(parseFlexibleDate("", true))).toBe(today);
    });

    it("returns null for NULL/empty when treatNullAsToday=false", () => {
      expect(parseFlexibleDate("NULL", false)).toBeNull();
      expect(parseFlexibleDate("", false)).toBeNull();
    });

    it("fallback: native Date parsing if matches", () => {
      const d = parseFlexibleDate("March 5 2016");
      expect(iso(d)).toBe("2016-03-05");
    });

    it("returns null for unparseable strings", () => {
      expect(parseFlexibleDate("not-a-date")).toBeNull();
      expect(parseFlexibleDate("32/32/2030")).toBeNull();
    });

    it("always returns midnight UTC", () => {
      const d = parseFlexibleDate("2024-02-03")!;
      expect(d.getUTCHours()).toBe(0);
      expect(d.getUTCMinutes()).toBe(0);
    });
  });

  describe("daysDiffInclusive", () => {
    const d = (s: string) => new Date(s + "T00:00:00Z");

    it("same day => 1", () => {
      expect(daysDiffInclusive(d("2024-01-01"), d("2024-01-01"))).toBe(1);
    });

    it("range inclusive", () => {
      expect(daysDiffInclusive(d("2024-01-01"), d("2024-01-05"))).toBe(5);
      expect(daysDiffInclusive(d("2024-02-27"), d("2024-03-01"))).toBe(4);
    });

    it("reversed dates => 0", () => {
      expect(daysDiffInclusive(d("2024-01-05"), d("2024-01-01"))).toBe(0);
    });
  });
});

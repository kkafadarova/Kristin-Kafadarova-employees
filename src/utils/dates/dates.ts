/** Milliseconds in a day */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Create a Date at UTC midnight */
export function makeUTCDate(y: number, m: number, d: number) {
  return new Date(Date.UTC(y, m - 1, d));
}

/** Today at UTC midnight */
export function todayUTC(): Date {
  const now = new Date();
  return makeUTCDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());
}

/** Checks if Date is valid */
export function isValidDate(d: Date) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

/** Convert name of the month to a specific number */
export function shortMonthToNumber(mon: string): number | null {
  const idx = [
    "jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec",
  ].indexOf(mon.toLowerCase());
  return idx >= 0 ? idx + 1 : null;
}

/** True if (y,m,d) forms a real calendar date (no overflow). */
function isRealYMD(y: number, m: number, d: number): boolean {
  const dt = makeUTCDate(y, m, d);
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() + 1 === m &&
    dt.getUTCDate() === d
  );
}

/**
 * Supported:
 *  - yyyy-MM-dd        → 2013-11-01
 *  - yyyy/MM/dd        → 2013/11/01
 *  - dd.MM.yyyy        → 01.11.2013
 *  - dd/MM/yyyy | MM/dd/yyyy (heuristic)
 *  - d-MMM-yyyy        → 1-Jan-2013
 *  - MMM d, yyyy       → Jan 1, 2013
 *  - yyyymmdd          → 20131101
 *  - fallback: native Date (locked to UTC midnight)
 * Special: "NULL" (or empty) → today when treatNullAsToday=true.
 */
export function parseFlexibleDate(raw: string, treatNullAsToday = false): Date | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s || /^(null|nil|none|n\/a)$/i.test(s)) {
    return treatNullAsToday ? todayUTC() : null;
  }

  let m = s.match(/^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s*$/); /** yyyy-MM-dd */
  if (m) return makeUTCDate(+m[1], +m[2], +m[3]);

  m = s.match(/^\s*(\d{4})\/(\d{1,2})\/(\d{1,2})\s*$/); /** yyyy/MM/dd */
  if (m) return makeUTCDate(+m[1], +m[2], +m[3]);

  m = s.match(/^\s*(\d{1,2})\.(\d{1,2})\.(\d{4})\s*$/); /** dd.MM.yyyy */
  if (m) return makeUTCDate(+m[3], +m[2], +m[1]);

  m = s.match(/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/); /** dd/MM/yyyy or MM/dd/yyyy */
  if (m) {
    const a = +m[1], b = +m[2], y = +m[3];
    if (a < 1 || b < 1 || a > 31 || b > 31) return null;
    const tryMake = (mm: number, dd: number) => (isRealYMD(y, mm, dd) ? makeUTCDate(y, mm, dd) : null);
    if (a > 12 && b <= 12) return tryMake(b, a);        /** dd/MM/yyyy */
    if (b > 12 && a <= 12) return tryMake(a, b);        /** MM/dd/yyyy */
    return tryMake(a, b);                                /** ambiguous → treat as MM/dd */
  }

  m = s.match(/^\s*(\d{1,2})-([A-Za-z]{3})-(\d{4})\s*$/); /** d-MMM-yyyy */
  if (m) {
    const mon = shortMonthToNumber(m[2]);
    if (mon && isRealYMD(+m[3], mon, +m[1])) return makeUTCDate(+m[3], mon, +m[1]);
    return null;
  }

  m = s.match(/^\s*([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})\s*$/); /** MMM d, yyyy */
  if (m) {
    const mon = shortMonthToNumber(m[1]);
    if (mon && isRealYMD(+m[3], mon, +m[2])) return makeUTCDate(+m[3], mon, +m[2]);
    return null;
  }

  m = s.match(/^\s*(\d{4})(\d{2})(\d{2})\s*$/); /** yyyymmdd */
  if (m) {
    const y = +m[1], mon = +m[2], dd = +m[3];
    return isRealYMD(y, mon, dd) ? makeUTCDate(y, mon, dd) : null;
  }

  /** Fallback: native Date (use local Y-M-D, then lock to UTC midnight) */
  const d = new Date(s);
  if (isValidDate(d)) return makeUTCDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return null;
}

/** Inclusive day difference between two dates (UTC midnight). */
export function daysDiffInclusive(a: Date, b: Date): number {
  const start = makeUTCDate(a.getUTCFullYear(), a.getUTCMonth() + 1, a.getUTCDate());
  const end = makeUTCDate(b.getUTCFullYear(), b.getUTCMonth() + 1, b.getUTCDate());
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1);
}

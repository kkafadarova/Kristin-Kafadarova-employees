import type { Row } from "../../types";
import { parseFlexibleDate } from "../dates/dates";

/** Remove BOM if the text is UTF-8 with BOM. */
function stripBOM(s: string): string {
  return s && s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

/** Split into non-empty trimmed lines (supports CRLF/LF). */
function splitLines(text: string): string[] {
  return stripBOM(text)
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);
}

/**
 * Parse a single CSV line
 * Supports quotes, doubled quotes inside fields ("" -> "), and commas within quotes
 * Does not support multi-line fields
 */
function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }  // escaped quote
        else inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { cells.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
  }
  cells.push(cur.trim());
  return cells;
}

/** Parse full CSV text into a matrix of cells. */
export function parseCSV(text: string): string[][] {
  return splitLines(text).map(parseCsvLine);
}

/**
 * Convert CSV text into Row[]:
 * - Optional header is supported (detects by presence of EmpID/ProjectID)
 * - Dates are parsed via parseFlexibleDate (NULL/empty DateTo → today)
 * - Invalid rows or reversed dates are skipped
 */
export function rowsFromCSV(csv: string): Row[] {
  const rows = parseCSV(csv);
  if (rows.length === 0) return [];

  // Detect optional header row
  const header = rows[0].map(x => x.toLowerCase().replace(/\s+/g, ""));
  const hasHeader = header.includes("empid") && header.includes("projectid");
  const data = hasHeader ? rows.slice(1) : rows;

  const out: Row[] = [];
  for (const rec of data) {
    // Expected: EmpID, ProjectID, DateFrom, DateTo
    const [emp, proj, from, to] = rec;
    if (emp == null || proj == null || from == null) continue;

    const fromD = parseFlexibleDate(from);
    const toD = parseFlexibleDate(to ?? "", true); // treat NULL/empty as today

    if (!fromD || !toD) continue;
    if (toD.getTime() < fromD.getTime()) continue;

    out.push({
      empId: String(emp).trim(),
      projectId: String(proj).trim(),
      from: fromD,
      to: toD,
    });
  }
  return out;
}

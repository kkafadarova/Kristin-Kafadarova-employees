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
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const character = line[i];

    if (inQuotes) {
      if (character === '"') {
        if (line[i + 1] === '"') { current += '"'; i++; }  // escaped quote
        else inQuotes = false;
      } else {
        current += character;
      }
    } else {
      if (character === '"') inQuotes = true;
      else if (character === ",") { cells.push(current.trim()); current = ""; }
      else current += character;
    }
  }
  cells.push(current.trim());
  return cells;
}

/** Parse full CSV text into a matrix of cells. */
export function parseCSV(text: string): string[][] {
  return splitLines(text).map(parseCsvLine);
}

/**
 * Convert CSV text into Row[]:
 */
export function rowsFromCSV(csv: string): Row[] {
  const rows = parseCSV(csv);
  if (rows.length === 0) return [];

  // Detect optional header row
  const header = rows[0].map(x => x.toLowerCase().replace(/\s+/g, ""));
  const hasHeader = header.includes("empid") && header.includes("projectid");
  const data = hasHeader ? rows.slice(1) : rows;

  return data
    .map(rec => {
      const [emp, proj, from, to] = rec;
      if (!emp || !proj || !from) return null;

      const fromD = parseFlexibleDate(from);p
      const toD = parseFlexibleDate(to ?? "", true); // treat NULL/empty as today
      if (!fromD || !toD) return null;
      if (toD.getTime() < fromD.getTime()) return null;

      return {
        empId: String(emp).trim(),
        projectId: String(proj).trim(),
        from: fromD,
        to: toD,
      } satisfies Row;
    })
    .filter((row): row is Row => row !== null);
}

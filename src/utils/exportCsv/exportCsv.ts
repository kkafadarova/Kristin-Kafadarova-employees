import type { PairProjectItem } from "../../types";

/** Escape a CSV field */
function csvEscape(v: string | number): string {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Build CSV text from project rows */
export function itemsToCsv(items: PairProjectItem[]): string {
  const header = ["Employee ID #1", "Employee ID #2", "Project ID", "Days worked"];
  const lines = [header.join(",")];
  for (const it of items) {
    lines.push(
      [
        csvEscape(it.emp1),
        csvEscape(it.emp2),
        csvEscape(it.projectId),
        csvEscape(it.days),
      ].join(",")
    );
  }
  // Use CRLF for better Excel compatibility
  return lines.join("\r\n");
}

/** Trigger CSV download (with BOM for proper Unicode in Excel) */
export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank"; 
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

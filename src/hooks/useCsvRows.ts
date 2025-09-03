import { useState } from "react";
import type { Row } from "../types";
import { rowsFromCSV } from "../utils/csv/csv";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try { return JSON.stringify(err); } catch { return String(err); }
}

export function useCsvRows() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function clear() {
    setRows(null);
    setError(null);
  }

  async function importFile(file: File) {
    setError(null);

    const isCsvByName = /\.csv$/i.test(file.name);
    const isCsvByMime = /^(text\/csv|application\/vnd\.ms-excel)$/i.test(file.type || "");
    if (!isCsvByName && !isCsvByMime) {
      clear();
      setError("Invalid file type. Please upload a .csv file.");
      return;
    }
    if (!file.size) {
      clear();
      setError("The file is empty.");
      return;
    }

    try {
      const text = await file.text();
      const parsed = rowsFromCSV(text);
      if (!parsed.length) {
        clear();
        setError("No valid rows found in the CSV file. Expected 4 columns: EmpID, ProjectID, DateFrom, DateTo.");
        return;
      }
      setRows(parsed);
    } catch (e: unknown) {
      clear();
      setError(`Error reading file: ${getErrorMessage(e)}`);
    }
  }

  return { rows, error, importFile, clear };
}

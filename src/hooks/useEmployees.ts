import { useMemo } from "react";
import type { Row, Result } from "../types";
import { computeLongestPair } from "../utils/employees/employees";

/**
 * Gets rows and returns a result of the longest pair
 */
export function useEmployeesResult(rows: Row[] | null): Result | null {
  return useMemo(() => (rows ? computeLongestPair(rows) : null), [rows]);
}
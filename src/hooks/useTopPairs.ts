import { useEffect, useMemo, useState } from "react";
import type { Row, Result } from "../types";
import { computeTopPairs } from "../utils/employees/employees";

/** returns pairs list and which is selected */
export function useTopPairs(rows: Row[] | null, limit = 10) {
  const pairs = useMemo<Result[]>(
    () => (rows ? computeTopPairs(rows, limit) : []),
    [rows, limit]
  );

  const [index, setIndex] = useState(0);
  useEffect(() => { setIndex(0); }, [rows]);

  const selected = pairs[index] ?? null;
  return { pairs, selected, index, setIndex };
}

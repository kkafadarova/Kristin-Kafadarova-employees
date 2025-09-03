import React from "react";
import type { PairProjectItem } from "../../types";
import { itemsToCsv, downloadCsv } from "../../utils/exportCsv/exportCsv";

export default function ExportButton({ items }: { items: PairProjectItem[] }) {
  const disabled = !items?.length;

  function onExport() {
    if (!items?.length) return;
    const pair = `${items[0].emp1}-${items[0].emp2}`;
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `employees-${pair}-${stamp}.csv`;
    downloadCsv(filename, itemsToCsv(items));
  }

  return (
    <button
      type="button"
      onClick={onExport}
      disabled={disabled}
      className={`inline-flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium shadow-sm
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      disabled
        ? "cursor-not-allowed bg-gray-200 text-gray-500"
        : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600"
    }`}
      title={disabled ? "No data to export" : "Export CSV"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2 h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 10l5 5 5-5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 15V3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Export CSV
    </button>
  );
}

import { useState } from "react";
import Header from "./components/Header";
import FilePicker from "./components/FilePicker";
import Stats from "./components/StatCard";
import ProjectsTable from "./components/ProjectsTable";
import ExportButton from "./components/ExportButton";
import AllPairsTable from "./components/AllPairsTable";

import { useCsvRows } from "./hooks/useCsvRows";
import { useTopPairs } from "./hooks/useTopPairs";

export default function App() {
  const { rows, error, importFile, clear } = useCsvRows();
  const { pairs, selected, index, setIndex } = useTopPairs(rows, 20);
  const [pickerKey, setPickerKey] = useState(0);

  function handleClear() {
    clear();
    /**
     * Remount Filepicker on clear
     */
    setPickerKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <Header />
        <FilePicker key={pickerKey} onPick={importFile} />

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <strong className="block font-semibold mb-1">Error</strong>
            <span>{error}</span>
          </div>
        )}

        {selected ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1">
              <div className="mb-2 text-sm text-gray-600">
                Found <b>{pairs.length}</b> pair{pairs.length === 1 ? "" : "s"}
              </div>
              <AllPairsTable
                pairs={pairs}
                selectedIndex={index}
                onSelect={setIndex}
              />
            </div>

            <div className="lg:col-span-2">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <Stats
                  emp1={selected.emp1}
                  emp2={selected.emp2}
                  totalDays={selected.totalDays}
                  className="mb-0"
                />
                <div className="sm:self-start flex gap-2">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium shadow-sm
                               border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    title="Clear selected file and results"
                  >
                    Clear
                  </button>
                  <ExportButton items={selected.items} />
                </div>
              </div>

              <ProjectsTable items={selected.items} />
            </div>
          </div>
        ) : !error ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
            <p className="font-medium">
              Pick a CSV file to compute the pairs with the longest common
              period.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

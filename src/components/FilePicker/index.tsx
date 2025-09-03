import { useState } from "react";

export default function FilePicker({
  onPick,
}: {
  onPick: (file: File) => void;
}) {
  const [name, setName] = useState("");

  return (
    <section className="mb-5">
      <label className="block">
        <span className="text-sm font-medium mb-1 inline-block">CSV file</span>
        <input
          type="file"
          accept=".csv,text/csv"
          className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-2 hover:bg-gray-50 focus:outline-none"
          onChange={(e) => {
            const f = e.currentTarget.files?.[0];
            if (f) {
              setName(f.name);
              onPick(f);
            }
          }}
        />
      </label>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Supported: yyyy-MM-dd, yyyy/MM/dd, dd.MM.yyyy, dd/MM/yyyy, MM/dd/yyyy,
          yyyymmdd, d-MMM-yyyy, MMM d, yyyy.
        </p>
        {name && (
          <span className="ml-3 text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
            {name}
          </span>
        )}
      </div>
    </section>
  );
}

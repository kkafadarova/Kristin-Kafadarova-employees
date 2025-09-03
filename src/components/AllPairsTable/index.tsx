import type { Result } from "../../types";

export default function AllPairsTable({
  pairs,
  selectedIndex,
  onSelect,
}: {
  pairs: Result[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  if (!pairs.length) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm max-h-[60vh]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 text-left">
              Employee ID #1
            </th>
            <th className="px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 text-left">
              Employee ID #2
            </th>
            <th className="px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 text-right">
              Total days
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {pairs.map((p, i) => {
            const active = i === selectedIndex;
            return (
              <tr
                key={`${p.emp1}|${p.emp2}`}
                aria-selected={active}
                onClick={() => onSelect(i)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onSelect(i);
                }}
                className={[
                  "cursor-pointer",
                  active ? "bg-blue-50/60" : "hover:bg-gray-50",
                ].join(" ")}
              >
                <td className="px-3 py-2 text-sm">{p.emp1}</td>
                <td className="px-3 py-2 text-sm">{p.emp2}</td>
                <td className="px-3 py-2 text-sm text-right font-mono tabular-nums">
                  {p.totalDays}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

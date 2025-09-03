export function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-4 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-0.5">{value}</div>
    </div>
  );
}

export default function Stats({
  emp1,
  emp2,
  totalDays,
  className = "",
}: {
  emp1: string;
  emp2: string;
  totalDays: number;
  className?: string;
}) {
  return (
    <section className={`mb-6 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Employee ID #1" value={emp1} />
        <StatCard label="Employee ID #2" value={emp2} />
        <StatCard label="Total common days" value={totalDays} />
      </div>
    </section>
  );
}

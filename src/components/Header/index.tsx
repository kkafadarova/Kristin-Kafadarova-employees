export default function Header() {
  return (
    <header className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Pair of Employees – Longest Overlap
      </h1>
      <p className="text-sm text-gray-600 mt-1">
        Upload a CSV with columns: EmpID, ProjectID, DateFrom, DateTo. DateTo
        may be NULL (treated as today).
      </p>
    </header>
  );
}

import type { PairProjectItem } from "../../types";
import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from "react";

type Align = "left" | "right";

function Th({
  children,
  align,
  className,
  ...rest
}: ThHTMLAttributes<HTMLTableHeaderCellElement> & {
  children: ReactNode;
  align?: Align;
}) {
  const cls = [
    "px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700",
    align === "right" ? "text-right" : "text-left",
    className ?? "",
  ].join(" ");

  return (
    <th className={cls} scope="col" {...rest}>
      {children}
    </th>
  );
}

function Td({
  children,
  align,
  className,
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode;
  align?: Align;
}) {
  const cls = [
    "px-4 py-2 text-sm text-gray-800",
    align === "right" ? "text-right" : "text-left",
    className ?? "",
  ].join(" ");

  return (
    <td className={cls} {...rest}>
      {children}
    </td>
  );
}

export default function ProjectsTable({ items }: { items: PairProjectItem[] }) {
  return (
    <section>
      <div className="mb-2">
        <h2 className="text-xl font-semibold">Common projects for the pair</h2>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm max-h-[60vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <Th>Employee ID #1</Th>
              <Th>Employee ID #2</Th>
              <Th>Project ID</Th>
              <Th align="right">Days worked</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {items.map((it) => (
              <tr
                key={`${it.emp1}|${it.emp2}|${it.projectId}`}
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50/40"
              >
                <Td>{it.emp1}</Td>
                <Td>{it.emp2}</Td>
                <Td className="font-mono">{it.projectId}</Td>
                <Td align="right" className="font-mono tabular-nums">
                  {it.days}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

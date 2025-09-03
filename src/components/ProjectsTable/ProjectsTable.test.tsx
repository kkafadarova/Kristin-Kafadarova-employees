import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProjectsTable from "./";
import type { PairProjectItem } from "../../types";

function makeItems(): PairProjectItem[] {
  return [
    { emp1: "101", emp2: "106", projectId: "P1", days: 12 },
    { emp1: "102", emp2: "107", projectId: "P2", days: 8 },
    { emp1: "103", emp2: "108", projectId: "P3", days: 5 },
  ];
}

describe("ProjectsTable", () => {
  it("renders headers and all rows", () => {
    const items = makeItems();
    const { container } = render(<ProjectsTable items={items} />);

    expect(
      screen.getByRole("columnheader", { name: /employee id #1/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /employee id #2/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /project id/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /days worked/i })
    ).toBeInTheDocument();

    const tbody = container.querySelector("tbody")!;
    const bodyRows = within(tbody).getAllByRole("row");
    expect(bodyRows).toHaveLength(items.length);

    const first = bodyRows[0];
    const cells = within(first).getAllByRole("cell");
    expect(cells[0]).toHaveTextContent("101");
    expect(cells[1]).toHaveTextContent("106");
    expect(cells[2]).toHaveTextContent("P1");
    expect(cells[3]).toHaveTextContent("12");
  });

  it("applies right alignment and monospace classes on numeric column", () => {
    const items = makeItems();
    const { container } = render(<ProjectsTable items={items} />);

    const tbody = container.querySelector("tbody")!;
    const firstRowCells = within(tbody)
      .getAllByRole("row")[0]
      .querySelectorAll("td");

    expect(firstRowCells[2]).toHaveClass("font-mono");

    expect(firstRowCells[3]).toHaveClass("text-right");
    expect(firstRowCells[3]).toHaveClass("font-mono");
    expect(firstRowCells[3]).toHaveClass("tabular-nums");
  });

  it("renders only header when items is empty", () => {
    const { container } = render(<ProjectsTable items={[]} />);
    const thead = container.querySelector("thead");
    const tbody = container.querySelector("tbody");
    expect(thead).toBeInTheDocument();
    expect(within(tbody!).queryAllByRole("row")).toHaveLength(0);
  });
});

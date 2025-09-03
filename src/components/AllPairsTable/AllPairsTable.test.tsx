import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AllPairsTable from "../AllPairsTable";
import type { Result } from "../../types";

function makePairs(): Result[] {
  return [
    { emp1: "101", emp2: "106", totalDays: 756, items: [] },
    { emp1: "102", emp2: "107", totalDays: 732, items: [] },
    { emp1: "103", emp2: "108", totalDays: 712, items: [] },
  ];
}

test("renders nothing when pairs is empty", () => {
  const { container } = render(
    <AllPairsTable pairs={[]} selectedIndex={0} onSelect={() => {}} />
  );
  expect(container.querySelector("table")).toBeNull();
});

test("renders header and all rows", () => {
  const pairs = makePairs();
  render(<AllPairsTable pairs={pairs} selectedIndex={0} onSelect={() => {}} />);

  expect(
    screen.getByRole("columnheader", { name: /Employee ID #1/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("columnheader", { name: /Employee ID #2/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("columnheader", { name: /Total days/i })
  ).toBeInTheDocument();

  /**
   * removes the first row - the header
   */
  const rows = screen.getAllByRole("row").slice(1);
  expect(rows).toHaveLength(pairs.length);

  const firstRow = rows[0];
  expect(within(firstRow).getByText("101")).toBeInTheDocument();
  expect(within(firstRow).getByText("106")).toBeInTheDocument();
  expect(within(firstRow).getByText("756")).toBeInTheDocument();
});

test("marks selected row with aria-selected and calls onSelect on click", async () => {
  const user = userEvent.setup();
  const pairs = makePairs();
  const onSelect = vi.fn();

  render(<AllPairsTable pairs={pairs} selectedIndex={1} onSelect={onSelect} />);

  /**
   * the second row is selected
   */
  const bodyRows = screen.getAllByRole("row").slice(1);
  expect(bodyRows[1]).toHaveAttribute("aria-selected", "true");

  await user.click(bodyRows[2]);
  expect(onSelect).toHaveBeenCalledWith(2);
});

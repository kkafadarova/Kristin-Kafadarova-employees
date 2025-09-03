import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExportButton from "./";
import type { PairProjectItem } from "../../types";

vi.mock("../../utils/exportCsv/exportCsv", () => ({
  itemsToCsv: vi.fn(() => "CSV_CONTENT"),
  downloadCsv: vi.fn(),
}));

import { itemsToCsv, downloadCsv } from "../../utils/exportCsv/exportCsv";

describe("ExportButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("is disabled when no items", () => {
    render(<ExportButton items={[]} />);
    const btn = screen.getByRole("button", { name: /export csv/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("title", "No data to export");
    expect(itemsToCsv).not.toHaveBeenCalled();
    expect(downloadCsv).not.toHaveBeenCalled();
  });

  test("exports CSV with expected filename when items exist", async () => {
    const user = userEvent.setup();
    const items: PairProjectItem[] = [
      { emp1: "101", emp2: "106", projectId: "P1", days: 5 },
      { emp1: "101", emp2: "106", projectId: "P2", days: 3 },
    ];

    render(<ExportButton items={items} />);

    const btn = screen.getByRole("button", { name: /export csv/i });
    expect(btn).toBeEnabled();
    expect(btn).toHaveAttribute("title", "Export CSV");

    await user.click(btn);

    expect(itemsToCsv).toHaveBeenCalledWith(items);

    expect(downloadCsv).toHaveBeenCalledTimes(1);
    const [filename, csvText] = (downloadCsv as unknown as vi.Mock).mock
      .calls[0];

    expect(filename).toMatch(
      /^employees-101-106-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}\.csv$/
    );
    expect(csvText).toBe("CSV_CONTENT");
  });
});

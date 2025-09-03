import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FilePicker from "./";

describe("FilePicker", () => {
  it("renders input with label and accept filter", () => {
    const onPick = vi.fn();
    render(<FilePicker onPick={onPick} />);

    const input = screen.getByLabelText(/csv file/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("accept", ".csv,text/csv");
    expect(screen.queryByText(/\.csv$/i)).not.toBeInTheDocument();
  });

  it("calls onPick and shows selected file name", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(<FilePicker onPick={onPick} />);

    const input = screen.getByLabelText(/csv file/i) as HTMLInputElement;

    const file = new File(
      ["EmpID,ProjectID,DateFrom,DateTo\n143,12,2013-11-01,2014-01-05\n"],
      "employees_test.csv",
      { type: "text/csv" }
    );

    await user.upload(input, file);

    expect(onPick).toHaveBeenCalledTimes(1);
    expect(onPick).toHaveBeenCalledWith(file);

    expect(input.files).not.toBeNull();
    expect(input.files?.length).toBe(1);
    expect(input.files?.[0]).toBe(file);

    expect(screen.getByText("employees_test.csv")).toBeInTheDocument();
  });
});

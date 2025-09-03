import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "./";

describe("Header", () => {
  it("renders the app title as an h1", () => {
    render(<Header />);
    const title = screen.getByRole("heading", {
      level: 1,
      name: /pair of employees .* longest overlap/i,
    });
    expect(title).toBeInTheDocument();
  });

  it("shows the CSV instructions text", () => {
    render(<Header />);
    expect(screen.getByText(/upload a csv with columns/i)).toBeInTheDocument();
    expect(
      screen.getByText(/empid, projectid, datefrom, dateto/i)
    ).toBeInTheDocument();
  });

  it("mentions that DateTo may be NULL (treated as today)", () => {
    render(<Header />);
    expect(screen.getByText(/dateto\s+may be null/i)).toBeInTheDocument();
    expect(screen.getByText(/treated as today/i)).toBeInTheDocument();
  });
});

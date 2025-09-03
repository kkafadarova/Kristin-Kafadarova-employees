import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Stats, { StatCard } from "./";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Employee ID #1" value="101" />);
    expect(screen.getByText("Employee ID #1")).toBeInTheDocument();
    expect(screen.getByText("101")).toBeInTheDocument();
  });

  it("supports numeric values", () => {
    render(<StatCard label="Total common days" value={42} />);
    expect(screen.getByText("Total common days")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});

describe("Stats", () => {
  it("renders three stat cards with correct labels and values", () => {
    render(<Stats emp1="101" emp2="106" totalDays={7} />);

    expect(screen.getByText("Employee ID #1")).toBeInTheDocument();
    expect(screen.getByText("Employee ID #2")).toBeInTheDocument();
    expect(screen.getByText("Total common days")).toBeInTheDocument();

    expect(screen.getByText("101")).toBeInTheDocument();
    expect(screen.getByText("106")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("applies optional className to the section wrapper", () => {
    const { container } = render(
      <Stats emp1="A" emp2="B" totalDays={1} className="mb-0 test-flag" />
    );

    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    expect(section).toHaveClass("mb-6");
    expect(section).toHaveClass("mb-0");
    expect(section).toHaveClass("test-flag");
  });
});

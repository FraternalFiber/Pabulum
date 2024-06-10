import { render } from "@testing-library/react";
import { Pantry } from "../index";
import "@testing-library/jest-dom";

describe("Pantry page", () => {
  it("should render correctly", () => {
    render(<Pantry />);
  });

  it('should set document.title to "My pantry - Pabulum"', () => {
    render(<Pantry />);
    expect(document.title).toBe("My pantry - Pabulum");
  });
});

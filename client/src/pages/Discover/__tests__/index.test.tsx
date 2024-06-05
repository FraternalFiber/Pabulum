import { render } from "@testing-library/react";
import { Discover } from "@/pages/Discover";
import "@testing-library/jest-dom";

describe("Discover page", () => {
  it("should render correctly", () => {
    render(<Discover />);
  });

  it('should set document.title to "Discover - Pabulum"', () => {
    render(<Discover />);
    expect(document.title).toBe("Discover - Pabulum");
  });
});

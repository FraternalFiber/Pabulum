import { render } from "@testing-library/react";
import { Account } from "../index";
import "@testing-library/jest-dom";

describe("Account page", () => {
  it("should render correctly", () => {
    render(<Account />);
  });

  // Check if document.title is set to correct value
  it('should set document.title to "Account - Pabulum"', () => {
    render(<Account />);
    expect(document.title).toBe("Account - Pabulum");
  });
});

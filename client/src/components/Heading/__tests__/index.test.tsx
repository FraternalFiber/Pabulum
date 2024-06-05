import { render } from "@testing-library/react";
import { Heading } from "../index";

describe("Heading", () => {
  it("should render the heading with the correct content", () => {
    const headingContent = "This is a heading";
    const { getByText } = render(<Heading content={headingContent} />);
    const headingElement = getByText(headingContent);
    expect(headingElement).toBeInTheDocument();
  });
});

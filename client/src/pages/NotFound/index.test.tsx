import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotFound } from "./";

// Mock the Heading and Button components
jest.mock("@/components/Heading", () => ({
  Heading: jest.fn(() => <div>Heading</div>),
}));

jest.mock("@/components/ui/button.tsx", () => ({
  Button: jest.fn(() => <button>Button</button>),
}));

describe("NotFound", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("should render the Heading, error message, and Button components", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    // Check if the Heading component is rendered
    expect(screen.getByText("Heading")).toBeInTheDocument();

    // Check if the error message is rendered
    expect(screen.getByText("404 - page not found")).toBeInTheDocument();

    // Check if the Button component is rendered
    expect(screen.getByText("Button")).toBeInTheDocument();
  });

  it('should set document.title to "Page not found - Pabulum"', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(document.title).toBe("Page not found - Pabulum");
  });

  it('should render a Link component with the correct "to" prop', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    // Check if the Link component is rendered with the correct "to" prop
    const linkElement = screen.getByRole("link", { name: "Button" });
    expect(linkElement).toHaveAttribute("href", "/");
  });
});

import { render, screen } from "@testing-library/react";
import { MyRecipes } from "../index.tsx";

// Mock the Heading and UserSearchForm components
jest.mock("@/components/Heading", () => ({
  Heading: jest.fn(() => <div>Heading</div>),
}));

jest.mock("@/components/UserSearchForm", () => ({
  UserSearchForm: jest.fn(() => <div>UserSearchForm</div>),
}));

describe("MyRecipes", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("should render the Heading and UserSearchForm components", () => {
    render(<MyRecipes />);

    // Check if the Heading component is rendered
    expect(screen.getByText("Heading")).toBeInTheDocument();

    // Check if the UserSearchForm component is rendered
    expect(screen.getByText("UserSearchForm")).toBeInTheDocument();
  });

  it('should set document.title to "My recipes - Pabulum"', () => {
    render(<MyRecipes />);
    expect(document.title).toBe("My recipes - Pabulum");
  });
});

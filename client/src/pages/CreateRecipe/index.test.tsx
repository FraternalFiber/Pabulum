import { render, screen } from "@testing-library/react";
import { CreateRecipe } from "./";
import { CreateRecipeForm } from "@/components/CreateRecipeForm";

// Mock the Heading and CreateRecipeForm components
jest.mock("@/components/Heading", () => ({
  Heading: jest.fn(() => <div>Heading</div>),
}));

jest.mock("@/components/CreateRecipeForm", () => ({
  CreateRecipeForm: jest.fn(() => <div>CreateRecipeForm</div>),
}));

describe("CreateRecipe", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("should render the Heading and CreateRecipeForm components", () => {
    render(<CreateRecipe />);

    // Check if the Heading component is rendered
    expect(screen.getByText("Heading")).toBeInTheDocument();

    // Check if the CreateRecipeForm component is rendered
    expect(screen.getByText("CreateRecipeForm")).toBeInTheDocument();
  });

  it('should set document.title to "Create recipe - Pabulum"', () => {
    render(<CreateRecipe />);
    expect(document.title).toBe("Create recipe - Pabulum");
  });

  it("should pass the correct mode prop to the CreateRecipeForm component", () => {
    render(<CreateRecipe />);

    // Check if the CreateRecipeForm component is called with the correct mode prop
    expect(CreateRecipeForm).toHaveBeenCalledWith({ mode: "create" }, {});
  });
});

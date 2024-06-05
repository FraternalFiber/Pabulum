import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EditRecipe } from "./";
import * as useRecipeModule from "@/services/useRecipe.ts";
import { CreateRecipeForm } from "@/components/CreateRecipeForm";
import { CreateRecipe } from "@/pages/CreateRecipe";

jest.mock("@/services/useRecipe.ts", () => ({
  useRecipe: jest.fn(),
}));

// Mock the Heading, CreateRecipeForm, LoadingSkeletons, ErrorAlert, and BackButton components
jest.mock("@/components/Heading", () => ({
  Heading: jest.fn(() => <div>Heading</div>),
}));

jest.mock("@/components/CreateRecipeForm", () => ({
  CreateRecipeForm: jest.fn(() => <div>CreateRecipeForm</div>),
}));

jest.mock("@/pages/EditRecipe/LoadingSkeletons.tsx", () => ({
  LoadingSkeletons: jest.fn(() => <div>LoadingSkeletons</div>),
}));

jest.mock("@/components/ErrorAlert/ErrorAlert.tsx", () => ({
  ErrorAlert: jest.fn(() => <div>ErrorAlert</div>),
}));

jest.mock("@/components/BackButton", () => ({
  BackButton: jest.fn(() => <div>BackButton</div>),
}));

// Mock the useRecipe hook
jest.mock("@/services/useRecipe.ts", () => ({
  useRecipe: jest.fn(),
}));

describe("EditRecipe", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("should render the loading state correctly", () => {
    // Mock the useRecipe hook to return the loading state
    const useRecipeMock = jest.spyOn(useRecipeModule, "useRecipe");
    useRecipeMock.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    });

    render(
      <MemoryRouter initialEntries={["/recipes/123/edit"]}>
        <Routes>
          <Route path="/recipes/:id/edit" element={<EditRecipe />} />
        </Routes>
      </MemoryRouter>,
    );

    // Check if the BackButton, Heading, and LoadingSkeletons components are rendered
    expect(screen.getByText("BackButton")).toBeInTheDocument();
    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("LoadingSkeletons")).toBeInTheDocument();
  });

  it("should render the error state correctly", () => {
    // Mock the useRecipe hook to return the error state
    const useRecipeMock = jest.spyOn(useRecipeModule, "useRecipe");
    useRecipeMock.mockReturnValue({ isLoading: false, isError: true, data: undefined });

    render(
      <MemoryRouter initialEntries={["/recipes/123/edit"]}>
        <Routes>
          <Route path="/recipes/:id/edit" element={<EditRecipe />} />
        </Routes>
      </MemoryRouter>,
    );

    // Check if the BackButton, Heading, and ErrorAlert components are rendered
    expect(screen.getByText("BackButton")).toBeInTheDocument();
    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("ErrorAlert")).toBeInTheDocument();
  });

  it("should render the CreateRecipeForm component with the correct props", () => {
    // Mock the useRecipe hook to return the recipe data
    const useRecipeMock = jest.spyOn(useRecipeModule, "useRecipe");
    useRecipeMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { title: "Recipe Name" },
    });

    render(
      <MemoryRouter initialEntries={["/recipes/123/edit"]}>
        <Routes>
          <Route path="/recipes/:id/edit" element={<EditRecipe />} />
        </Routes>
      </MemoryRouter>,
    );

    // Check if the BackButton, Heading, and CreateRecipeForm components are rendered
    expect(screen.getByText("BackButton")).toBeInTheDocument();
    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("CreateRecipeForm")).toBeInTheDocument();

    // Check if the CreateRecipeForm component is called with the correct props
    expect(CreateRecipeForm).toHaveBeenCalledWith(
      { mode: "edit", initialData: { id: "123", name: "Recipe Name" }, recipeId: "123" },
      {},
    );
  });

  it('should set document.title to "Edit recipe - Pabulum"', () => {
    render(<EditRecipe />);
    expect(document.title).toBe("Edit recipe - Pabulum");
  });
});

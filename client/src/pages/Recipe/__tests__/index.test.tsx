import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Recipe } from "../index.tsx";
import { RecipeDetails } from "@/components/RecipeDetails";
import { BackButton } from "@/components/BackButton";
import * as ReactRouterDom from "react-router-dom";

// Mock the useParams hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

// Mock the RecipeDetails and BackButton components
jest.mock("@/components/RecipeDetails", () => ({
  RecipeDetails: jest.fn(() => <div>RecipeDetails</div>),
}));

jest.mock("@/components/BackButton", () => ({
  BackButton: jest.fn(() => <div>BackButton</div>),
}));

describe("Recipe page", () => {
  const mockDataSource = "online";

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("should render the RecipeDetails and BackButton components", () => {
    // Set up the mock for useParams
    const useParamsMock = jest.spyOn(ReactRouterDom, "useParams");
    useParamsMock.mockReturnValue({ id: "123" });

    render(
      <MemoryRouter initialEntries={["/recipes/123"]}>
        <Routes>
          <Route path="/recipes/:id" element={<Recipe dataSource={mockDataSource} />} />
        </Routes>
      </MemoryRouter>,
    );

    // Check if the RecipeDetails and BackButton components are rendered
    expect(RecipeDetails).toHaveBeenCalledWith({ recipeId: "123", dataSource: mockDataSource }, {});
    expect(BackButton).toHaveBeenCalled();
  });

  it("should render correctly with default recipe ID when no ID is provided", () => {
    // Set up the mock for useParams
    const useParamsMock = jest.spyOn(ReactRouterDom, "useParams");
    useParamsMock.mockReturnValue({ id: "" });

    const { getByText } = render(<Recipe dataSource={mockDataSource} />);

    // Check if the BackButton component is rendered
    expect(getByText("BackButton")).toBeInTheDocument();

    // Check if the RecipeDetails component is rendered with the default ID
    expect(getByText("RecipeDetails")).toBeInTheDocument();
  });
});

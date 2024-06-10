import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RecipeDetails } from "../";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRecipe } from "@/services/useRecipe.ts";
import React from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { deleteRecipe } from "@/services/deleteRecipe.ts";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock("@/services/useRecipe.ts");
jest.mock("@/services/deleteRecipe.ts");
jest.mock("@/components/RecipeDetails/LoadingSkeletons.tsx", () => ({
  LoadingSkeletons: jest.fn(() => <div>Loading...</div>),
}));

jest.mock("sonner", () => ({
  toast: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));

const mockUserRecipeData = {
  title: "Test user recipe",
  prepTime: 30,
  servingsNumber: 4,
  diets: ["vegan"],
  description: "Test user description.",
  ingredients: [{ name: "Ingredient 1", quantity: "100g" }],
  steps: [{ number: 1, instruction: "Step 1 instruction" }],
  image: "test-user-image-url",
};

const mockOnlineRecipeData = {
  title: "Test online recipe",
  prepTime: 10,
  servingsNumber: 1,
  diets: ["gluten free"],
  description: "Test online description.",
  ingredients: [{ name: "Ingredient 1", quantity: "2l" }],
  nutrients: [{ name: "Calories", quantity: "124" }],
  steps: [{ number: 1, instruction: "Step 1 instruction" }],
  image: "test-online-image-url",
};

describe("RecipeDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render loading state", () => {
    const queryClient = new QueryClient();
    (useRecipe as jest.Mock).mockReturnValue({ isLoading: true });

    render(
      <QueryClientProvider client={queryClient}>
        <RecipeDetails recipeId={"1"} dataSource={"user"} />,
      </QueryClientProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should render error 404 state", () => {
    const queryClient = new QueryClient();
    (useRecipe as jest.Mock).mockReturnValue({ isError: true, error: { status: 404 } });

    render(
      <QueryClientProvider client={queryClient}>
        <RecipeDetails recipeId={"1"} dataSource={"user"} />,
      </QueryClientProvider>,
    );

    expect(screen.getByText("Recipe was not found")).toBeInTheDocument();
  });

  test("should render error state", () => {
    const queryClient = new QueryClient();
    (useRecipe as jest.Mock).mockReturnValue({ isError: true, error: { status: 500 } });

    render(
      <QueryClientProvider client={queryClient}>
        <RecipeDetails recipeId={"1"} dataSource={"user"} />,
      </QueryClientProvider>,
    );

    expect(screen.getByText("Sorry, we couldn't load your recipe")).toBeInTheDocument();
  });

  test("should render user recipe details", () => {
    const queryClient = new QueryClient();

    (useRecipe as jest.Mock).mockReturnValue({
      data: mockUserRecipeData,
      isLoading: false,
      isError: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RecipeDetails recipeId={"1"} dataSource={"user"} />,
      </QueryClientProvider>,
    );

    expect(screen.getByText(mockUserRecipeData.title)).toBeInTheDocument();
    expect(screen.getByText(`${mockUserRecipeData.prepTime} min`)).toBeInTheDocument();
    expect(screen.getByText(`${mockUserRecipeData.servingsNumber} servings`)).toBeInTheDocument();
    expect(screen.getByText(mockUserRecipeData.description)).toBeInTheDocument();
    expect(screen.getByText("Ingredient 1 - 100g")).toBeInTheDocument();
    expect(screen.getByText(mockUserRecipeData.steps[0].instruction)).toBeInTheDocument();
  });

  test("should render online recipe details", () => {
    const queryClient = new QueryClient();

    (useRecipe as jest.Mock).mockReturnValue({
      data: mockOnlineRecipeData,
      isLoading: false,
      isError: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RecipeDetails recipeId={"1"} dataSource={"online"} />,
      </QueryClientProvider>,
    );

    expect(screen.getByText(mockOnlineRecipeData.title)).toBeInTheDocument();
    expect(screen.getByText(`${mockOnlineRecipeData.prepTime} min`)).toBeInTheDocument();
    expect(screen.getByText(`${mockOnlineRecipeData.servingsNumber} servings`)).toBeInTheDocument();
    expect(screen.getByText(mockOnlineRecipeData.description)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockOnlineRecipeData.ingredients[0].name} - ${mockOnlineRecipeData.ingredients[0].quantity}`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(mockOnlineRecipeData.nutrients[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockOnlineRecipeData.steps[0].instruction)).toBeInTheDocument();
  });

  test("should delete recipe", async () => {
    const queryClient = new QueryClient();
    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    (useRecipe as jest.Mock).mockReturnValue({
      data: mockUserRecipeData,
      isLoading: false,
      isError: false,
    });

    (deleteRecipe as jest.Mock).mockReturnValue({
      success: true,
      message: "Data deleted successfully",
      id: "1",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RecipeDetails recipeId={"1"} dataSource={"user"} />,
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByTestId("delete-recipe-button"));
    fireEvent.click(screen.getByTestId("delete-recipe-confirm-button"));

    // await waitFor(() => {
    expect(toast.loading).toHaveBeenCalledWith("Deleting a recipe...");
    // expect(toast.success).toHaveBeenCalledWith("Recipe has been deleted");
    // });

    // expect(navigateMock).toHaveBeenCalledWith({ pathname: "/user/recipes" });
  });

  test("should handle delete recipe error", async () => {
    const queryClient = new QueryClient();

    (useRecipe as jest.Mock).mockReturnValue({
      data: mockUserRecipeData,
      isLoading: false,
      isError: false,
    });
    (deleteRecipe as jest.Mock).mockResolvedValue({
      success: false,
      message: "Error deleting recipe",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RecipeDetails recipeId={"1"} dataSource={"user"} />,
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByTestId("delete-recipe-button"));
    fireEvent.click(screen.getByTestId("delete-recipe-confirm-button"));

    await waitFor(() => {
      expect(toast.loading).toHaveBeenCalledWith("Deleting a recipe...");
      expect(toast.error).toHaveBeenCalledWith("We couldn't delete your recipe");
    });
  });
});

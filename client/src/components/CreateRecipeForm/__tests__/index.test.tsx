import "resize-observer-polyfill";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateRecipeForm } from "../index.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import * as editRecipeModule from "@/services/editRecipe.ts";

// Mock services and helpers
jest.mock("@/services/postRecipe.ts");
jest.mock("@/services/editRecipe.ts");
jest.mock("@/helpers/constants.ts", () => ({
  ACCEPTED_IMAGE_TYPES: [".jpg", ".png"],
  MAX_PREP_TIME: 120,
  MAX_SERVINGS_NUMBER: 10,
  MIN_SERVINGS_NUMBER: 1,
  PREP_TIME_STEP: 5,
  SERVINGS_NUMBER_STEP: 1,
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));

const queryClient = new QueryClient();

describe("CreateRecipeForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CreateRecipeForm {...props} />
        </BrowserRouter>
      </QueryClientProvider>,
    );
  };

  it("should handle form editing", async () => {
    const editRecipeMock = editRecipeModule.editRecipe as jest.MockedFunction<
      typeof editRecipeModule.editRecipe
    >;
    editRecipeMock.mockResolvedValueOnce({ success: true, id: "123" });

    const initialData = {
      title: "Initial Recipe",
      // image: 'https://picsum.photos/300/200',
      prepTime: 20,
      servingsNumber: 2,
      description: "Initial description",
      diets: ["vegetarian"],
      ingredients: [{ name: "Ingredient 1", quantity: "1 cup" }],
      steps: [{ instruction: "Step 1" }],
    };

    renderComponent({ mode: "edit", initialData, recipeId: "123" });

    // Output the whole rendered screen
    // screen.debug(document.body);

    // Check initial values
    expect(screen.getByLabelText("Title")).toHaveValue("Initial Recipe");
    expect(screen.getByLabelText("Prep time")).toHaveValue("20");
    expect(screen.getByLabelText("Servings")).toHaveValue("2");
    expect(screen.getByLabelText("Description")).toHaveValue("Initial description");
    expect(screen.getByRole("checkbox", { name: /vegetarian/i })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    await userEvent.click(screen.getByRole("checkbox", { name: /vegetarian/i }));
    expect(screen.getByRole("checkbox", { name: /vegetarian/i })).toHaveAttribute(
      "aria-checked",
      "false",
    );

    // // Update form fields
    // await userEvent.type(screen.getByLabelText("Title"), " (Updated)");
    // await userEvent.type(screen.getByLabelText("Prep time"), "30");
    // await userEvent.type(screen.getByLabelText("Servings"), "4");
    // await userEvent.type(screen.getByLabelText("Description"), " (Updated)");
    // await userEvent.click(screen.getByRole("checkbox", { name: /vegan/i }));
    //
    // // Submit form
    // await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    //TODO: Navigation
    //
    // // Wait for navigation
    // await waitFor(() => {
    //   // expect(navigateMock).toHaveBeenCalledWith("/user/recipes/123");
    //   expect(window.location.pathname).toBe("/");
    // });
  });

  it("should handle edit cancel", async () => {
    const editRecipeMock = editRecipeModule.editRecipe as jest.MockedFunction<
      typeof editRecipeModule.editRecipe
    >;
    editRecipeMock.mockResolvedValueOnce({ success: true, id: "123" });

    const initialData = {
      title: "Initial Recipe",
      image: "https://picsum.photos/300/200",
      prepTime: 20,
      servingsNumber: 2,
      description: "Initial description",
      diets: ["vegetarian"],
      ingredients: [{ name: "Ingredient 1", quantity: "1 cup" }],
      steps: [{ instruction: "Step 1" }],
    };

    renderComponent({ mode: "edit", initialData, recipeId: "123" });

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/user/recipes/123");
    });
  });
});

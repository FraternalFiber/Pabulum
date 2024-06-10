import { render, screen, fireEvent } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { IngredientsDynamicList } from "../IngredientsDynamicList";

// Mock the useFieldArray hook
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useFieldArray: jest.fn(),
}));

describe("IngredientsDynamicList", () => {
  const mockAppend = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    const { useFieldArray } = jest.requireMock("react-hook-form");
    (useFieldArray as jest.Mock).mockReturnValue({
      fields: [
        { id: "1", name: "Ingredient 1", quantity: "1 cup" },
        { id: "2", name: "Ingredient 2", quantity: "2 tbsp" },
        { id: "3", name: "", quantity: "" },
      ],
      append: mockAppend,
      remove: mockRemove,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const TestComponent = () => {
    const methods = useForm({
      defaultValues: {
        ingredients: [
          { id: "1", name: "Ingredient 1", quantity: "1 cup" },
          { id: "2", name: "Ingredient 2", quantity: "2 tbsp" },
          { id: "3", name: "", quantity: "" },
        ],
      },
    });

    return (
      <FormProvider {...methods}>
        <IngredientsDynamicList form={methods} />
      </FormProvider>
    );
  };

  it("should render the ingredients rows correctly", () => {
    render(<TestComponent />);

    // Check if the "Ingredients" heading is rendered
    expect(screen.getByText("Ingredients")).toBeInTheDocument();

    // Check if the correct number of ingredient rows are rendered
    const ingredientNameInputs = screen.getAllByPlaceholderText("Ingredient name");
    expect(ingredientNameInputs).toHaveLength(3);

    const quantityInputs = screen.getAllByPlaceholderText("Quantity");
    expect(quantityInputs).toHaveLength(3);

    // Check if the delete buttons are rendered
    const deleteButtons = screen.getAllByTestId("delete-ingredient-button");
    expect(deleteButtons).toHaveLength(3);
  });

  it('adds a new ingredient row when the "Add Step" button is clicked', () => {
    render(<TestComponent />);

    const addStepButton = screen.getByTestId("add-ingredient-button");
    fireEvent.click(addStepButton);

    expect(mockAppend).toHaveBeenCalledWith({ name: "", quantity: "" });
  });

  it("removes an ingredient row when the delete button is clicked", () => {
    render(<TestComponent />);

    const deleteButtons = screen.getAllByTestId("delete-ingredient-button");
    fireEvent.click(deleteButtons[1]);

    expect(mockRemove).toHaveBeenCalledWith(1);
  });
});

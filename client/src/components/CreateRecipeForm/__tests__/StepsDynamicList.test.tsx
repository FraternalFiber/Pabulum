import { render, screen, fireEvent } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { StepsDynamicList } from "../StepsDynamicList";

// Mock the useFieldArray hook
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useFieldArray: jest.fn(),
}));

describe("StepsDynamicList", () => {
  const mockAppend = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    const { useFieldArray } = jest.requireMock("react-hook-form");
    (useFieldArray as jest.Mock).mockReturnValue({
      fields: [
        { id: "1", instruction: "Step 1" },
        { id: "2", instruction: "Step 2" },
        { id: "3", instruction: "" },
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
        steps: [
          { id: "1", instruction: "Step 1" },
          { id: "2", instruction: "Step 2" },
          { id: "3", instruction: "" },
        ],
      },
    });

    return (
      <FormProvider {...methods}>
        <StepsDynamicList form={methods} />
      </FormProvider>
    );
  };

  it("should render the steps rows correctly", () => {
    render(<TestComponent />);

    // Check if the "Steps" heading is rendered
    expect(screen.getByText("Steps")).toBeInTheDocument();

    // Check if the correct number of steps are rendered
    const stepInstructions = screen.getAllByRole("textbox");
    expect(stepInstructions).toHaveLength(3);

    // Check if the delete buttons are rendered
    const deleteButtons = screen.getAllByTestId("delete-step-button");
    expect(deleteButtons).toHaveLength(3);
  });

  it('should add a new step when the "Add Step" button is clicked', () => {
    render(<TestComponent />);

    const addStepButton = screen.getByTestId("add-step-button");
    fireEvent.click(addStepButton);

    expect(mockAppend).toHaveBeenCalledWith({ instruction: "" });
  });

  it("should remove a step when the delete button is clicked", () => {
    render(<TestComponent />);

    const deleteButtons = screen.getAllByTestId("delete-step-button");
    fireEvent.click(deleteButtons[2]);

    expect(mockRemove).toHaveBeenCalledWith(2);
  });
});

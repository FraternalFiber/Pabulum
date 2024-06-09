import { render, fireEvent } from "@testing-library/react";
import { SubtractButton } from "../SubtractButton";

describe("SubtractButton", () => {
  const mockForm = {
    getValues: jest.fn(),
    setValue: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the button correctly", () => {
    const { getByRole } = render(<SubtractButton form={mockForm} fieldName="prepTime" />);
    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should decrease the value by step when clicked", () => {
    const { getByRole } = render(<SubtractButton form={mockForm} fieldName="prepTime" step={5} />);
    const button = getByRole("button");

    mockForm.getValues.mockReturnValueOnce(20);
    fireEvent.click(button);
    expect(mockForm.setValue).toHaveBeenCalledWith("prepTime", 15);
  });

  it("should round down the value to the nearest multiple of step", () => {
    const { getByRole } = render(<SubtractButton form={mockForm} fieldName="prepTime" step={5} />);
    const button = getByRole("button");

    mockForm.getValues.mockReturnValueOnce(23);
    fireEvent.click(button);
    expect(mockForm.setValue).toHaveBeenCalledWith("prepTime", 20);
  });

  it("should not decrease the value below minValue", () => {
    const { getByRole } = render(
      <SubtractButton form={mockForm} fieldName="prepTime" step={5} minValue={10} />,
    );
    const button = getByRole("button");

    mockForm.getValues.mockReturnValueOnce(13);
    fireEvent.click(button);
    expect(mockForm.setValue).toHaveBeenCalledWith("prepTime", 10);
  });

  it("should not decrease the value if the input is not a number", () => {
    const { getByRole } = render(<SubtractButton form={mockForm} fieldName="prepTime" step={5} />);
    const button = getByRole("button");

    mockForm.getValues.mockReturnValueOnce("abc");
    fireEvent.click(button);
    expect(mockForm.setValue).not.toHaveBeenCalled();
  });
});

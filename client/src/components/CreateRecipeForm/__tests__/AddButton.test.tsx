import { render, fireEvent } from "@testing-library/react";
import { AddButton } from "../AddButton";

describe("AddButton", () => {
  const mockForm = {
    getValues: jest.fn(),
    setValue: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the button correctly", () => {
    const { getByRole } = render(<AddButton form={mockForm} fieldName="prepTime" />);
    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should increase the value by step when clicked", () => {
    const { getByRole } = render(<AddButton form={mockForm} fieldName="prepTime" step={5} />);
    const button = getByRole("button");

    mockForm.getValues.mockReturnValueOnce(10);
    fireEvent.click(button);
    expect(mockForm.setValue).toHaveBeenCalledWith("prepTime", 15);
  });

  it("should round up the value to the nearest multiple of step", () => {
    const { getByRole } = render(<AddButton form={mockForm} fieldName="prepTime" step={5} />);
    const button = getByRole("button");

    mockForm.getValues.mockReturnValueOnce(13);
    fireEvent.click(button);
    expect(mockForm.setValue).toHaveBeenCalledWith("prepTime", 15);
  });

  it("should not increase the value above maxValue", () => {
    const { getByRole } = render(
      <AddButton form={mockForm} fieldName="prepTime" step={5} maxValue={20} />,
    );
    const button = getByRole("button");

    mockForm.getValues.mockReturnValueOnce(18);
    fireEvent.click(button);
    expect(mockForm.setValue).toHaveBeenCalledWith("prepTime", 20);
  });

  it("should not increase the value if the input is not a number", () => {
    const { getByRole } = render(<AddButton form={mockForm} fieldName="prepTime" step={5} />);
    const button = getByRole("button");

    mockForm.getValues.mockReturnValueOnce("abc");
    fireEvent.click(button);
    expect(mockForm.setValue).not.toHaveBeenCalled();
  });
});

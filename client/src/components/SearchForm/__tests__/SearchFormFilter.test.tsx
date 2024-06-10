import { render, fireEvent, screen } from "@testing-library/react";
import { SearchFormFilter } from "../SearchFormFilter";
import { useForm } from "react-hook-form";

jest.mock("react-hook-form", () => ({
  useForm: jest.fn(() => ({
    control: {},
    getValues: jest.fn(() => []),
    setValue: jest.fn(),
    watch: jest.fn(),
  })),
}));

jest.mock("@/components/ui/button", () => ({
  Button: jest.fn(({ children, onClick }) => <button onClick={onClick}>{children}</button>),
}));

jest.mock("@/components/ui/popover", () => ({
  Popover: jest.fn(({ children }) => <div data-testid="popover">{children}</div>),
  PopoverTrigger: jest.fn(({ children }) => <div>{children}</div>),
  PopoverContent: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock("@/components/ui/command", () => ({
  Command: jest.fn(({ children }) => <div>{children}</div>),
  CommandInput: jest.fn(({ ...props }) => <input {...props} />),
  CommandGroup: jest.fn(({ children }) => <div>{children}</div>),
  CommandItem: jest.fn(({ children, onSelect }) => <div onClick={onSelect}>{children}</div>),
  CommandEmpty: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock("@/components/ui/checkbox", () => ({
  Checkbox: jest.fn(({ checked }) => <input type="checkbox" checked={checked} />),
}));

jest.mock("lucide-react", () => ({
  ChevronsUpDown: jest.fn(() => <svg data-testid="chevrons-icon" />),
}));

describe("SearchFormFilter", () => {
  let formMethods: any;

  beforeEach(() => {
    formMethods = useForm();
  });

  const mockItems = [
    { label: "Item 1", value: "item1" },
    { label: "Item 2", value: "item2" },
    { label: "Item 3", value: "item3" },
  ];

  test("should render correctly", () => {
    render(
      <SearchFormFilter
        title="Test Filter"
        fieldName="testField"
        items={mockItems}
        form={formMethods}
      />,
    );
    expect(screen.getByText("Test Filter")).toBeInTheDocument();
    expect(screen.getByTestId("chevrons-icon")).toBeInTheDocument();
  });

  test("should open and close popover", () => {
    render(
      <SearchFormFilter
        title="Test Filter"
        fieldName="testField"
        items={mockItems}
        form={formMethods}
      />,
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByTestId("popover")).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });

  test("should display items in the popover", () => {
    render(
      <SearchFormFilter
        title="Test Filter"
        fieldName="testField"
        items={mockItems}
        form={formMethods}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    mockItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  test("should toggle item selection", () => {
    const setValue = jest.fn();
    formMethods.setValue = setValue;
    render(
      <SearchFormFilter
        title="Test Filter"
        fieldName="testField"
        items={mockItems}
        form={formMethods}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Item 1"));
    expect(setValue).toHaveBeenCalledWith("testField", ["item1"]);
    fireEvent.click(screen.getByText("Item 1"));
    expect(setValue).toHaveBeenCalledWith("testField", []);
  });

  test("should show selected items count in badge", () => {
    render(
      <SearchFormFilter
        title="Test Filter"
        fieldName="testField"
        items={mockItems}
        form={formMethods}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Item 1"));
    fireEvent.click(screen.getByText("Item 2"));
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test('should display "No results" when no items match input', () => {
    render(
      <SearchFormFilter
        title="Test Filter"
        fieldName="testField"
        items={mockItems}
        form={formMethods}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    const input = screen.getByPlaceholderText("Search items...");
    fireEvent.change(input, { target: { value: "Nonexistent Item" } });
    expect(screen.getByText("No results")).toBeInTheDocument();
  });
});

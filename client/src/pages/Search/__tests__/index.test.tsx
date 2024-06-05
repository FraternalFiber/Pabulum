import { render } from "@testing-library/react";
import { Search } from "@/pages/Search";
import "@testing-library/jest-dom";

// Mock the imported components
jest.mock("@/components/SearchForm", () => ({
  SearchForm: () => <div>SearchForm component</div>,
}));
jest.mock("@/components/Heading", () => ({
  Heading: ({ content }: { content: string }) => <div>{content}</div>,
}));

describe("Search page", () => {
  it("should render correctly", () => {
    const { getByText } = render(<Search />);

    // Check if the Heading component is rendered with correct text
    expect(getByText("Find your favourite recipes")).toBeInTheDocument();

    // Check if the SearchForm component is rendered
    expect(getByText("SearchForm component")).toBeInTheDocument();
  });

  it('should set document.title to "Search recipes - Pabulum"', () => {
    render(<Search />);
    expect(document.title).toBe("Search recipes - Pabulum");
  });
});

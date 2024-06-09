import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SearchForm } from "../index.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

jest.mock("@/components/SearchResults", () => ({
  SearchResults: ({ searchParams }: { searchParams: any }) => (
    <div data-testid="search-results">{JSON.stringify(searchParams)}</div>
  ),
}));

describe("SearchForm", () => {
  it("should renders the form", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SearchForm />
        </BrowserRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByPlaceholderText("Dish name...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("should submit the form with valid input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SearchForm />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    const searchInput = screen.getByPlaceholderText("Dish name...");
    const submitButton = screen.getByRole("button", { name: "Search" });

    fireEvent.change(searchInput, { target: { value: "Pasta" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("search-results")).toHaveTextContent("Pasta");
    });
  });

  //TODO: should update the form values when URL search params change

  // it("should update the form values when URL search params change", async () => {
  //   // Set up the mock for useParams
  //   // const useParamsMock = jest.spyOn(ReactRouterDom, "useParams");
  //   // useParamsMock.mockReturnValue({ id: "123" });
  //
  //   // Create a URLSearchParams object with the desired query params
  //   const searchParams = new URLSearchParams();
  //   searchParams.set("q", "pizza");
  //
  //   render(
  //     <MemoryRouter initialEntries={[`/search?${searchParams.toString()}`]}>
  //       <Routes>
  //         <Route path="/search" element={<SearchForm />} />
  //       </Routes>
  //     </MemoryRouter>,
  //   );
  //
  //   // Wait for the form values to update
  //   expect(screen.getByPlaceholderText("Dish name...")).toHaveValue("pizza");
  //   screen.debug(document.body);
  // });

  // it('should update the form values when URL search params change', async () => {
  //     const routes = [
  //         {
  //             path: '/',
  //             element: <SearchForm />,
  //         },
  //     ];
  //
  //     // Create a URLSearchParams object with the desired query params
  //     const searchParams = new URLSearchParams();
  //     searchParams.set('q', 'pizza');
  //
  //     // Create the router instance with the initial entries
  //     const router = createMemoryRouter(routes, {
  //         initialEntries: [`/?${searchParams.toString()}`],
  //     });
  //
  //     // Render the component with the router instance
  //     render(<RouterProvider router={router} />);
  //
  //     // Wait for the form values to update
  //     await waitFor(() => {
  //         expect(screen.getByPlaceholderText('Dish name...')).toHaveValue('pizza');
  //     });
  // });
});

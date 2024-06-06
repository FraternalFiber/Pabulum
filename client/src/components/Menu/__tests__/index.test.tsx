import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Menu } from "../";

describe("Menu", () => {
  it("should render the menu buttons with correct links", () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>,
    );

    const searchButton = screen.getByTestId("Search recipes");
    const discoverButton = screen.getByTestId("Discover");
    const myRecipesButton = screen.getByTestId("My recipes");
    const pantryButton = screen.getByTestId("My pantry");
    const createRecipeButton = screen.getByTestId("Create recipe");
    const accountButton = screen.getByTestId("My account");

    expect(searchButton).toHaveAttribute("href", "/search");
    expect(discoverButton).toHaveAttribute("href", "/discover");
    expect(myRecipesButton).toHaveAttribute("href", "/user/recipes");
    expect(pantryButton).toHaveAttribute("href", "/pantry");
    expect(createRecipeButton).toHaveAttribute("href", "/user/recipes/create");
    expect(accountButton).toHaveAttribute("href", "/account");
  });

  it("should highlight the active menu button", () => {
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <Menu />
      </MemoryRouter>,
    );

    const activeButton = screen.getByTestId("Search recipes");
    expect(activeButton).toHaveClass("bg-primary");
  });
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RecipeResultCard } from "../";
import { TDataSource } from "@/types/TDataSource.ts";
import noImagePlaceholder from "@/assets/images/no_image_placeholder.png";

describe("RecipeResultCard", () => {
  const defaultProps = {
    id: 1,
    title: "Recipe Title",
    dataSource: "online" as TDataSource,
  };

  it("renders the card with the correct title", () => {
    render(
      <MemoryRouter>
        <RecipeResultCard {...defaultProps} />
      </MemoryRouter>,
    );

    const cardTitle = screen.getByText("Recipe Title");
    expect(cardTitle).toBeInTheDocument();
  });

  it("renders the card with the default image placeholder", () => {
    render(
      <MemoryRouter>
        <RecipeResultCard {...defaultProps} />
      </MemoryRouter>,
    );

    const imageElement = screen.getByTestId("recipe-result-card-image");
    expect(imageElement).toHaveStyle({
      backgroundImage: `url(undefined), url(${noImagePlaceholder})`,
    });
  });

  it("renders the card with the provided image URL", () => {
    const imageUrl = "https://example.com/image.jpg";
    render(
      <MemoryRouter>
        <RecipeResultCard {...defaultProps} imageUrl={imageUrl} />
      </MemoryRouter>,
    );

    const imageElement = screen.getByTestId("recipe-result-card-image");
    expect(imageElement).toHaveStyle({
      backgroundImage: `url(${imageUrl}), url(${noImagePlaceholder})`,
    });
  });

  it("renders the card with the correct link for online recipes", () => {
    render(
      <MemoryRouter>
        <RecipeResultCard {...defaultProps} />
      </MemoryRouter>,
    );

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/recipes/1");
  });

  it("renders the card with the correct link for user recipes", () => {
    render(
      <MemoryRouter>
        <RecipeResultCard {...defaultProps} dataSource="user" />
      </MemoryRouter>,
    );

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/user/recipes/1");
  });
});

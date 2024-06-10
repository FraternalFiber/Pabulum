import { fireEvent, render } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { BackButton } from "../";

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("BackButton", () => {
  it("should render the default back button correctly", () => {
    const { getByText } = render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>,
    );

    expect(getByText("Back")).toBeInTheDocument();
  });

  it("should render the back button with custom text correctly", () => {
    const { getByText } = render(
      <MemoryRouter>
        <BackButton text="Go Back" />
      </MemoryRouter>,
    );

    expect(getByText("Go Back")).toBeInTheDocument();
  });

  it("should render the back button as a button element correctly", () => {
    const { getByText } = render(
      <MemoryRouter>
        <BackButton type="button" />
      </MemoryRouter>,
    );

    const backButton = getByText("Back");
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveProperty("type", "button");
  });

  it("should navigate back when the back button is clicked", () => {
    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    const { getByText } = render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>,
    );

    const backButton = getByText("Back");
    fireEvent.click(backButton);

    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});

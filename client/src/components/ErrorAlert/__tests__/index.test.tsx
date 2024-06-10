import { render, screen } from "@testing-library/react";
import { ErrorAlert } from "../";

describe("ErrorAlert", () => {
  it("should render the default alert with the correct title and message", () => {
    const message = "This is an error message";
    render(<ErrorAlert message={message} />);

    const alertTitle = screen.getByText("Error");
    const alertDescription = screen.getByText(message);

    expect(alertTitle).toBeInTheDocument();
    expect(alertDescription).toBeInTheDocument();
  });

  it("should render the alert with a custom title", () => {
    const title = "Custom error title";
    const message = "This is an error message";
    render(<ErrorAlert title={title} message={message} />);

    const alertTitle = screen.getByText(title);
    const alertDescription = screen.getByText(message);

    expect(alertTitle).toBeInTheDocument();
    expect(alertDescription).toBeInTheDocument();
  });

  it("should render the alert with the destructive variant", () => {
    const message = "This is an error message";
    render(<ErrorAlert message={message} variant="destructive" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("text-destructive");
  });

  it("should render the alert with the default variant", () => {
    const message = "This is an error message";
    render(<ErrorAlert message={message} variant="default" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("text-foreground");
  });

  it("should render the alert with a custom className", () => {
    const message = "This is an error message";
    const className = "custom-class";
    render(<ErrorAlert message={message} className={className} />);

    const alertContainer = screen.getByRole("alert").parentElement;
    expect(alertContainer).toHaveClass(className);
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { ImagePreview } from "../ImagePreview";

// Mocking dependencies
jest.mock("@/lib/utils.ts", () => ({
  cn: jest.fn((...classes) => classes.filter(Boolean).join(" ")),
}));

jest.mock("lucide-react", () => ({
  Trash2: () => <svg data-testid="trash-icon" />,
}));

jest.mock("@/components/ui/button.tsx", () => ({
  Button: ({ ...props }) => <button {...props}>Button</button>,
}));

// Mocking URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => "mock-url");
global.URL.revokeObjectURL = jest.fn();

describe("ImagePreview", () => {
  let mockFile: File,
    mockDeleteImage: any,
    mockHandleImageError: any,
    mockOnlineImageUrl: null | string;

  beforeEach(() => {
    mockFile = new File(["(⌐□_□)"], "cool.png", { type: "image/png" });
    mockDeleteImage = jest.fn();
    mockHandleImageError = jest.fn();
    mockOnlineImageUrl = null;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render without crashing", () => {
    render(
      <ImagePreview
        file={mockFile}
        deleteImage={mockDeleteImage}
        handleImageError={mockHandleImageError}
        onlineImageUrl={mockOnlineImageUrl}
      />,
    );
  });

  // it("should display the image when file is provided", async () => {
  //   render(
  //     <ImagePreview
  //       file={mockFile}
  //       deleteImage={mockDeleteImage}
  //       handleImageError={mockHandleImageError}
  //       onlineImageUrl={mockOnlineImageUrl}
  //     />,
  //   );
  //
  //   const img = await screen.findByRole("img");
  //   expect(img).toHaveAttribute("src", expect.stringContaining("blob:"));
  // });

  it("should display the image when onlineImageUrl is provided", () => {
    mockOnlineImageUrl = "http://example.com/image.png";

    render(
      <ImagePreview
        file={undefined}
        deleteImage={mockDeleteImage}
        handleImageError={mockHandleImageError}
        onlineImageUrl={mockOnlineImageUrl}
      />,
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockOnlineImageUrl);
  });

  it("should handle image load correctly", async () => {
    render(
      <ImagePreview
        file={mockFile}
        deleteImage={mockDeleteImage}
        handleImageError={mockHandleImageError}
        onlineImageUrl={mockOnlineImageUrl}
      />,
    );

    const img = await screen.findByRole("img");
    fireEvent.load(img);
    expect(img).toHaveClass("block");
  });

  it("should handle image error correctly", async () => {
    render(
      <ImagePreview
        file={mockFile}
        deleteImage={mockDeleteImage}
        handleImageError={mockHandleImageError}
        onlineImageUrl={mockOnlineImageUrl}
      />,
    );

    const img = await screen.findByRole("img");
    fireEvent.error(img);
    expect(mockHandleImageError).toHaveBeenCalled();
  });

  it("should call deleteImage when delete button is clicked", async () => {
    render(
      <ImagePreview
        file={mockFile}
        deleteImage={mockDeleteImage}
        handleImageError={mockHandleImageError}
        onlineImageUrl={mockOnlineImageUrl}
      />,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockDeleteImage).toHaveBeenCalled();
  });
});

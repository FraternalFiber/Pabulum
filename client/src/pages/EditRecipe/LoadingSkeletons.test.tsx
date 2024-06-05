import { render } from "@testing-library/react";
import { LoadingSkeletons } from "./LoadingSkeletons.tsx";

describe("LoadingSkeletons", () => {
  it("renders correctly", () => {
    const { container } = render(<LoadingSkeletons />);
    expect(container).toMatchSnapshot();
  });
});

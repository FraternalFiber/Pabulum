import { render } from "@testing-library/react";
import { LoadingSkeletons } from "../LoadingSkeletons.tsx";

describe("LoadingSkeletons", () => {
  it("should render loading skeletons with user data source", () => {
    const { container } = render(<LoadingSkeletons dataSource={"user"} />);
    expect(container).toMatchSnapshot();
  });

  it("should render loading skeletons with online data source", () => {
    const { container } = render(<LoadingSkeletons dataSource={"online"} />);
    expect(container).toMatchSnapshot();
  });
});

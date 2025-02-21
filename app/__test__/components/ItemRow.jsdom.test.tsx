import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import ItemRow from "@/app/_components/ItemRow";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("ItemRow", () => {
  (usePathname as jest.Mock).mockReturnValue("/applications");

  it("renders ItemRow correctly", () => {
    const item = {
      id: "1",
      icon: "/test.png",
      name: "Test Row",
    };
    const urlPath = "entities";
    render(<ItemRow item={item} urlPath={urlPath} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/applications/1/entities"
    );
  });
});

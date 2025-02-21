import "@testing-library/jest-dom";
// import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import BreadcrumbsNav from "@/app/_components/BreadcrumbsNav";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("BreadcrumbsNav", () => {
  it("renders the home element and breadcrumbs correctly", () => {
    // as jest.Mock - TypeScirpt type assertition
    (usePathname as jest.Mock).mockReturnValue("/");

    render(
      <BreadcrumbsNav
        separator="&rarr;"
        homeElement="Home"
        activeClass="active"
        listClass="crumb"
        containerClass="breadcrumbs"
      />
    );

    const homePage = screen.getByText("Home");
    // Check if the container is rendered with the correct class
    expect(screen.getByRole("list")).toHaveClass("breadcrumbs");

    // Check if the home element is rendered
    expect(homePage).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("renders breadcrumbs navigation", async () => {
    (usePathname as jest.Mock).mockReturnValue(
      "/applications/_id1/entities/_id2/accounts/_id3/users"
    );
    // const user = userEvent.setup();
    render(
      <BreadcrumbsNav
        separator="&rarr;"
        homeElement="Home"
        activeClass="active"
        listClass="crumb"
        containerClass="breadcrumbs"
      />
    );

    const links = screen.getAllByRole("link");
    const lastLink = links[links.length - 1];
    const breadcrumbClick = screen.getByRole("link", { name: "Entities" });

    // Check Last element
    expect(lastLink).toHaveTextContent("Users");
    expect(lastLink.closest("li")).toHaveClass("active");
    expect(lastLink.closest("li")).toHaveClass("crumb");
    expect(breadcrumbClick).toHaveAttribute(
      "href",
      "/applications/_id1/entities"
    );
    // await user.click(breadcrumbClick);
  });
});

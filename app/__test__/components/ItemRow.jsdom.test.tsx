import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ItemRow from "@/app/_components/ItemRow";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Mock next/navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

const baseItem = {
  id: "123",
  name: "Test Item",
  icon: "/test-icon.png",
  role: "admin",
};

describe("ItemRow", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });

    (usePathname as jest.Mock).mockReturnValue("/app/entities");

    // You can override this in specific tests
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        const map: Record<string, string | null> = {
          settings: null,
          managementId: null,
          resourceType: null,
        };
        return map[key] ?? null;
      },
      toString: () => "",
    });
  });

  it("renders item name and icon", () => {
    render(
      <ItemRow
        item={baseItem}
        urlPath="accounts"
        collectionName=""
        hasSettings={false}
      />
    );

    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(screen.getByLabelText("Icon for Test Item")).toBeInTheDocument();
  });

  it("renders user role if resourceType is 'users'", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === "resourceType" ? "users" : null),
      toString: () => "resourceType=users",
    });

    render(
      <ItemRow
        item={{ ...baseItem, role: "admin" }}
        urlPath="accounts"
        collectionName="users"
        hasSettings={false}
      />
    );

    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  it("renders settings button if hasSettings is true and collectionName is empty", () => {
    render(
      <ItemRow
        item={baseItem}
        urlPath="accounts"
        collectionName=""
        hasSettings={true}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("clicking settings toggles query params", () => {
    render(
      <ItemRow
        item={baseItem}
        urlPath="accounts"
        collectionName=""
        hasSettings={true}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith(
      `?settings=true&managementId=${baseItem.id}`
    );
  });

  it("clicking settings with existing settings for another item resets settings", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        const map: Record<string, string | null> = {
          settings: "true",
          managementId: "other-id",
        };
        return map[key] ?? null;
      },
      toString: () => "settings=true&managementId=other-id",
    });

    render(
      <ItemRow
        item={baseItem}
        urlPath="accounts"
        collectionName=""
        hasSettings={true}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockReplace).toHaveBeenCalledWith(
      `?settings=true&managementId=${baseItem.id}`
    );
  });
});

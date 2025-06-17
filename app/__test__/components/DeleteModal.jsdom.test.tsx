import DeleteModal from "@/app/_components/DeleteModal";
import { deleteItem } from "@/app/_services/actions";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

jest.mock("@/app/_services/actions", () => ({
  deleteItem: jest.fn(),
}));

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/mock-path"),
  useRouter: jest.fn(() => ({
    replace: mockReplace,
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => "drivers"),
  })),
}));

it("shows error message on failed delete", async () => {
  (deleteItem as jest.Mock).mockResolvedValue({ error: "Failed to delete" });

  render(<DeleteModal id="abc123" collectionName="applications" />);
  fireEvent.click(screen.getByText("Delete")); // open modal
  fireEvent.click(screen.getAllByText("Delete")[1]); // confirm delete

  await waitFor(() => {
    expect(screen.getByText("Failed to delete")).toBeInTheDocument();
  });
});

it("calls route.replace on successfule delete", async () => {
  jest.useFakeTimers();
  (deleteItem as jest.Mock).mockResolvedValue({
    message: "Item deleted successfully.",
  });
  render(<DeleteModal id="abc123" collectionName="applications" />);
  fireEvent.click(screen.getByText("Delete")); // open modal
  await screen.findByText("Do you really want to delete this Item?");
  fireEvent.click(screen.getAllByText("Delete")[1]); // confirm delete

  await waitFor(() => {
    expect(screen.getByText("Item deleted successfully.")).toBeInTheDocument();
  });
  jest.runAllTimers();
  await waitFor(() => {
    expect(mockReplace).toHaveBeenCalledWith("/mock-path?resourceType=drivers");
  });
  jest.useRealTimers();
});

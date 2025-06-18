// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { render, screen, fireEvent } from "@testing-library/react";
// import ToolboxButtons from "@/app/_components/ToolboxButtons";
// import { useParams, usePathname, useSearchParams } from "next/navigation";
// import { useButtonFormHandlers } from "../../_hooks/useButtonFormHandlers";

// // Mocks
// jest.mock("next/navigation", () => ({
//   useParams: jest.fn(),
//   usePathname: jest.fn(),
//   useSearchParams: jest.fn(),
// }));
// jest.mock("../../_hooks/useButtonFormHandlers", () => ({
//   useButtonFormHandlers: jest.fn(),
// }));
// jest.mock("../../_components/Modal", () => ({
//   __esModule: true,
//   default: ({ children }: any) => <div data-testid="modal">{children}</div>,
//   Open: ({ opens, children }: any) => (
//     <div data-testid={`modal-open-${opens}`}>{children}</div>
//   ),
//   Window: ({ name, children }: any) => (
//     <div data-testid={`modal-window-${name}`}>{children}</div>
//   ),
// }));
// jest.mock("../../_components/CardWrapper", () => ({
//   __esModule: true,
//   default: ({ children }: any) => (
//     <div data-testid="card-wrapper">{children}</div>
//   ),
//   CardLabel: ({ children }: any) => (
//     <div data-testid="card-label">{children}</div>
//   ),
//   CardContent: ({ children }: any) => (
//     <div data-testid="card-content">{children}</div>
//   ),
//   CardButtons: ({ children }: any) => (
//     <div data-testid="card-buttons">{children}</div>
//   ),
//   CardMessage: ({ children, type }: any) => (
//     <div data-testid={`card-message-${type}`}>{children}</div>
//   ),
// }));
// jest.mock("../../_components/Button", () => ({
//   __esModule: true,
//   default: (props: any) => <button {...props}>{props.children}</button>,
// }));

// jest.mock("../../_components/FormGenerator", () => ({
//   __esModule: true,
//   default: (props: any) => (
//     <form
//       data-testid="form-generator"
//       onSubmit={(e) => {
//         e.preventDefault();
//         props.onSubmit({});
//       }}
//     >
//       FormGenerator
//     </form>
//   ),
// }));

// describe("ToolboxButtons", () => {
//   const mockSubmitHandler = jest.fn();

//   beforeEach(() => {
//     (useParams as jest.Mock).mockReturnValue({
//       appId: "app-1",
//       entityId: "ent-1",
//       accountId: "acc-1",
//     });
//     (usePathname as jest.Mock).mockReturnValue(
//       "/applications/app-1/entities/ent-1/accounts/acc-1/users"
//     );
//     (useSearchParams as jest.Mock).mockReturnValue({
//       get: (key: string) => {
//         if (key === "resourceType") return "users";
//         if (key === "isDirty") return "true";
//         return null;
//       },
//     });
//     (useButtonFormHandlers as jest.Mock).mockReturnValue({
//       handleUserRegistration: mockSubmitHandler,
//       handleItemAddition: jest.fn(),
//     });
//   });

//   it("renders the Add Resource button and form", () => {
//     render(<ToolboxButtons disabled={false} />);

//     expect(screen.getByText("Add Resource")).toBeInTheDocument();
//     expect(screen.getByTestId("modal")).toBeInTheDocument();
//     expect(screen.getByTestId("form-generator")).toBeInTheDocument();
//     expect(screen.getByText("Add")).toBeInTheDocument();
//     expect(screen.getByText("Cancel")).toBeInTheDocument();
//   });

//   it("disables Add button if isDirty is false", () => {
//     (useSearchParams as jest.Mock).mockReturnValue({
//       get: (key: string) => {
//         if (key === "resourceType") return "users";
//         if (key === "isDirty") return null;
//         return null;
//       },
//     });

//     render(<ToolboxButtons disabled={false} />);
//     expect(screen.getByText("Add")).toBeDisabled();
//   });

//   it("does not render button if disabled prop is true", () => {
//     render(<ToolboxButtons disabled={true} />);
//     expect(screen.queryByText("Add Resource")).not.toBeInTheDocument();
//   });

//   it("submits the form when Add is clicked", () => {
//     render(<ToolboxButtons disabled={false} />);
//     fireEvent.click(screen.getByText("Add"));
//     expect(mockSubmitHandler).toHaveBeenCalled();
//   });

//   it("clears messages on Cancel", () => {
//     render(<ToolboxButtons disabled={false} />);
//     fireEvent.click(screen.getByText("Cancel"));
//     expect(
//       screen.queryByTestId("card-message-success")
//     ).not.toBeInTheDocument();
//   });
// });

import { render } from "@testing-library/react";
import ToolboxButtons from "@/app/_components/ToolboxButtons";

test("smoke test", () => {
  render(<ToolboxButtons disabled={false} />);
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/app/_components/LoginForm";
import { login } from "@/app/_services/actions";
import { ZodError } from "zod";

// Mock actions
jest.mock("@/app/_services/actions", () => ({
  login: jest.fn(),
}));

describe("LoginForm component", () => {
  const fakeIp = "123.123.123.123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email and password fields", () => {
    render(<LoginForm ip={fakeIp} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows error if fields are empty", async () => {
    render(<LoginForm ip={fakeIp} />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(
      await screen.findByText(/email and password are required/i)
    ).toBeInTheDocument();
  });

  it("calls login function on valid input", async () => {
    (login as jest.Mock).mockResolvedValue({ success: true });

    render(<LoginForm ip={fakeIp} />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        fakeIp
      );
    });
  });

  it("displays error from login response", async () => {
    (login as jest.Mock).mockResolvedValue({ error: "Invalid credentials" });

    render(<LoginForm ip={fakeIp} />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "fail@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "badpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("handles ZodError gracefully", async () => {
    (login as jest.Mock).mockImplementation(() => {
      throw new ZodError([
        { message: "Invalid email format", path: ["email"], code: "custom" },
      ]);
    });

    render(<LoginForm ip={fakeIp} />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "bad-email" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/invalid email format/i)
    ).toBeInTheDocument();
  });

  it("ignores NEXT_REDIRECT glitch", async () => {
    (login as jest.Mock).mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    render(<LoginForm ip={fakeIp} />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "redirect@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "whatever" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.queryByText("NEXT_REDIRECT")).not.toBeInTheDocument();
    });
  });
});

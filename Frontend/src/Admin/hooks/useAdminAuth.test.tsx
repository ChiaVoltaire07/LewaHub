import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AdminAuthProvider, useAdminAuth } from "./useAdminAuth";
import { adminApi } from "../services/adminApi";
import { AdminRole } from "../types";
import type { AdminApiResult, AuthResponse } from "../types";

vi.mock("../services/adminApi", () => ({
  adminApi: {
    getMe: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockAdmin = { id: "a1", email: "admin@lewahub.com", name: "Admin User", role: AdminRole.ADMIN };

function Probe() {
  const { admin, isLoading, isAuthenticated, login, logout } = useAdminAuth();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="admin-email">{admin?.email ?? "none"}</span>
      <button onClick={() => login({ email: "a@b.c", password: "p" })}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("AdminAuthProvider", () => {
  beforeEach(() => {
    vi.mocked(adminApi.getMe).mockResolvedValue({ ok: false, error: "nope", status: 401 } as AdminApiResult<AuthResponse>);
  });

  it("starts unauthenticated when getMe fails", async () => {
    render(
      <AdminAuthProvider>
        <Probe />
      </AdminAuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("false"));
    expect(screen.getByTestId("authenticated").textContent).toBe("false");
    expect(screen.getByTestId("admin-email").textContent).toBe("none");
  });

  it("restores the session when getMe succeeds", async () => {
    vi.mocked(adminApi.getMe).mockResolvedValue({ ok: true, data: { admin: mockAdmin } });
    render(
      <AdminAuthProvider>
        <Probe />
      </AdminAuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId("admin-email").textContent).toBe("admin@lewahub.com"));
    expect(screen.getByTestId("authenticated").textContent).toBe("true");
  });

  it("logs in and sets the admin, clearing it on logout", async () => {
    vi.mocked(adminApi.getMe).mockResolvedValue({ ok: false, error: "nope", status: 401 } as AdminApiResult<AuthResponse>);
    vi.mocked(adminApi.login).mockResolvedValue({ ok: true, data: { admin: mockAdmin, expiresAt: "x" } });
    vi.mocked(adminApi.logout).mockResolvedValue({ ok: true, data: { message: "bye" } });

    render(
      <AdminAuthProvider>
        <Probe />
      </AdminAuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("false"));

    const loginButton = screen.getByRole("button", { name: "login" });
    loginButton.click();
    await waitFor(() => expect(screen.getByTestId("admin-email").textContent).toBe("admin@lewahub.com"));
    expect(screen.getByTestId("authenticated").textContent).toBe("true");

    screen.getByRole("button", { name: "logout" }).click();
    await waitFor(() => expect(screen.getByTestId("admin-email").textContent).toBe("none"));
  });

  it("reports a failed login with the backend error message", async () => {
    vi.mocked(adminApi.getMe).mockResolvedValue({ ok: false, error: "nope", status: 401 } as AdminApiResult<AuthResponse>);
    vi.mocked(adminApi.login).mockResolvedValue({
      ok: false,
      error: "Invalid email or password",
      status: 401,
      code: "INVALID_CREDENTIALS",
    });

    let loginResult: { success: boolean; error?: string } | null = null;
    function LoginProbe() {
      const { login } = useAdminAuth();
      return (
        <button onClick={async () => (loginResult = await login({ email: "a@b.c", password: "p" }))}>
          login
        </button>
      );
    }

    render(
      <AdminAuthProvider>
        <LoginProbe />
      </AdminAuthProvider>
    );
    await waitFor(() => screen.getByRole("button", { name: "login" })).then((b) => b.click());
    await waitFor(() => expect(loginResult).toEqual({ success: false, error: "Invalid email or password" }));
  });
});

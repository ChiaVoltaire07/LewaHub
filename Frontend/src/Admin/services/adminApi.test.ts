import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { adminApi } from "./adminApi";

type FetchHandler = (url: string, init?: RequestInit) => Response | Promise<Response>;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function setupFetch(handler: FetchHandler) {
  vi.stubGlobal("fetch", vi.fn((url: string, init?: RequestInit) => handler(url, init)));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("adminApi", () => {
  describe("request plumbing", () => {
    beforeEach(() => {
      setupFetch(() => jsonResponse({ success: true, data: { hello: "world" } }));
    });

    it("sends credentials (cookies) on every request", async () => {
      await adminApi.getMe();
      const [url, init] = vi.mocked(fetch).mock.calls[0];
      expect(String(url)).toContain("/admin/auth/me");
      expect(init?.credentials).toBe("include");
    });

    it("unwraps the envelope `data` field on success", async () => {
      const result = await adminApi.getMe();
      expect(result).toMatchObject({ ok: true, data: { hello: "world" } });
    });
  });

  describe("login", () => {
    it("returns the admin and expiry on success", async () => {
      setupFetch(() =>
        jsonResponse({
          success: true,
          data: {
            admin: { id: "a1", email: "admin@lewahub.com", name: "Admin", role: "ADMIN" },
            expiresAt: "2026-08-15T12:00:00.000Z",
          },
        })
      );
      const result = await adminApi.login({ email: "admin@lewahub.com", password: "admin123" });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.admin.email).toBe("admin@lewahub.com");
        expect(result.data.expiresAt).toBe("2026-08-15T12:00:00.000Z");
      }
    });

    it("extracts the message and code from the admin error envelope", async () => {
      setupFetch(() =>
        jsonResponse(
          {
            success: false,
            error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
          },
          401
        )
      );
      const result = await adminApi.login({ email: "x@x.com", password: "nope" });
      expect(result).toMatchObject({
        ok: false,
        status: 401,
        code: "INVALID_CREDENTIALS",
        error: "Invalid email or password",
      });
    });

    it("handles legacy string errors", async () => {
      setupFetch(() => jsonResponse({ error: "Something broke" }, 500));
      const result = await adminApi.login({ email: "x@x.com", password: "x" });
      expect(result).toMatchObject({ ok: false, error: "Something broke", status: 500 });
    });

    it("returns a friendly network error when fetch throws", async () => {
      setupFetch(() => {
        throw new TypeError("fetch failed");
      });
      const result = await adminApi.login({ email: "x@x.com", password: "x" });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain("Network error");
      }
    });
  });

  describe("getSchools", () => {
    it("reassembles the flat pagination envelope into one payload", async () => {
      setupFetch(() =>
        jsonResponse({
          success: true,
          data: [{ id: "s1", name: "School One" }],
          total: 41,
          page: 2,
          limit: 20,
          totalPages: 3,
        })
      );
      const result = await adminApi.getSchools({ page: 2, limit: 20 });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.data).toEqual([{ id: "s1", name: "School One" }]);
        expect(result.data.total).toBe(41);
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(20);
        expect(result.data.totalPages).toBe(3);
      }
    });

    it("builds a query string from filters, skipping empties", async () => {
      setupFetch(() =>
        jsonResponse({ success: true, data: [], total: 0, page: 1, limit: 20, totalPages: 0 })
      );
      await adminApi.getSchools({
        search: "Lycée",
        category: "SECONDARY",
        region: "",
        verificationStatus: "VERIFIED",
        page: 1,
        limit: 20,
      });
      const [url] = vi.mocked(fetch).mock.calls[0];
      const qs = new URL(String(url)).searchParams;
      expect(qs.get("search")).toBe("Lycée");
      expect(qs.get("category")).toBe("SECONDARY");
      expect(qs.get("verificationStatus")).toBe("VERIFIED");
      expect(qs.get("region")).toBeNull();
    });
  });

  describe("mutations", () => {
    it("sends JSON bodies for create/update", async () => {
      setupFetch(() =>
        jsonResponse({ success: true, data: { id: "s1" }, message: "School created successfully." }, 201)
      );
      const result = await adminApi.createSchool({
        name: "New School",
        description: "Desc",
        levels: ["PRIMARY" as any],
        location: { region: "Centre", city: "Yaoundé" },
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.message).toBe("School created successfully.");
        expect(result.data.id).toBe("s1");
      }
      const [, init] = vi.mocked(fetch).mock.calls[0];
      expect(init?.method).toBe("POST");
      expect(JSON.parse(String(init?.body))).toMatchObject({ name: "New School" });
    });

    it("surfaces delete failures", async () => {
      setupFetch(() =>
        jsonResponse({ success: false, error: { code: "SCHOOL_NOT_FOUND", message: "School not found" } }, 404)
      );
      const result = await adminApi.deleteSchool("missing");
      expect(result).toMatchObject({ ok: false, code: "SCHOOL_NOT_FOUND" });
    });
  });
});

/**
 * Integration tests for src/lib/supabase/middleware.ts
 *
 * The ADMIN_EMAILS constant is derived from process.env.ADMIN_EMAIL at module
 * load time (top-level .split / .map / .filter).  Each test that needs a
 * different allowlist therefore uses vi.resetModules() + a dynamic import so
 * the constant is re-evaluated with the correct env value.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Shared mock state
// ---------------------------------------------------------------------------

type GetUserResult = { data: { user: { email: string } | null } };

let mockGetUser: () => Promise<GetUserResult> = async () => ({
  data: { user: null },
});

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: () => mockGetUser(),
    },
  })),
}));

// ---------------------------------------------------------------------------
// Helper: fresh module import
// ---------------------------------------------------------------------------

async function loadMiddleware(): Promise<
  (req: NextRequest) => Promise<import("next/server").NextResponse>
> {
  vi.resetModules();
  const mod = await import("@/lib/supabase/middleware");
  return mod.updateSession;
}

// ---------------------------------------------------------------------------
// Helper: build a minimal mock NextRequest with a real URL for clone()
// ---------------------------------------------------------------------------

function makeRequest(pathname: string): NextRequest {
  const url = new URL(pathname, "http://localhost:3000");
  return {
    nextUrl: {
      pathname,
      clone: () => new URL(url.toString()),
    },
    cookies: {
      getAll: () => [],
      set: vi.fn(),
    },
  } as unknown as NextRequest;
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("updateSession middleware", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    // Set valid (non-placeholder) Supabase env vars so middleware doesn't early-return
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-project.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.resetModules();
  });

  // -------------------------------------------------------------------------
  // Non-admin routes – auth check must not be applied
  // -------------------------------------------------------------------------

  describe("non-admin routes", () => {
    it("passes through /services with no user (no auth check)", async () => {
      process.env.ADMIN_EMAIL = "admin@trinity.com";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({ data: { user: null } });

      const response = await updateSession(makeRequest("/services"));

      expect(response).toBeDefined();
      expect(response.status).not.toBe(404);
    });

    it("passes through the homepage / with no user", async () => {
      process.env.ADMIN_EMAIL = "admin@trinity.com";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({ data: { user: null } });

      const response = await updateSession(makeRequest("/"));

      expect(response).toBeDefined();
      expect(response.status).not.toBe(404);
    });

    it("passes through /contact with no user", async () => {
      process.env.ADMIN_EMAIL = "admin@trinity.com";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({ data: { user: null } });

      const response = await updateSession(makeRequest("/contact"));

      expect(response).toBeDefined();
      expect(response.status).not.toBe(404);
    });
  });

  // -------------------------------------------------------------------------
  // Admin routes – authorised user must pass through
  // -------------------------------------------------------------------------

  describe("admin routes – authorised user", () => {
    it("allows a valid admin email on /admin", async () => {
      process.env.ADMIN_EMAIL = "admin@trinity.com";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "admin@trinity.com" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).not.toBe(404);
    });

    it("allows a valid admin email on a nested /admin/leads route", async () => {
      process.env.ADMIN_EMAIL = "admin@trinity.com";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "admin@trinity.com" } },
      });

      const response = await updateSession(makeRequest("/admin/leads"));

      expect(response.status).not.toBe(404);
    });
  });

  // -------------------------------------------------------------------------
  // Admin routes – unauthorised user must receive 404 rewrite
  // -------------------------------------------------------------------------

  describe("admin routes – unauthorised user", () => {
    it("returns 404 for a non-admin email on /admin", async () => {
      process.env.ADMIN_EMAIL = "admin@trinity.com";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "notadmin@example.com" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).toBe(404);
    });

    it("returns 404 when no user is authenticated on /admin", async () => {
      process.env.ADMIN_EMAIL = "admin@trinity.com";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({ data: { user: null } });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).toBe(404);
    });

    it("returns 404 for a non-admin on a nested /admin/settings route", async () => {
      process.env.ADMIN_EMAIL = "admin@trinity.com";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "stranger@example.com" } },
      });

      const response = await updateSession(makeRequest("/admin/settings"));

      expect(response.status).toBe(404);
    });
  });

  // -------------------------------------------------------------------------
  // Multiple admin emails – comma-separated ADMIN_EMAIL env var
  // -------------------------------------------------------------------------

  describe("multiple admin emails (comma-separated ADMIN_EMAIL)", () => {
    const multipleEmails = "alice@trinity.com,bob@trinity.com,carol@trinity.com";

    it("allows the first email in the list", async () => {
      process.env.ADMIN_EMAIL = multipleEmails;
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "alice@trinity.com" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).not.toBe(404);
    });

    it("allows the second email in the list", async () => {
      process.env.ADMIN_EMAIL = multipleEmails;
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "bob@trinity.com" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).not.toBe(404);
    });

    it("allows the last email in the list", async () => {
      process.env.ADMIN_EMAIL = multipleEmails;
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "carol@trinity.com" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).not.toBe(404);
    });

    it("rejects an email that is not in the list", async () => {
      process.env.ADMIN_EMAIL = multipleEmails;
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "eve@example.com" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).toBe(404);
    });

    it("trims whitespace around emails in the list", async () => {
      process.env.ADMIN_EMAIL = " alice@trinity.com , bob@trinity.com ";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "alice@trinity.com" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).not.toBe(404);
    });
  });

  // -------------------------------------------------------------------------
  // Case-insensitive email matching
  // -------------------------------------------------------------------------

  describe("case-insensitive email matching", () => {
    it("matches when the stored email is all-uppercase", async () => {
      process.env.ADMIN_EMAIL = "ADMIN@TRINITY.COM";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "admin@trinity.com" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).not.toBe(404);
    });

    it("matches when the user email has mixed case", async () => {
      process.env.ADMIN_EMAIL = "admin@trinity.com";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "Admin@Trinity.Com" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).not.toBe(404);
    });

    it("rejects a non-admin even when they send their email in uppercase", async () => {
      process.env.ADMIN_EMAIL = "admin@trinity.com";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "NOTADMIN@EXAMPLE.COM" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).toBe(404);
    });
  });

  // -------------------------------------------------------------------------
  // Missing / empty ADMIN_EMAIL env var
  // -------------------------------------------------------------------------

  describe("missing or empty ADMIN_EMAIL env var", () => {
    it("rejects all users when ADMIN_EMAIL is not set", async () => {
      delete process.env.ADMIN_EMAIL;
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "anyone@example.com" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).toBe(404);
    });

    it("rejects all users when ADMIN_EMAIL is an empty string", async () => {
      process.env.ADMIN_EMAIL = "";
      const updateSession = await loadMiddleware();
      mockGetUser = async () => ({
        data: { user: { email: "anyone@example.com" } },
      });

      const response = await updateSession(makeRequest("/admin"));

      expect(response.status).toBe(404);
    });
  });
});

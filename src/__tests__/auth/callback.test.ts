/**
 * Integration tests for src/app/auth/callback/route.ts
 *
 * The GET handler:
 *   - Reads `code` and `next` search params from the request URL
 *   - If `code` is present, calls supabase.auth.exchangeCodeForSession(code)
 *   - On success redirects to `${origin}${next}` (default next = "/admin")
 *   - On exchange error OR missing code, redirects to `${origin}/tr-admin-gate`
 *
 * We mock @/lib/supabase/server so no real Supabase client is created.
 * NextResponse.redirect is used directly from next/server – we leave it real
 * so we can inspect the Location header on the returned Response.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock: @/lib/supabase/server
// exchangeCodeForSession behaviour is controlled per-test via the variable
// below.
// ---------------------------------------------------------------------------

let mockExchangeError: { message: string } | null = null;

const mockExchangeCodeForSession = vi.fn(async (_code: string) => ({
  error: mockExchangeError,
}));

const mockSignOut = vi.fn(async () => ({}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
      signOut: mockSignOut,
    },
  })),
}));

// ---------------------------------------------------------------------------
// Import the route handler AFTER the mock is in place
// ---------------------------------------------------------------------------

import { GET } from "@/app/auth/callback/route";

// ---------------------------------------------------------------------------
// Helper: build a minimal Request object for the handler
// ---------------------------------------------------------------------------

function makeRequest(params: Record<string, string>): Request {
  const url = new URL("http://localhost:3000/auth/callback");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new Request(url.toString());
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("GET /auth/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExchangeError = null;
  });

  // -------------------------------------------------------------------------
  // Happy path – valid code, no `next` param
  // -------------------------------------------------------------------------

  it("exchanges a valid code and redirects to /admin by default", async () => {
    const response = await GET(makeRequest({ code: "valid-code-123" }));

    // exchangeCodeForSession must have been called with the code
    expect(mockExchangeCodeForSession).toHaveBeenCalledOnce();
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("valid-code-123");

    // Should be a redirect response
    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);

    // Location header must point to /admin
    const location = response.headers.get("Location");
    expect(location).not.toBeNull();
    expect(location).toMatch(/\/admin$/);
  });

  // -------------------------------------------------------------------------
  // Happy path – valid code WITH a `next` param
  // -------------------------------------------------------------------------

  it("redirects to the `next` param URL when code exchange succeeds", async () => {
    const response = await GET(
      makeRequest({ code: "valid-code-456", next: "/admin/leads" })
    );

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("valid-code-456");

    const location = response.headers.get("Location");
    expect(location).not.toBeNull();
    expect(location).toMatch(/\/admin\/leads$/);
  });

  it("redirects to an arbitrary `next` param path", async () => {
    const response = await GET(
      makeRequest({ code: "valid-code-789", next: "/admin/settings/profile" })
    );

    const location = response.headers.get("Location");
    expect(location).toMatch(/\/admin\/settings\/profile$/);
  });

  // -------------------------------------------------------------------------
  // Failure path – code exchange returns an error
  // -------------------------------------------------------------------------

  it("redirects to /tr-admin-gate when code exchange fails", async () => {
    mockExchangeError = { message: "Invalid OAuth code" };

    const response = await GET(makeRequest({ code: "bad-code" }));

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("bad-code");

    const location = response.headers.get("Location");
    expect(location).not.toBeNull();
    expect(location).toMatch(/\/tr-admin-gate$/);
  });

  it("does not redirect to /admin when exchange returns an error", async () => {
    mockExchangeError = { message: "Expired code" };

    const response = await GET(makeRequest({ code: "expired-code" }));

    const location = response.headers.get("Location");
    expect(location).not.toMatch(/\/admin$/);
  });

  // -------------------------------------------------------------------------
  // Failure path – no code param in the URL
  // -------------------------------------------------------------------------

  it("redirects to /tr-admin-gate when no code param is provided", async () => {
    // Request URL has no `code` search param at all
    const response = await GET(
      new Request("http://localhost:3000/auth/callback")
    );

    // exchangeCodeForSession must NOT have been called
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();

    const location = response.headers.get("Location");
    expect(location).not.toBeNull();
    expect(location).toMatch(/\/tr-admin-gate$/);
  });

  it("redirects to /tr-admin-gate when only an unrelated param is present", async () => {
    const response = await GET(
      makeRequest({ state: "some-oauth-state-token" })
    );

    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();

    const location = response.headers.get("Location");
    expect(location).toMatch(/\/tr-admin-gate$/);
  });

  // -------------------------------------------------------------------------
  // Origin preservation
  // The redirect URLs must use the same origin as the incoming request, not
  // a hard-coded domain.
  // -------------------------------------------------------------------------

  it("preserves the request origin in the success redirect", async () => {
    const request = new Request(
      "https://remodel-it.example.com/auth/callback?code=abc"
    );

    const response = await GET(request);

    const location = response.headers.get("Location");
    expect(location).toMatch(/^https:\/\/remodel-it\.example\.com/);
    expect(location).toMatch(/\/admin$/);
  });

  it("preserves the request origin in the failure redirect", async () => {
    mockExchangeError = { message: "Error" };

    const request = new Request(
      "https://remodel-it.example.com/auth/callback?code=bad"
    );

    const response = await GET(request);

    const location = response.headers.get("Location");
    expect(location).toMatch(/^https:\/\/remodel-it\.example\.com/);
    expect(location).toMatch(/\/tr-admin-gate$/);
  });
});

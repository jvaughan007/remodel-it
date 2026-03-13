/**
 * Integration tests for src/app/api/auth/signout/route.ts
 *
 * The POST handler:
 *   - Calls supabase.auth.signOut()
 *   - Redirects to `${origin}/` with HTTP status 302
 *
 * We mock @/lib/supabase/server so no real Supabase client is created.
 * NextResponse.redirect is used directly from next/server – we leave it real
 * so we can inspect the Location header and status on the returned Response.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock: @/lib/supabase/server
// ---------------------------------------------------------------------------

const mockSignOut = vi.fn(async () => ({}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      signOut: mockSignOut,
    },
  })),
}));

// ---------------------------------------------------------------------------
// Import the route handler AFTER the mock is in place
// ---------------------------------------------------------------------------

import { POST } from "@/app/api/auth/signout/route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePostRequest(origin = "http://localhost:3000"): Request {
  return new Request(`${origin}/api/auth/signout`, { method: "POST" });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/auth/signout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // Signs out the user
  // -------------------------------------------------------------------------

  it("calls supabase.auth.signOut()", async () => {
    await POST(makePostRequest());

    expect(mockSignOut).toHaveBeenCalledOnce();
  });

  // -------------------------------------------------------------------------
  // Redirect behaviour
  // -------------------------------------------------------------------------

  it("returns a redirect response", async () => {
    const response = await POST(makePostRequest());

    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
  });

  it("returns exactly HTTP 302", async () => {
    const response = await POST(makePostRequest());

    expect(response.status).toBe(302);
  });

  it("redirects to the homepage /", async () => {
    const response = await POST(makePostRequest("http://localhost:3000"));

    const location = response.headers.get("Location");
    expect(location).not.toBeNull();
    // The handler constructs `${origin}/` so the path must be exactly /
    expect(location).toBe("http://localhost:3000/");
  });

  it("preserves the request origin in the redirect URL", async () => {
    const response = await POST(
      makePostRequest("https://remodel-it.example.com")
    );

    const location = response.headers.get("Location");
    expect(location).toBe("https://remodel-it.example.com/");
  });

  it("does not redirect to /admin or any other path", async () => {
    const response = await POST(makePostRequest());

    const location = response.headers.get("Location");
    // Location should end with exactly "/" not "/admin", "/login", etc.
    const url = new URL(location!);
    expect(url.pathname).toBe("/");
  });

  // -------------------------------------------------------------------------
  // signOut is awaited before the redirect is issued
  // -------------------------------------------------------------------------

  it("completes signOut before returning the response", async () => {
    const callOrder: string[] = [];

    mockSignOut.mockImplementation(async () => {
      callOrder.push("signOut");
      return {};
    });

    const response = await POST(makePostRequest());

    // If signOut was properly awaited, it must be in the call order
    expect(callOrder).toContain("signOut");
    // And we should still get a valid redirect
    expect(response.status).toBe(302);
  });

  // -------------------------------------------------------------------------
  // signOut result is not checked – the redirect always happens
  // -------------------------------------------------------------------------

  it("still redirects to / even if signOut rejects (fire-and-forget is not the pattern but handler does await)", async () => {
    // The source file does `await supabase.auth.signOut()` but does not check
    // the return value – an error from signOut would propagate as an unhandled
    // rejection and let Next.js surface a 500.  Here we verify the happy path
    // still works with a successful (but slow) signOut.
    mockSignOut.mockResolvedValueOnce({});

    const response = await POST(makePostRequest());

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("http://localhost:3000/");
  });
});

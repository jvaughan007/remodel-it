import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/leads/bulk-delete/route";

/* -------------------------------------------------------------------------- */
/*  Module Mocks                                                               */
/* -------------------------------------------------------------------------- */

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/leads/bulk-delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * Builds a Supabase mock with a configurable `from` implementation.
 * The `in` method terminates chains for both delete and update operations.
 */
function buildMockSupabase(
  user: { email: string } | null,
  fromImpl?: (table: string) => unknown
) {
  const getUser = vi.fn().mockResolvedValue({ data: { user } });
  const from = vi.fn((table: string) => fromImpl?.(table) ?? {});
  return { auth: { getUser }, from };
}

/** Returns a chainable update mock: update → in (bulk route has no .eq() between them) */
function makeUpdateChain(resolvedValue: { error: unknown }) {
  const inFn = vi.fn().mockResolvedValue(resolvedValue);
  const update = vi.fn(() => ({ in: inFn }));
  return { update, in: inFn };
}

/** Returns a chainable delete mock: delete → in */
function makeDeleteChain(resolvedValue: { error: unknown }) {
  const inFn = vi.fn().mockResolvedValue(resolvedValue);
  const del = vi.fn(() => ({ in: inFn }));
  return { delete: del, in: inFn };
}

const SAMPLE_IDS = ["lead-1", "lead-2", "lead-3"];

/* -------------------------------------------------------------------------- */
/*  Tests: POST /api/leads/bulk-delete                                        */
/* -------------------------------------------------------------------------- */

describe("POST /api/leads/bulk-delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ---- Authentication ----------------------------------------------------- */

  it("returns 401 when user is not authenticated", async () => {
    const mockSupabase = buildMockSupabase(null);
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "delete", ids: SAMPLE_IDS }));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  /* ---- Body parsing ------------------------------------------------------- */

  it("returns 400 for invalid JSON body", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request("http://localhost/api/leads/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{bad json}",
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/invalid request body/i);
  });

  /* ---- Validation: ids ---------------------------------------------------- */

  it("returns 400 when ids is missing", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "delete" }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/no lead ids provided/i);
  });

  it("returns 400 when ids is an empty array", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "delete", ids: [] }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/no lead ids provided/i);
  });

  it("returns 400 when ids is not an array", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "delete", ids: "lead-1" }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/no lead ids provided/i);
  });

  it("returns 400 when ids array contains only non-string values", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "delete", ids: [1, 2, 3] }));
    const body = await res.json();

    // All ids are numbers, filtered to [], which is length 0
    expect(res.status).toBe(400);
    expect(body.error).toMatch(/no valid lead ids/i);
  });

  /* ---- Validation: action ------------------------------------------------- */

  it("defaults to delete action when action is missing (not archive or unarchive)", async () => {
    const { delete: del, in: inFn } = makeDeleteChain({ error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ ids: SAMPLE_IDS }));
    const body = await res.json();

    // No action field — defaults to "delete"
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.deleted).toBe(SAMPLE_IDS.length);
    expect(inFn).toHaveBeenCalledWith("id", SAMPLE_IDS);
  });

  it("defaults to delete action when action is an unknown string", async () => {
    const { delete: del, in: inFn } = makeDeleteChain({ error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "purge", ids: SAMPLE_IDS }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.deleted).toBe(SAMPLE_IDS.length);
    expect(inFn).toHaveBeenCalledWith("id", SAMPLE_IDS);
  });

  /* ---- Archive action ----------------------------------------------------- */

  it("returns 200 with archived count when action is 'archive'", async () => {
    const { update, in: inFn } = makeUpdateChain({ error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "archive", ids: SAMPLE_IDS }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.archived).toBe(SAMPLE_IDS.length);
    expect(inFn).toHaveBeenCalledWith("id", SAMPLE_IDS);
  });

  it("sets archived=true when action is 'archive'", async () => {
    const { update } = makeUpdateChain({ error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await POST(makeRequest({ action: "archive", ids: SAMPLE_IDS }));

    expect(update).toHaveBeenCalledWith({ archived: true });
  });

  it("returns 500 when Supabase archive update returns an error", async () => {
    const { update } = makeUpdateChain({ error: { message: "Archive failed" } });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "archive", ids: SAMPLE_IDS }));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Archive failed");
  });

  /* ---- Unarchive action --------------------------------------------------- */

  it("returns 200 with unarchived count when action is 'unarchive'", async () => {
    const { update, in: inFn } = makeUpdateChain({ error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "unarchive", ids: SAMPLE_IDS }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.unarchived).toBe(SAMPLE_IDS.length);
    expect(inFn).toHaveBeenCalledWith("id", SAMPLE_IDS);
  });

  it("sets archived=false when action is 'unarchive'", async () => {
    const { update } = makeUpdateChain({ error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await POST(makeRequest({ action: "unarchive", ids: SAMPLE_IDS }));

    expect(update).toHaveBeenCalledWith({ archived: false });
  });

  it("returns 500 when Supabase unarchive update returns an error", async () => {
    const { update } = makeUpdateChain({ error: { message: "Unarchive failed" } });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "unarchive", ids: SAMPLE_IDS }));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Unarchive failed");
  });

  /* ---- Delete action ------------------------------------------------------ */

  it("returns 200 with deleted count when action is 'delete'", async () => {
    const { delete: del, in: inFn } = makeDeleteChain({ error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "delete", ids: SAMPLE_IDS }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.deleted).toBe(SAMPLE_IDS.length);
    expect(inFn).toHaveBeenCalledWith("id", SAMPLE_IDS);
  });

  it("returns 500 when Supabase delete returns an error", async () => {
    const { delete: del } = makeDeleteChain({ error: { message: "Delete failed" } });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "delete", ids: SAMPLE_IDS }));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Delete failed");
  });

  /* ---- Mixed string/non-string ids --------------------------------------- */

  it("filters out non-string ids and operates on valid string ids only", async () => {
    const { delete: del, in: inFn } = makeDeleteChain({ error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const mixedIds = ["lead-1", 42, "lead-3", null, "lead-5"];
    const res = await POST(makeRequest({ action: "delete", ids: mixedIds }));
    const body = await res.json();

    expect(res.status).toBe(200);
    // Only 3 valid string ids
    expect(body.deleted).toBe(3);
    expect(inFn).toHaveBeenCalledWith("id", ["lead-1", "lead-3", "lead-5"]);
  });

  /* ---- Correct count returned -------------------------------------------- */

  it("returns exact count matching number of ids passed", async () => {
    const manyIds = Array.from({ length: 10 }, (_, i) => `lead-${i}`);
    const { delete: del } = makeDeleteChain({ error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({ action: "delete", ids: manyIds }));
    const body = await res.json();

    expect(body.deleted).toBe(10);
  });
});

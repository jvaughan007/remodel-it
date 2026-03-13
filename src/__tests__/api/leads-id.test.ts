import { describe, it, expect, vi, beforeEach } from "vitest";
import { DELETE, PATCH } from "@/app/api/leads/[id]/route";

/* -------------------------------------------------------------------------- */
/*  Module Mocks                                                               */
/* -------------------------------------------------------------------------- */

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";

/* -------------------------------------------------------------------------- */
/*  Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

const LEAD_ID = "lead-uuid-123";

// Params shape mirrors the Next.js App Router dynamic segment API
function makeParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

function makePatchRequest(body: unknown): Request {
  return new Request(`http://localhost/api/leads/${LEAD_ID}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeDeleteRequest(): Request {
  return new Request(`http://localhost/api/leads/${LEAD_ID}`, {
    method: "DELETE",
  });
}

/**
 * Build a Supabase mock whose `from` chain terminates in a resolved value.
 * The chain is: from → delete/update → eq → [resolved] for DELETE
 *               from → update → eq → select → single → [resolved] for PATCH
 */
function buildMockSupabase(
  user: { email: string } | null,
  fromImpl: (table: string) => unknown
) {
  const getUser = vi.fn().mockResolvedValue({ data: { user } });
  const from = vi.fn((table: string) => fromImpl(table));
  return { auth: { getUser }, from };
}

/* -------------------------------------------------------------------------- */
/*  Tests: DELETE /api/leads/[id]                                             */
/* -------------------------------------------------------------------------- */

describe("DELETE /api/leads/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    const mockSupabase = buildMockSupabase(null, () => ({}));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await DELETE(makeDeleteRequest(), makeParams(LEAD_ID));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 200 with success true when lead is deleted", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn(() => ({ eq }));
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await DELETE(makeDeleteRequest(), makeParams(LEAD_ID));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(eq).toHaveBeenCalledWith("id", LEAD_ID);
  });

  it("returns 500 when Supabase delete returns an error", async () => {
    const eq = vi.fn().mockResolvedValue({ error: { message: "Row not found" } });
    const del = vi.fn(() => ({ eq }));
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await DELETE(makeDeleteRequest(), makeParams(LEAD_ID));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Row not found");
  });

  it("passes the correct lead id to the delete query", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn(() => ({ eq }));
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const customId = "specific-lead-id";
    await DELETE(makeDeleteRequest(), makeParams(customId));

    expect(eq).toHaveBeenCalledWith("id", customId);
  });
});

/* -------------------------------------------------------------------------- */
/*  Tests: PATCH /api/leads/[id]                                              */
/* -------------------------------------------------------------------------- */

describe("PATCH /api/leads/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function buildPatchChain(resolvedValue: { data: unknown; error: unknown }) {
    const single = vi.fn().mockResolvedValue(resolvedValue);
    const select = vi.fn(() => ({ single }));
    const eq = vi.fn(() => ({ select }));
    const update = vi.fn(() => ({ eq }));
    return { update, eq, select, single };
  }

  it("returns 401 when user is not authenticated", async () => {
    const mockSupabase = buildMockSupabase(null, () => ({}));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await PATCH(makePatchRequest({ status: "contacted" }), makeParams(LEAD_ID));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 400 for invalid JSON body", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" }, () => ({}));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request(`http://localhost/api/leads/${LEAD_ID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "{bad json}",
    });

    const res = await PATCH(req, makeParams(LEAD_ID));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/invalid request body/i);
  });

  it("returns 400 when no valid fields are provided", async () => {
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({})
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    // Only unknown/unwhitelisted fields
    const res = await PATCH(
      makePatchRequest({ unknown_field: "value", another_bad_field: 123 }),
      makeParams(LEAD_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/no valid fields/i);
  });

  it("ignores unknown fields and only updates whitelisted fields", async () => {
    const { update } = buildPatchChain({
      data: { id: LEAD_ID, status: "contacted" },
      error: null,
    });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await PATCH(
      makePatchRequest({ status: "contacted", hacked_field: "evil", admin: true }),
      makeParams(LEAD_ID)
    );

    const updateArg = (update as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(updateArg).toEqual({ status: "contacted" });
    expect(updateArg).not.toHaveProperty("hacked_field");
    expect(updateArg).not.toHaveProperty("admin");
  });

  it("successfully updates a lead and returns 200 with updated data", async () => {
    const updatedLead = { id: LEAD_ID, status: "contacted", notes: "Called on Monday" };
    const { update } = buildPatchChain({ data: updatedLead, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await PATCH(
      makePatchRequest({ status: "contacted", notes: "Called on Monday" }),
      makeParams(LEAD_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("contacted");
    expect(body.notes).toBe("Called on Monday");
  });

  it("returns 500 when Supabase update returns an error", async () => {
    const { update } = buildPatchChain({ data: null, error: { message: "Update failed" } });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await PATCH(
      makePatchRequest({ status: "won" }),
      makeParams(LEAD_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Update failed");
  });

  it("allows all whitelisted fields to be patched", async () => {
    const allWhitelisted = {
      name: "New Name",
      email: "new@example.com",
      phone: "555-999-0000",
      company: "New Co",
      source: "referral",
      service_interest: "Flooring",
      message: "Updated message",
      status: "quoted",
      notes: "Some notes",
      next_follow_up: "2024-06-01",
      deal_value: 25000,
      lost_reason: "Price too high",
      project_address: "789 Elm St",
      project_timeline: "6_plus_months",
      property_type: "commercial",
      archived: false,
    };

    const { update } = buildPatchChain({ data: { id: LEAD_ID, ...allWhitelisted }, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await PATCH(
      makePatchRequest(allWhitelisted),
      makeParams(LEAD_ID)
    );

    // Should succeed — all fields are whitelisted
    expect(res.status).toBe(200);

    const updateArg = (update as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(Object.keys(updateArg)).toHaveLength(Object.keys(allWhitelisted).length);
  });

  it("passes the correct lead id to the update query", async () => {
    const { update, eq } = buildPatchChain({
      data: { id: LEAD_ID, status: "new" },
      error: null,
    });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const customId = "another-lead-id";
    await PATCH(makePatchRequest({ status: "new" }), makeParams(customId));

    expect(eq).toHaveBeenCalledWith("id", customId);
  });
});

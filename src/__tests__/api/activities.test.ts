import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/leads/[id]/activities/route";

/* -------------------------------------------------------------------------- */
/*  Module Mocks                                                               */
/* -------------------------------------------------------------------------- */

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";

/* -------------------------------------------------------------------------- */
/*  Constants mirroring the route                                              */
/* -------------------------------------------------------------------------- */

const VALID_ACTIVITY_TYPES = [
  "note",
  "email",
  "call",
  "text_message",
  "site_visit",
  "meeting",
  "status_change",
  "document_sent",
  "payment_received",
] as const;

const LEAD_ID = "lead-uuid-456";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function makeParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

function makeRequest(body: unknown): Request {
  return new Request(`http://localhost/api/leads/${LEAD_ID}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function buildSuccessChain(resolvedData: unknown) {
  const single = vi.fn().mockResolvedValue({ data: resolvedData, error: null });
  const select = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select }));
  return { insert, select, single };
}

function buildMockSupabase(
  user: { email: string } | null,
  fromImpl?: (table: string) => unknown
) {
  const getUser = vi.fn().mockResolvedValue({ data: { user } });
  const from = vi.fn((table: string) => fromImpl?.(table) ?? {});
  return { auth: { getUser }, from };
}

/* -------------------------------------------------------------------------- */
/*  Tests: POST /api/leads/[id]/activities                                    */
/* -------------------------------------------------------------------------- */

describe("POST /api/leads/[id]/activities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ---- Authentication ----------------------------------------------------- */

  it("returns 401 when user is not authenticated", async () => {
    const mockSupabase = buildMockSupabase(null);
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(
      makeRequest({ type: "note", description: "First contact" }),
      makeParams(LEAD_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  /* ---- Body parsing ------------------------------------------------------- */

  it("returns 400 for invalid JSON body", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request(`http://localhost/api/leads/${LEAD_ID}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{bad json}",
    });

    const res = await POST(req, makeParams(LEAD_ID));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/invalid request body/i);
  });

  /* ---- Validation: required fields --------------------------------------- */

  it("returns 400 when type is missing", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(
      makeRequest({ description: "Sent proposal" }),
      makeParams(LEAD_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/type and description are required/i);
  });

  it("returns 400 when description is missing", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(
      makeRequest({ type: "note" }),
      makeParams(LEAD_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/type and description are required/i);
  });

  it("returns 400 when both type and description are missing", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makeRequest({}), makeParams(LEAD_ID));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/type and description are required/i);
  });

  /* ---- Validation: activity type enum ------------------------------------ */

  it("returns 400 for an invalid activity type", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(
      makeRequest({ type: "telepathy", description: "Sent vibes" }),
      makeParams(LEAD_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/type must be one of/i);
  });

  it("returns 400 for an empty string type", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(
      makeRequest({ type: "", description: "Something" }),
      makeParams(LEAD_ID)
    );
    const body = await res.json();

    // Empty string is falsy so the required check fires first
    expect(res.status).toBe(400);
  });

  /* ---- Success: all 9 valid activity types ------------------------------- */

  it.each(VALID_ACTIVITY_TYPES)(
    "returns 201 when activity type is '%s'",
    async (activityType) => {
      const newActivity = {
        id: "activity-1",
        lead_id: LEAD_ID,
        type: activityType,
        description: "Test activity description",
      };

      const { insert } = buildSuccessChain(newActivity);
      const mockSupabase = buildMockSupabase(
        { email: "admin@example.com" },
        () => ({ insert })
      );
      (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

      const res = await POST(
        makeRequest({ type: activityType, description: "Test activity description" }),
        makeParams(LEAD_ID)
      );
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.type).toBe(activityType);
    }
  );

  /* ---- Correct data persisted -------------------------------------------- */

  it("inserts activity with correct lead_id, type, and description", async () => {
    const { insert } = buildSuccessChain({
      id: "activity-2",
      lead_id: LEAD_ID,
      type: "call",
      description: "Discussed project scope",
    });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await POST(
      makeRequest({ type: "call", description: "Discussed project scope" }),
      makeParams(LEAD_ID)
    );

    expect(insert).toHaveBeenCalledWith({
      lead_id: LEAD_ID,
      type: "call",
      description: "Discussed project scope",
    });
  });

  it("returns 201 with the created activity data", async () => {
    const newActivity = {
      id: "activity-3",
      lead_id: LEAD_ID,
      type: "email",
      description: "Sent estimate",
      created_at: "2024-01-15T10:00:00Z",
    };

    const { insert } = buildSuccessChain(newActivity);
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(
      makeRequest({ type: "email", description: "Sent estimate" }),
      makeParams(LEAD_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.id).toBe("activity-3");
    expect(body.lead_id).toBe(LEAD_ID);
    expect(body.created_at).toBe("2024-01-15T10:00:00Z");
  });

  /* ---- Supabase error handling ------------------------------------------- */

  it("returns 500 when Supabase insert returns an error", async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: "FK violation" } });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(
      makeRequest({ type: "note", description: "Some note" }),
      makeParams(LEAD_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("FK violation");
  });

  /* ---- Activities insert goes to correct table --------------------------- */

  it("queries the 'activities' table", async () => {
    const { insert } = buildSuccessChain({ id: "a1", lead_id: LEAD_ID, type: "note", description: "Test" });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      (table) => {
        if (table === "activities") return { insert };
        return {};
      }
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await POST(
      makeRequest({ type: "note", description: "Test" }),
      makeParams(LEAD_ID)
    );

    expect(mockSupabase.from).toHaveBeenCalledWith("activities");
  });
});

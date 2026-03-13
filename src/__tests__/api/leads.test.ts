import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/leads/route";

/* -------------------------------------------------------------------------- */
/*  Module Mocks                                                               */
/* -------------------------------------------------------------------------- */

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";

/* -------------------------------------------------------------------------- */
/*  Shared mock helpers                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Build a chainable Supabase query mock. Every method returns `this` so
 * the caller can override the terminal resolved value with `mockResolvedValue`.
 */
function makeQueryMock(resolvedValue: { data: unknown; error: unknown }) {
  const query: Record<string, unknown> = {};
  const methods = ["select", "order", "eq", "or", "ilike"];
  for (const m of methods) {
    query[m] = vi.fn(() => query);
  }
  // Make the object itself a thenable so `await query` resolves
  (query as unknown as Promise<unknown>).then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(resolvedValue).then(resolve);
  return query;
}

function makeInsertMock(resolvedValue: { data: unknown; error: unknown }) {
  const single = vi.fn().mockResolvedValue(resolvedValue);
  const select = vi.fn().mockReturnValue({ single });
  const insert = vi.fn().mockReturnValue({ select });
  return { insert, select, single };
}

function buildMockSupabase(
  user: { email: string } | null,
  fromImpl?: (table: string) => unknown
) {
  const getUser = vi.fn().mockResolvedValue({
    data: { user },
  });

  const from = vi.fn((table: string) =>
    fromImpl ? fromImpl(table) : makeQueryMock({ data: [], error: null })
  );

  return { auth: { getUser }, from };
}

/* -------------------------------------------------------------------------- */
/*  Tests: GET /api/leads                                                      */
/* -------------------------------------------------------------------------- */

describe("GET /api/leads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    const mockSupabase = buildMockSupabase(null);
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request("http://localhost/api/leads");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns an array of leads when authenticated", async () => {
    const leads = [
      { id: "1", name: "Alice", email: "alice@example.com", status: "new" },
      { id: "2", name: "Bob", email: "bob@example.com", status: "contacted" },
    ];

    const queryMock = makeQueryMock({ data: leads, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => queryMock
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request("http://localhost/api/leads");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body[0].name).toBe("Alice");
  });

  it("filters by status query param", async () => {
    const queryMock = makeQueryMock({ data: [], error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => queryMock
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request("http://localhost/api/leads?status=new");
    await GET(req);

    // The query chain should have called .eq("status", "new")
    expect(queryMock.eq).toHaveBeenCalledWith("status", "new");
  });

  it("filters by archived=true query param", async () => {
    const queryMock = makeQueryMock({ data: [], error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => queryMock
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request("http://localhost/api/leads?archived=true");
    await GET(req);

    expect(queryMock.eq).toHaveBeenCalledWith("archived", true);
  });

  it("filters out archived leads by default (archived=false)", async () => {
    const queryMock = makeQueryMock({ data: [], error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => queryMock
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request("http://localhost/api/leads");
    await GET(req);

    // When archived param is absent the route defaults to eq("archived", false)
    expect(queryMock.eq).toHaveBeenCalledWith("archived", false);
  });

  it("does not filter by archived when archived=all", async () => {
    const queryMock = makeQueryMock({ data: [], error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => queryMock
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request("http://localhost/api/leads?archived=all");
    await GET(req);

    // .eq should NOT have been called for archived when value is "all"
    const archivedCalls = (queryMock.eq as ReturnType<typeof vi.fn>).mock.calls.filter(
      (call) => call[0] === "archived"
    );
    expect(archivedCalls).toHaveLength(0);
  });

  it("filters by search query param using .or()", async () => {
    const queryMock = makeQueryMock({ data: [], error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => queryMock
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request("http://localhost/api/leads?search=alice");
    await GET(req);

    expect(queryMock.or).toHaveBeenCalledWith(
      expect.stringContaining("alice")
    );
  });

  it("returns 500 when Supabase query returns an error", async () => {
    const queryMock = makeQueryMock({ data: null, error: { message: "DB error" } });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => queryMock
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request("http://localhost/api/leads");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("DB error");
  });
});

/* -------------------------------------------------------------------------- */
/*  Tests: POST /api/leads                                                     */
/* -------------------------------------------------------------------------- */

describe("POST /api/leads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function makeRequest(body: unknown): Request {
    return new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("returns 401 when user is not authenticated", async () => {
    const mockSupabase = buildMockSupabase(null);
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = makeRequest({ name: "Alice", email: "alice@example.com" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 400 when name is missing", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = makeRequest({ email: "alice@example.com" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/name and email are required/i);
  });

  it("returns 400 when email is missing", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = makeRequest({ name: "Alice" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/name and email are required/i);
  });

  it("returns 400 for invalid JSON body", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" });
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{bad json}",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/invalid request body/i);
  });

  it("returns 201 and created lead when name and email are provided", async () => {
    const newLead = {
      id: "lead-1",
      name: "Alice",
      email: "alice@example.com",
      source: "manual",
      status: "new",
    };

    const { insert } = makeInsertMock({ data: newLead, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = makeRequest({ name: "Alice", email: "alice@example.com" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.id).toBe("lead-1");
    expect(body.name).toBe("Alice");
  });

  it("returns 201 with all optional fields stored", async () => {
    const newLead = {
      id: "lead-2",
      name: "Bob",
      email: "bob@example.com",
      phone: "555-000-1111",
      company: "Acme Inc",
      source: "google",
      service_interest: "Bathroom",
      message: "I need a new bathroom.",
      status: "new",
      notes: "Referred by neighbour",
      deal_value: 15000,
      project_address: "456 Oak Ave",
      project_timeline: "3_6_months",
      property_type: "commercial",
    };

    const { insert } = makeInsertMock({ data: newLead, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = makeRequest({
      name: "Bob",
      email: "bob@example.com",
      phone: "555-000-1111",
      company: "Acme Inc",
      source: "google",
      service_interest: "Bathroom",
      message: "I need a new bathroom.",
      notes: "Referred by neighbour",
      deal_value: 15000,
      project_address: "456 Oak Ave",
      project_timeline: "3_6_months",
      property_type: "commercial",
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.phone).toBe("555-000-1111");
    expect(body.source).toBe("google");
  });

  it("defaults source to 'manual' when source is not provided", async () => {
    const newLead = { id: "lead-3", name: "Alice", email: "alice@example.com", source: "manual" };
    const { insert } = makeInsertMock({ data: newLead, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = makeRequest({ name: "Alice", email: "alice@example.com" });
    await POST(req);

    // insert receives the lead object — verify the source passed to Supabase
    const insertedLead = (insert as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(insertedLead.source).toBe("manual");
  });

  it("defaults status to 'new' when status is not provided", async () => {
    const newLead = { id: "lead-4", name: "Alice", email: "alice@example.com", status: "new" };
    const { insert } = makeInsertMock({ data: newLead, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = makeRequest({ name: "Alice", email: "alice@example.com" });
    await POST(req);

    const insertedLead = (insert as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(insertedLead.status).toBe("new");
  });

  it("returns 500 when Supabase insert returns an error", async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: "Unique constraint" } });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });

    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = makeRequest({ name: "Alice", email: "alice@example.com" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Unique constraint");
  });
});

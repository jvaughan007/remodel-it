import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/gallery/route";
import { PATCH, DELETE } from "@/app/api/gallery/[id]/route";

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

const GALLERY_ID = "gallery-uuid-789";

function makeParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

function makePostRequest(body: unknown): Request {
  return new Request("http://localhost/api/gallery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makePatchRequest(body: unknown): Request {
  return new Request(`http://localhost/api/gallery/${GALLERY_ID}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeDeleteRequest(): Request {
  return new Request(`http://localhost/api/gallery/${GALLERY_ID}`, {
    method: "DELETE",
  });
}

/** Builds a chainable query mock that resolves with the given value. */
function makeQueryMock(resolvedValue: { data: unknown; error: unknown }) {
  const query: Record<string, unknown> = {};
  const methods = ["select", "eq", "order", "insert", "update", "delete"];
  for (const m of methods) {
    query[m] = vi.fn(() => query);
  }
  (query as unknown as Promise<unknown>).then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(resolvedValue).then(resolve);
  return query;
}

function makeInsertSelectSingleChain(resolvedValue: { data: unknown; error: unknown }) {
  const single = vi.fn().mockResolvedValue(resolvedValue);
  const select = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select }));
  return { insert, select, single };
}

function makeUpdateChain(resolvedValue: { data: unknown; error: unknown }) {
  const single = vi.fn().mockResolvedValue(resolvedValue);
  const select = vi.fn(() => ({ single }));
  const eq = vi.fn(() => ({ select }));
  const update = vi.fn(() => ({ eq }));
  return { update, eq, select, single };
}

function makeDeleteChain(resolvedValue: { error: unknown }) {
  const eq = vi.fn().mockResolvedValue(resolvedValue);
  const del = vi.fn(() => ({ eq }));
  return { delete: del, eq };
}

function buildMockSupabase(
  user: { email: string } | null,
  fromImpl: (table: string) => unknown
) {
  const getUser = vi.fn().mockResolvedValue({ data: { user } });
  const from = vi.fn((table: string) => fromImpl(table));
  return { auth: { getUser }, from };
}

/* -------------------------------------------------------------------------- */
/*  Tests: GET /api/gallery                                                    */
/* -------------------------------------------------------------------------- */

describe("GET /api/gallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns published gallery projects without requiring authentication", async () => {
    const projects = [
      { id: "1", title: "Kitchen Remodel", published: true },
      { id: "2", title: "Bathroom Update", published: true },
    ];

    const queryMock = makeQueryMock({ data: projects, error: null });
    const mockSupabase = buildMockSupabase(null, () => queryMock);
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body[0].title).toBe("Kitchen Remodel");
  });

  it("filters by published=true", async () => {
    const queryMock = makeQueryMock({ data: [], error: null });
    const mockSupabase = buildMockSupabase(null, () => queryMock);
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await GET();

    expect(queryMock.eq).toHaveBeenCalledWith("published", true);
  });

  it("orders results by display_order ascending then created_at descending", async () => {
    const queryMock = makeQueryMock({ data: [], error: null });
    const mockSupabase = buildMockSupabase(null, () => queryMock);
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await GET();

    expect(queryMock.order).toHaveBeenCalledWith("display_order", { ascending: true });
    expect(queryMock.order).toHaveBeenCalledWith("created_at", { ascending: false });
  });

  it("returns 500 when Supabase query returns an error", async () => {
    const queryMock = makeQueryMock({ data: null, error: { message: "Connection refused" } });
    const mockSupabase = buildMockSupabase(null, () => queryMock);
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Connection refused");
  });
});

/* -------------------------------------------------------------------------- */
/*  Tests: POST /api/gallery                                                   */
/* -------------------------------------------------------------------------- */

describe("POST /api/gallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    const mockSupabase = buildMockSupabase(null, () => ({}));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makePostRequest({ title: "Kitchen Remodel" }));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 400 when title is missing", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" }, () => ({}));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makePostRequest({ description: "A great project" }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/title is required/i);
  });

  it("returns 400 when title is only whitespace", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" }, () => ({}));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makePostRequest({ title: "   " }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/title is required/i);
  });

  it("returns 400 for invalid JSON body", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" }, () => ({}));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request("http://localhost/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not valid json}",
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/invalid request body/i);
  });

  it("returns 201 and created project when title is provided", async () => {
    const newProject = { id: "proj-1", title: "Deck Renovation", published: true };
    const { insert } = makeInsertSelectSingleChain({ data: newProject, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makePostRequest({ title: "Deck Renovation" }));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.id).toBe("proj-1");
    expect(body.title).toBe("Deck Renovation");
  });

  it("defaults published to true when published is not specified", async () => {
    const newProject = { id: "proj-2", title: "Bath Remodel", published: true };
    const { insert } = makeInsertSelectSingleChain({ data: newProject, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await POST(makePostRequest({ title: "Bath Remodel" }));

    const insertArg = (insert as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(insertArg.published).toBe(true);
  });

  it("sets published to false when explicitly passed as false", async () => {
    const newProject = { id: "proj-3", title: "Draft Project", published: false };
    const { insert } = makeInsertSelectSingleChain({ data: newProject, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await POST(makePostRequest({ title: "Draft Project", published: false }));

    const insertArg = (insert as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(insertArg.published).toBe(false);
  });

  it("defaults featured to false when not provided", async () => {
    const newProject = { id: "proj-4", title: "Standard Project", featured: false };
    const { insert } = makeInsertSelectSingleChain({ data: newProject, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await POST(makePostRequest({ title: "Standard Project" }));

    const insertArg = (insert as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(insertArg.featured).toBe(false);
  });

  it("defaults additional_images to empty array when not provided", async () => {
    const newProject = { id: "proj-5", title: "No Extra Images", additional_images: [] };
    const { insert } = makeInsertSelectSingleChain({ data: newProject, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await POST(makePostRequest({ title: "No Extra Images" }));

    const insertArg = (insert as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(insertArg.additional_images).toEqual([]);
  });

  it("stores all optional fields when provided", async () => {
    const fullProject = {
      title: "Full Kitchen",
      description: "Complete kitchen renovation",
      service_type: "Kitchen",
      location: "Dallas, TX",
      before_image_url: "https://example.com/before.jpg",
      after_image_url: "https://example.com/after.jpg",
      additional_images: ["https://example.com/img1.jpg"],
      featured: true,
      published: true,
    };

    const { insert } = makeInsertSelectSingleChain({
      data: { id: "proj-6", ...fullProject },
      error: null,
    });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await POST(makePostRequest(fullProject));

    const insertArg = (insert as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(insertArg.title).toBe("Full Kitchen");
    expect(insertArg.service_type).toBe("Kitchen");
    expect(insertArg.featured).toBe(true);
    expect(insertArg.additional_images).toEqual(["https://example.com/img1.jpg"]);
  });

  it("returns 500 when Supabase insert returns an error", async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: "Insert error" } });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ insert })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await POST(makePostRequest({ title: "Kitchen" }));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Insert error");
  });
});

/* -------------------------------------------------------------------------- */
/*  Tests: PATCH /api/gallery/[id]                                            */
/* -------------------------------------------------------------------------- */

describe("PATCH /api/gallery/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    const mockSupabase = buildMockSupabase(null, () => ({}));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await PATCH(makePatchRequest({ title: "Updated" }), makeParams(GALLERY_ID));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 400 for invalid JSON body", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" }, () => ({}));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const req = new Request(`http://localhost/api/gallery/${GALLERY_ID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "{bad}",
    });

    const res = await PATCH(req, makeParams(GALLERY_ID));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/invalid request body/i);
  });

  it("returns 400 when no valid (whitelisted) fields are provided", async () => {
    const mockSupabase = buildMockSupabase({ email: "admin@example.com" }, () => ({}));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await PATCH(
      makePatchRequest({ hacked: "value", secret_field: true }),
      makeParams(GALLERY_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/no valid fields/i);
  });

  it("only passes whitelisted fields to the update query", async () => {
    const { update } = makeUpdateChain({
      data: { id: GALLERY_ID, title: "New Title" },
      error: null,
    });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    await PATCH(
      makePatchRequest({ title: "New Title", injected_field: "evil", admin_override: true }),
      makeParams(GALLERY_ID)
    );

    const updateArg = (update as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(updateArg).toEqual({ title: "New Title" });
    expect(updateArg).not.toHaveProperty("injected_field");
    expect(updateArg).not.toHaveProperty("admin_override");
  });

  it("returns 200 with updated project data on success", async () => {
    const updatedProject = {
      id: GALLERY_ID,
      title: "Renovated Kitchen",
      published: false,
    };
    const { update } = makeUpdateChain({ data: updatedProject, error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await PATCH(
      makePatchRequest({ title: "Renovated Kitchen", published: false }),
      makeParams(GALLERY_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.title).toBe("Renovated Kitchen");
    expect(body.published).toBe(false);
  });

  it("allows all whitelisted gallery fields", async () => {
    const allWhitelisted = {
      title: "New Title",
      description: "Updated desc",
      service_type: "Bathroom",
      location: "Plano, TX",
      before_image_url: "https://example.com/b.jpg",
      after_image_url: "https://example.com/a.jpg",
      additional_images: [],
      featured: true,
      display_order: 3,
      published: true,
    };

    const { update } = makeUpdateChain({
      data: { id: GALLERY_ID, ...allWhitelisted },
      error: null,
    });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await PATCH(
      makePatchRequest(allWhitelisted),
      makeParams(GALLERY_ID)
    );

    expect(res.status).toBe(200);

    const updateArg = (update as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(Object.keys(updateArg)).toHaveLength(Object.keys(allWhitelisted).length);
  });

  it("returns 500 when Supabase update returns an error", async () => {
    const { update } = makeUpdateChain({ data: null, error: { message: "Update failed" } });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await PATCH(
      makePatchRequest({ title: "Broken Update" }),
      makeParams(GALLERY_ID)
    );
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Update failed");
  });

  it("passes the correct gallery id to the update query", async () => {
    const { update, eq } = makeUpdateChain({
      data: { id: GALLERY_ID, title: "Test" },
      error: null,
    });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ update })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const customId = "different-gallery-id";
    await PATCH(makePatchRequest({ title: "Test" }), makeParams(customId));

    expect(eq).toHaveBeenCalledWith("id", customId);
  });
});

/* -------------------------------------------------------------------------- */
/*  Tests: DELETE /api/gallery/[id]                                           */
/* -------------------------------------------------------------------------- */

describe("DELETE /api/gallery/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    const mockSupabase = buildMockSupabase(null, () => ({}));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await DELETE(makeDeleteRequest(), makeParams(GALLERY_ID));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 200 with success true when project is deleted", async () => {
    const { delete: del, eq } = makeDeleteChain({ error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await DELETE(makeDeleteRequest(), makeParams(GALLERY_ID));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(eq).toHaveBeenCalledWith("id", GALLERY_ID);
  });

  it("returns 500 when Supabase delete returns an error", async () => {
    const { delete: del } = makeDeleteChain({ error: { message: "Cannot delete" } });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const res = await DELETE(makeDeleteRequest(), makeParams(GALLERY_ID));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Cannot delete");
  });

  it("passes the correct gallery id to the delete query", async () => {
    const { delete: del, eq } = makeDeleteChain({ error: null });
    const mockSupabase = buildMockSupabase(
      { email: "admin@example.com" },
      () => ({ delete: del })
    );
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);

    const customId = "specific-gallery-id";
    await DELETE(makeDeleteRequest(), makeParams(customId));

    expect(eq).toHaveBeenCalledWith("id", customId);
  });
});

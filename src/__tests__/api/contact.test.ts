import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/(main)/api/contact/route";

/* -------------------------------------------------------------------------- */
/*  Module Mocks                                                               */
/*                                                                             */
/*  vi.mock factories are hoisted to the top of the file by Vitest's          */
/*  transform — plain `const` declarations above them are NOT yet initialized  */
/*  at factory execution time. Use vi.hoisted() to create variables that are  */
/*  guaranteed to be available when the mock factories run.                   */
/* -------------------------------------------------------------------------- */

const { mockInsert, mockEmailSend } = vi.hoisted(() => ({
  mockInsert: vi.fn(),
  mockEmailSend: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  })),
}));

vi.mock("resend", () => ({
  // Resend is used with `new Resend(apiKey)` — the mock must be a constructor.
  Resend: class {
    emails = { send: mockEmailSend };
  },
}));

vi.mock("@/lib/emails", () => ({
  buildConfirmationEmail: vi.fn(({ name }: { name: string }) => ({
    subject: `Thanks for reaching out, ${name} — Trinity Remodeling`,
    html: "<p>confirmation</p>",
  })),
  EMAIL_FROM: "Trinity Remodeling <notifications@mail.trinity-remodeling.com>",
}));

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeRawRequest(raw: string): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw,
  });
}

const VALID_BODY = {
  name: "Jane Smith",
  email: "jane@example.com",
  message: "I would like a quote for a kitchen remodel.",
};

/* -------------------------------------------------------------------------- */
/*  Tests                                                                      */
/* -------------------------------------------------------------------------- */

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: successful insert
    mockInsert.mockResolvedValue({ error: null });
    // Default: email send succeeds
    mockEmailSend.mockResolvedValue({ id: "email-123" });
    // Ensure RESEND_API_KEY is absent so email path is skipped by default
    delete process.env.RESEND_API_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  });

  /* ---- Validation: required fields ---------------------------------------- */

  it("returns 400 when name is missing", async () => {
    const req = makeRequest({ email: "jane@example.com", message: "Hello" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/name is required/i);
  });

  it("returns 400 when name is only whitespace", async () => {
    const req = makeRequest({ name: "   ", email: "jane@example.com", message: "Hello" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/name is required/i);
  });

  it("returns 400 when email is missing", async () => {
    const req = makeRequest({ name: "Jane", message: "Hello" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/email is required/i);
  });

  it("returns 400 when email is only whitespace", async () => {
    const req = makeRequest({ name: "Jane", email: "   ", message: "Hello" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/email is required/i);
  });

  it("returns 400 when email format is invalid", async () => {
    const req = makeRequest({ name: "Jane", email: "not-an-email", message: "Hello" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/valid email/i);
  });

  it("returns 400 when email has no domain part", async () => {
    const req = makeRequest({ name: "Jane", email: "jane@", message: "Hello" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/valid email/i);
  });

  it("returns 400 when message is missing", async () => {
    const req = makeRequest({ name: "Jane", email: "jane@example.com" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/message is required/i);
  });

  it("returns 400 when message is only whitespace", async () => {
    const req = makeRequest({ name: "Jane", email: "jane@example.com", message: "   " });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/message is required/i);
  });

  /* ---- Validation: invalid JSON body -------------------------------------- */

  it("returns 400 for invalid JSON body", async () => {
    const req = makeRawRequest("{bad json}");
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/invalid request body/i);
  });

  /* ---- Success: all fields ------------------------------------------------ */

  it("returns 200 and success message when all fields are provided", async () => {
    const req = makeRequest({
      ...VALID_BODY,
      phone: "555-123-4567",
      subject: "Kitchen Remodel",
      service_interest: "Kitchen",
      project_address: "123 Main St",
      project_timeline: "1_3_months",
      property_type: "residential",
      source: "google",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toMatch(/sent successfully/i);
  });

  it("returns 200 and success message with minimal fields (name, email, message)", async () => {
    const req = makeRequest(VALID_BODY);
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  /* ---- Source defaulting -------------------------------------------------- */

  it("defaults source to 'website_contact' when source is not a valid enum value", async () => {
    const req = makeRequest({ ...VALID_BODY, source: "unknown_channel" });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ source: "website_contact" })
    );
  });

  it("defaults source to 'website_contact' when source is omitted", async () => {
    const req = makeRequest(VALID_BODY);
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ source: "website_contact" })
    );
  });

  it("uses provided source when it is a valid enum value", async () => {
    const req = makeRequest({ ...VALID_BODY, source: "referral" });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ source: "referral" })
    );
  });

  /* ---- Property type defaulting ------------------------------------------- */

  it("defaults property_type to 'residential' when not provided", async () => {
    const req = makeRequest(VALID_BODY);
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ property_type: "residential" })
    );
  });

  it("defaults property_type to 'residential' when an invalid value is provided", async () => {
    const req = makeRequest({ ...VALID_BODY, property_type: "warehouse" });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ property_type: "residential" })
    );
  });

  it("uses 'commercial' property_type when explicitly provided", async () => {
    const req = makeRequest({ ...VALID_BODY, property_type: "commercial" });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ property_type: "commercial" })
    );
  });

  /* ---- Input sanitization ------------------------------------------------- */

  it("trims whitespace from name and email before storing", async () => {
    const req = makeRequest({
      name: "  Jane Smith  ",
      email: "  jane@example.com  ",
      message: "  Hello  ",
    });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Jane Smith",
        email: "jane@example.com",
      })
    );
  });

  it("enforces max length on name by truncating at 200 characters", async () => {
    const longName = "A".repeat(300);
    const req = makeRequest({ name: longName, email: "jane@example.com", message: "Hello" });
    await POST(req);

    const insertArg = mockInsert.mock.calls[0][0];
    expect(insertArg.name.length).toBe(200);
  });

  it("enforces max length on message by truncating at 5000 characters", async () => {
    const longMessage = "B".repeat(6000);
    const req = makeRequest({ ...VALID_BODY, message: longMessage });
    await POST(req);

    const insertArg = mockInsert.mock.calls[0][0];
    expect(insertArg.message.length).toBe(5000);
  });

  it("stores phone as null when phone is not provided", async () => {
    const req = makeRequest(VALID_BODY);
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ phone: null })
    );
  });

  it("stores phone as null when phone is an empty string", async () => {
    const req = makeRequest({ ...VALID_BODY, phone: "" });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ phone: null })
    );
  });

  it("prepends subject to message when subject is provided", async () => {
    const req = makeRequest({ ...VALID_BODY, subject: "Kitchen" });
    await POST(req);

    const insertArg = mockInsert.mock.calls[0][0];
    expect(insertArg.message).toBe("[Kitchen] I would like a quote for a kitchen remodel.");
  });

  /* ---- project_timeline validation ---------------------------------------- */

  it("sets project_timeline to null when an invalid timeline value is provided", async () => {
    const req = makeRequest({ ...VALID_BODY, project_timeline: "tomorrow" });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ project_timeline: null })
    );
  });

  it("uses project_timeline when a valid value is provided", async () => {
    const req = makeRequest({ ...VALID_BODY, project_timeline: "asap" });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ project_timeline: "asap" })
    );
  });

  /* ---- Supabase error handling -------------------------------------------- */

  it("returns 500 when Supabase insert returns an error", async () => {
    mockInsert.mockResolvedValue({ error: { message: "DB connection failed" } });

    const req = makeRequest(VALID_BODY);
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toMatch(/failed to save/i);
  });

  it("returns 500 when Supabase insert throws an exception", async () => {
    mockInsert.mockRejectedValue(new Error("Network error"));

    const req = makeRequest(VALID_BODY);
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toMatch(/unexpected error/i);
  });

  /* ---- Email notification: fire-and-forget -------------------------------- */

  it("returns 200 even when RESEND_API_KEY is set and email send fails", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    mockEmailSend.mockRejectedValue(new Error("Resend service unavailable"));

    const req = makeRequest(VALID_BODY);
    const res = await POST(req);
    const body = await res.json();

    // Email failure must not block the success response
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("does not call Resend when RESEND_API_KEY is not set", async () => {
    delete process.env.RESEND_API_KEY;

    const req = makeRequest(VALID_BODY);
    await POST(req);

    expect(mockEmailSend).not.toHaveBeenCalled();
  });

  it("calls Resend with correct recipient when RESEND_API_KEY is set", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.ADMIN_EMAIL = "admin@example.com";
    mockEmailSend.mockResolvedValue({ id: "email-abc" });

    const req = makeRequest({ ...VALID_BODY, name: "Test User" });
    await POST(req);

    expect(mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["admin@example.com"],
        subject: expect.stringContaining("Test User"),
      })
    );
  });

  /* ---- Lead status is always "new" ---------------------------------------- */

  it("always inserts lead with status 'new'", async () => {
    const req = makeRequest(VALID_BODY);
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ status: "new" })
    );
  });

  /* ---- Confirmation email to lead ---------------------------------------- */

  it("sends confirmation email to the lead when RESEND_API_KEY is set", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.ADMIN_EMAIL = "admin@example.com";
    mockEmailSend.mockResolvedValue({ id: "email-abc" });

    const req = makeRequest({ ...VALID_BODY, service_interest: "Kitchen" });
    await POST(req);

    // Should be called twice: once for admin, once for lead confirmation
    expect(mockEmailSend).toHaveBeenCalledTimes(2);

    // Second call should be to the lead's email
    const confirmationCall = mockEmailSend.mock.calls[1][0];
    expect(confirmationCall.to).toEqual(["jane@example.com"]);
    expect(confirmationCall.subject).toContain("Jane Smith");
  });

  it("does not send confirmation email when RESEND_API_KEY is not set", async () => {
    delete process.env.RESEND_API_KEY;

    const req = makeRequest(VALID_BODY);
    await POST(req);

    expect(mockEmailSend).not.toHaveBeenCalled();
  });
});

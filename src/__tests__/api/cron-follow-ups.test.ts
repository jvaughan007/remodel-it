import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/cron/follow-ups/route";

const { mockRpc, mockEmailSend } = vi.hoisted(() => ({
  mockRpc: vi.fn(),
  mockEmailSend: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    rpc: mockRpc,
  })),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockEmailSend };
  },
}));

function makeRequest(headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/cron/follow-ups", {
    method: "POST",
    headers,
  });
}

describe("POST /api/cron/follow-ups", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = "test-secret";
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.ADMIN_EMAIL = "admin@example.com";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
    process.env.NEXT_PUBLIC_SITE_URL = "https://trinity-remodeling.com";
    mockRpc.mockResolvedValue({ data: [], error: null });
    mockEmailSend.mockResolvedValue({ id: "email-123" });
  });

  it("returns 401 when Authorization header is missing", async () => {
    const req = makeRequest();
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 when Authorization header has wrong secret", async () => {
    const req = makeRequest({ Authorization: "Bearer wrong-secret" });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 when Authorization header is correct", async () => {
    const req = makeRequest({ Authorization: "Bearer test-secret" });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("sends admin reminder for leads returned by claim_admin_reminder_leads", async () => {
    const oldLead = {
      id: "lead-1",
      name: "Jane",
      email: "jane@example.com",
      phone: "555-1234",
      service_interest: "Kitchen",
      created_at: "2026-03-17T10:00:00Z",
    };

    mockRpc
      .mockResolvedValueOnce({ data: [oldLead], error: null })
      .mockResolvedValueOnce({ data: [], error: null });

    const req = makeRequest({ Authorization: "Bearer test-secret" });
    await POST(req);

    expect(mockEmailSend).toHaveBeenCalledTimes(1);
    expect(mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["admin@example.com"],
        subject: expect.stringContaining("Jane"),
      })
    );
  });

  it("sends customer follow-up for leads returned by claim_customer_followup_leads", async () => {
    const oldLead = {
      id: "lead-2",
      name: "Bob",
      email: "bob@example.com",
      phone: null,
      service_interest: "Bathroom",
      created_at: "2026-03-14T10:00:00Z",
    };

    mockRpc
      .mockResolvedValueOnce({ data: [], error: null })
      .mockResolvedValueOnce({ data: [oldLead], error: null });

    const req = makeRequest({ Authorization: "Bearer test-secret" });
    await POST(req);

    expect(mockEmailSend).toHaveBeenCalledTimes(1);
    expect(mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["bob@example.com"],
        subject: expect.stringContaining("Bathroom"),
      })
    );
  });

  it("returns 200 with zero sends when no leads need follow-up", async () => {
    mockRpc
      .mockResolvedValueOnce({ data: [], error: null })
      .mockResolvedValueOnce({ data: [], error: null });

    const req = makeRequest({ Authorization: "Bearer test-secret" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.adminReminders).toBe(0);
    expect(body.customerFollowups).toBe(0);
    expect(mockEmailSend).not.toHaveBeenCalled();
  });

  it("continues processing other leads when one email fails", async () => {
    const lead1 = {
      id: "lead-1", name: "Jane", email: "jane@example.com",
      phone: null, service_interest: "Kitchen", created_at: "2026-03-17T10:00:00Z",
    };
    const lead2 = {
      id: "lead-2", name: "Bob", email: "bob@example.com",
      phone: null, service_interest: "Bathroom", created_at: "2026-03-17T10:00:00Z",
    };

    mockRpc
      .mockResolvedValueOnce({ data: [lead1, lead2], error: null })
      .mockResolvedValueOnce({ data: [], error: null });

    mockEmailSend
      .mockRejectedValueOnce(new Error("Resend down"))
      .mockResolvedValueOnce({ id: "email-456" });

    const req = makeRequest({ Authorization: "Bearer test-secret" });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockEmailSend).toHaveBeenCalledTimes(2);
  });
});

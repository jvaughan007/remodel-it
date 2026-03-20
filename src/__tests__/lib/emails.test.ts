import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  buildConfirmationEmail,
  buildAdminReminderEmail,
  buildCustomerFollowupEmail,
} from "@/lib/emails";

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
    );
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('"hello"')).toBe("&quot;hello&quot;");
  });

  it("returns empty string for empty input", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("passes through safe strings unchanged", () => {
    expect(escapeHtml("Jane Smith")).toBe("Jane Smith");
  });
});

describe("buildConfirmationEmail", () => {
  it("returns subject and html", () => {
    const result = buildConfirmationEmail({
      name: "Jane Smith",
      serviceInterest: "Kitchen Remodeling",
      siteUrl: "https://trinity-remodeling.com",
    });
    expect(result.subject).toContain("Jane Smith");
    expect(result.html).toContain("Jane Smith");
    expect(result.html).toContain("Kitchen Remodeling");
    expect(result.html).toContain("1-2 business days");
    expect(result.html).toContain("(817) 809-7997");
  });

  it("escapes HTML in user-supplied name", () => {
    const result = buildConfirmationEmail({
      name: "<script>alert(1)</script>",
      serviceInterest: "Kitchen",
      siteUrl: "https://trinity-remodeling.com",
    });
    expect(result.html).not.toContain("<script>");
    expect(result.html).toContain("&lt;script&gt;");
  });

  it("handles missing serviceInterest gracefully", () => {
    const result = buildConfirmationEmail({
      name: "Jane",
      serviceInterest: "",
      siteUrl: "https://trinity-remodeling.com",
    });
    expect(result.subject).toContain("Jane");
    expect(result.html).toContain("your project");
  });
});

describe("buildAdminReminderEmail", () => {
  it("returns subject and html with lead details", () => {
    const result = buildAdminReminderEmail({
      id: "abc-123",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(555) 123-4567",
      serviceInterest: "Bathroom Renovation",
      createdAt: "2026-03-18T14:00:00Z",
      siteUrl: "https://trinity-remodeling.com",
    });
    expect(result.subject).toContain("Jane Smith");
    expect(result.subject).toContain("Bathroom Renovation");
    expect(result.html).toContain("jane@example.com");
    expect(result.html).toContain("/admin/leads/abc-123");
  });
});

describe("buildCustomerFollowupEmail", () => {
  it("returns subject and html with service interest", () => {
    const result = buildCustomerFollowupEmail({
      name: "Jane Smith",
      serviceInterest: "Kitchen Remodeling",
    });
    expect(result.subject).toContain("Kitchen Remodeling");
    expect(result.html).toContain("Jane Smith");
    expect(result.html).toContain("(817) 809-7997");
    expect(result.html).toContain("nicholas@trinity-remodeling.com");
  });

  it("escapes HTML in name and serviceInterest", () => {
    const result = buildCustomerFollowupEmail({
      name: '<img src=x onerror="alert(1)">',
      serviceInterest: "<b>Kitchen</b>",
    });
    expect(result.html).not.toContain("<img");
    expect(result.html).not.toContain("<b>");
  });
});

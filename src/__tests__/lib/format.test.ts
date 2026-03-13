import { describe, it, expect } from "vitest";
import {
  formatStatus,
  formatSource,
  formatService,
  formatPhone,
  formatCurrency,
} from "@/lib/format";

describe("formatStatus", () => {
  it("formats 'new' to 'New'", () => {
    expect(formatStatus("new")).toBe("New");
  });

  it("formats 'contacted' to 'Contacted'", () => {
    expect(formatStatus("contacted")).toBe("Contacted");
  });

  it("formats 'estimate_scheduled' to 'Estimate Scheduled'", () => {
    expect(formatStatus("estimate_scheduled")).toBe("Estimate Scheduled");
  });

  it("formats 'estimate_done' to 'Estimate Done'", () => {
    expect(formatStatus("estimate_done")).toBe("Estimate Done");
  });

  it("formats 'proposal_sent' to 'Proposal Sent'", () => {
    expect(formatStatus("proposal_sent")).toBe("Proposal Sent");
  });

  it("formats 'negotiating' to 'Negotiating'", () => {
    expect(formatStatus("negotiating")).toBe("Negotiating");
  });

  it("formats 'won' to 'Won'", () => {
    expect(formatStatus("won")).toBe("Won");
  });

  it("formats 'in_progress' to 'In Progress'", () => {
    expect(formatStatus("in_progress")).toBe("In Progress");
  });

  it("formats 'completed' to 'Completed'", () => {
    expect(formatStatus("completed")).toBe("Completed");
  });

  it("formats 'lost' to 'Lost'", () => {
    expect(formatStatus("lost")).toBe("Lost");
  });

  it("formats 'unresponsive' to 'Unresponsive'", () => {
    expect(formatStatus("unresponsive")).toBe("Unresponsive");
  });

  it("falls back to title case for an unknown status using underscore replacement", () => {
    expect(formatStatus("custom_status_value")).toBe("Custom Status Value");
  });

  it("falls back to title case for a single word unknown status", () => {
    expect(formatStatus("pending")).toBe("Pending");
  });
});

describe("formatSource", () => {
  it("formats 'website_contact' to 'Website Contact Form'", () => {
    expect(formatSource("website_contact")).toBe("Website Contact Form");
  });

  it("formats 'website_quote' to 'Website Quote Form'", () => {
    expect(formatSource("website_quote")).toBe("Website Quote Form");
  });

  it("formats 'google' to 'Google Search'", () => {
    expect(formatSource("google")).toBe("Google Search");
  });

  it("formats 'google_maps' to 'Google Maps'", () => {
    expect(formatSource("google_maps")).toBe("Google Maps");
  });

  it("formats 'yelp' to 'Yelp'", () => {
    expect(formatSource("yelp")).toBe("Yelp");
  });

  it("formats 'nextdoor' to 'Nextdoor'", () => {
    expect(formatSource("nextdoor")).toBe("Nextdoor");
  });

  it("formats 'referral' to 'Referral'", () => {
    expect(formatSource("referral")).toBe("Referral");
  });

  it("formats 'repeat_customer' to 'Repeat Customer'", () => {
    expect(formatSource("repeat_customer")).toBe("Repeat Customer");
  });

  it("formats 'yard_sign' to 'Yard Sign'", () => {
    expect(formatSource("yard_sign")).toBe("Yard Sign");
  });

  it("formats 'manual' to 'Manually Added'", () => {
    expect(formatSource("manual")).toBe("Manually Added");
  });

  it("falls back to title case for an unknown source", () => {
    expect(formatSource("social_media")).toBe("Social Media");
  });

  it("falls back to title case for a single word unknown source", () => {
    expect(formatSource("facebook")).toBe("Facebook");
  });
});

describe("formatService", () => {
  it("formats 'kitchen-remodeling' to 'Kitchen Remodeling'", () => {
    expect(formatService("kitchen-remodeling")).toBe("Kitchen Remodeling");
  });

  it("formats 'bathroom-renovation' to 'Bathroom Renovation'", () => {
    expect(formatService("bathroom-renovation")).toBe("Bathroom Renovation");
  });

  it("formats 'whole-home-remodel' to 'Whole Home Remodel'", () => {
    expect(formatService("whole-home-remodel")).toBe("Whole Home Remodel");
  });

  it("formats 'home-additions' to 'Home Additions'", () => {
    expect(formatService("home-additions")).toBe("Home Additions");
  });

  it("formats 'outdoor-living' to 'Outdoor Living'", () => {
    expect(formatService("outdoor-living")).toBe("Outdoor Living");
  });

  it("formats 'flooring-installation' to 'Flooring Installation'", () => {
    expect(formatService("flooring-installation")).toBe("Flooring Installation");
  });

  it("falls back to title case for an unknown slug using hyphen replacement", () => {
    expect(formatService("custom-service-type")).toBe("Custom Service Type");
  });

  it("falls back to title case for a single word unknown slug", () => {
    expect(formatService("roofing")).toBe("Roofing");
  });
});

describe("formatPhone", () => {
  it("formats a 10-digit phone number: 9725551234 → (972) 555-1234", () => {
    expect(formatPhone("9725551234")).toBe("(972) 555-1234");
  });

  it("formats a 10-digit phone number with formatting chars stripped first", () => {
    expect(formatPhone("972-555-1234")).toBe("(972) 555-1234");
  });

  it("formats a 10-digit phone number with dots: 972.555.1234", () => {
    expect(formatPhone("972.555.1234")).toBe("(972) 555-1234");
  });

  it("formats an 11-digit phone number with leading 1: 19725551234 → (972) 555-1234", () => {
    expect(formatPhone("19725551234")).toBe("(972) 555-1234");
  });

  it("formats an 11-digit phone number with leading 1 and separators: 1-972-555-1234", () => {
    expect(formatPhone("1-972-555-1234")).toBe("(972) 555-1234");
  });

  it("returns the original string for a format that does not match 10 or 11 digits", () => {
    expect(formatPhone("555-1234")).toBe("555-1234");
  });

  it("returns the original string for a 12-digit number", () => {
    expect(formatPhone("197255512340")).toBe("197255512340");
  });

  it("returns the original string for an empty string", () => {
    expect(formatPhone("")).toBe("");
  });

  it("returns the original string for a non-numeric input", () => {
    expect(formatPhone("N/A")).toBe("N/A");
  });
});

describe("formatCurrency", () => {
  it("formats a whole number: 85000 → $85,000", () => {
    expect(formatCurrency(85000)).toBe("$85,000");
  });

  it("formats zero: 0 → $0", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("formats a large number: 1000000 → $1,000,000", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000");
  });

  it("formats a small amount: 500 → $500", () => {
    expect(formatCurrency(500)).toBe("$500");
  });

  it("rounds down fractional cents (minimumFractionDigits: 0)", () => {
    // formatCurrency is configured with 0 fraction digits, so no cents displayed
    expect(formatCurrency(85000.99)).toBe("$85,001");
  });

  it("formats a typical project estimate: 25000 → $25,000", () => {
    expect(formatCurrency(25000)).toBe("$25,000");
  });
});

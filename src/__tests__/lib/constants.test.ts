import { describe, it, expect } from "vitest";
import { SITE, SERVICES, LEAD_SOURCES, LEAD_STATUSES } from "@/lib/constants";

describe("SITE", () => {
  it("has a name field", () => {
    expect(SITE.name).toBeDefined();
    expect(typeof SITE.name).toBe("string");
    expect(SITE.name.length).toBeGreaterThan(0);
  });

  it("has a url field", () => {
    expect(SITE.url).toBeDefined();
    expect(typeof SITE.url).toBe("string");
    expect(SITE.url.length).toBeGreaterThan(0);
  });

  it("has an email field", () => {
    expect(SITE.email).toBeDefined();
    expect(typeof SITE.email).toBe("string");
    expect(SITE.email).toContain("@");
  });

  it("has a phone field", () => {
    expect(SITE.phone).toBeDefined();
    expect(typeof SITE.phone).toBe("string");
    expect(SITE.phone.length).toBeGreaterThan(0);
  });

  it("has an address field with street, city, state, zip", () => {
    expect(SITE.address).toBeDefined();
    expect(typeof SITE.address.street).toBe("string");
    expect(typeof SITE.address.city).toBe("string");
    expect(typeof SITE.address.state).toBe("string");
    expect(typeof SITE.address.zip).toBe("string");
  });

  it("name is Trinity Remodeling", () => {
    expect(SITE.name).toBe("Trinity Remodeling");
  });

  it("url is the production domain", () => {
    expect(SITE.url).toBe("https://trinityremodelingdfw.com");
  });
});

describe("SERVICES", () => {
  it("has exactly 6 service items", () => {
    expect(SERVICES).toHaveLength(6);
  });

  it("each service has a slug field", () => {
    SERVICES.forEach((service) => {
      expect(service.slug).toBeDefined();
      expect(typeof service.slug).toBe("string");
      expect(service.slug.length).toBeGreaterThan(0);
    });
  });

  it("each service has a title field", () => {
    SERVICES.forEach((service) => {
      expect(service.title).toBeDefined();
      expect(typeof service.title).toBe("string");
      expect(service.title.length).toBeGreaterThan(0);
    });
  });

  it("each service has a shortTitle field", () => {
    SERVICES.forEach((service) => {
      expect(service.shortTitle).toBeDefined();
      expect(typeof service.shortTitle).toBe("string");
      expect(service.shortTitle.length).toBeGreaterThan(0);
    });
  });

  it("each service has a description field", () => {
    SERVICES.forEach((service) => {
      expect(service.description).toBeDefined();
      expect(typeof service.description).toBe("string");
      expect(service.description.length).toBeGreaterThan(0);
    });
  });

  it("each service has an icon field", () => {
    SERVICES.forEach((service) => {
      expect(service.icon).toBeDefined();
      expect(typeof service.icon).toBe("string");
      expect(service.icon.length).toBeGreaterThan(0);
    });
  });

  it("all service slugs are unique", () => {
    const slugs = SERVICES.map((s) => s.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("includes kitchen-remodeling service", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(slugs).toContain("kitchen-remodeling");
  });

  it("includes bathroom-renovation service", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(slugs).toContain("bathroom-renovation");
  });

  it("includes whole-home-remodel service", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(slugs).toContain("whole-home-remodel");
  });

  it("includes home-additions service", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(slugs).toContain("home-additions");
  });

  it("includes outdoor-living service", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(slugs).toContain("outdoor-living");
  });

  it("includes flooring-installation service", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(slugs).toContain("flooring-installation");
  });
});

describe("LEAD_SOURCES", () => {
  it("has exactly 10 lead sources", () => {
    expect(LEAD_SOURCES).toHaveLength(10);
  });

  it("each source has a value field", () => {
    LEAD_SOURCES.forEach((source) => {
      expect(source.value).toBeDefined();
      expect(typeof source.value).toBe("string");
      expect(source.value.length).toBeGreaterThan(0);
    });
  });

  it("each source has a label field", () => {
    LEAD_SOURCES.forEach((source) => {
      expect(source.label).toBeDefined();
      expect(typeof source.label).toBe("string");
      expect(source.label.length).toBeGreaterThan(0);
    });
  });

  it("all lead source values are unique", () => {
    const values = LEAD_SOURCES.map((s) => s.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it("includes website_contact source", () => {
    const values = LEAD_SOURCES.map((s) => s.value);
    expect(values).toContain("website_contact");
  });

  it("includes website_quote source", () => {
    const values = LEAD_SOURCES.map((s) => s.value);
    expect(values).toContain("website_quote");
  });

  it("includes google source", () => {
    const values = LEAD_SOURCES.map((s) => s.value);
    expect(values).toContain("google");
  });

  it("includes google_maps source", () => {
    const values = LEAD_SOURCES.map((s) => s.value);
    expect(values).toContain("google_maps");
  });

  it("includes yelp source", () => {
    const values = LEAD_SOURCES.map((s) => s.value);
    expect(values).toContain("yelp");
  });

  it("includes nextdoor source", () => {
    const values = LEAD_SOURCES.map((s) => s.value);
    expect(values).toContain("nextdoor");
  });

  it("includes referral source", () => {
    const values = LEAD_SOURCES.map((s) => s.value);
    expect(values).toContain("referral");
  });

  it("includes repeat_customer source", () => {
    const values = LEAD_SOURCES.map((s) => s.value);
    expect(values).toContain("repeat_customer");
  });

  it("includes yard_sign source", () => {
    const values = LEAD_SOURCES.map((s) => s.value);
    expect(values).toContain("yard_sign");
  });

  it("includes manual source", () => {
    const values = LEAD_SOURCES.map((s) => s.value);
    expect(values).toContain("manual");
  });
});

describe("LEAD_STATUSES", () => {
  it("has exactly 11 lead statuses", () => {
    expect(LEAD_STATUSES).toHaveLength(11);
  });

  it("each status has a value field", () => {
    LEAD_STATUSES.forEach((status) => {
      expect(status.value).toBeDefined();
      expect(typeof status.value).toBe("string");
      expect(status.value.length).toBeGreaterThan(0);
    });
  });

  it("each status has a label field", () => {
    LEAD_STATUSES.forEach((status) => {
      expect(status.label).toBeDefined();
      expect(typeof status.label).toBe("string");
      expect(status.label.length).toBeGreaterThan(0);
    });
  });

  it("all lead status values are unique", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it("includes new status", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    expect(values).toContain("new");
  });

  it("includes contacted status", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    expect(values).toContain("contacted");
  });

  it("includes estimate_scheduled status", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    expect(values).toContain("estimate_scheduled");
  });

  it("includes estimate_done status", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    expect(values).toContain("estimate_done");
  });

  it("includes proposal_sent status", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    expect(values).toContain("proposal_sent");
  });

  it("includes negotiating status", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    expect(values).toContain("negotiating");
  });

  it("includes won status", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    expect(values).toContain("won");
  });

  it("includes in_progress status", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    expect(values).toContain("in_progress");
  });

  it("includes completed status", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    expect(values).toContain("completed");
  });

  it("includes lost status", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    expect(values).toContain("lost");
  });

  it("includes unresponsive status", () => {
    const values = LEAD_STATUSES.map((s) => s.value);
    expect(values).toContain("unresponsive");
  });
});

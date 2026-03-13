import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

/* -------------------------------------------------------------------------- */
/*  Validation Constants                                                      */
/* -------------------------------------------------------------------------- */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320;
const MAX_PHONE_LENGTH = 30;
const MAX_SUBJECT_LENGTH = 300;
const MAX_SERVICE_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_ADDRESS_LENGTH = 500;
const MAX_TIMELINE_LENGTH = 50;
const MAX_PROPERTY_TYPE_LENGTH = 50;
const MAX_SOURCE_LENGTH = 50;

const VALID_SOURCES = [
  "website_contact",
  "website_quote",
  "google",
  "google_maps",
  "yelp",
  "nextdoor",
  "referral",
  "repeat_customer",
  "yard_sign",
  "manual",
];

const VALID_TIMELINES = [
  "asap",
  "1_3_months",
  "3_6_months",
  "6_plus_months",
  "planning_phase",
];

const VALID_PROPERTY_TYPES = ["residential", "commercial"];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Sanitize and trim an unknown input to a bounded string.
 * Returns an empty string for non-string or blank values.
 */
function sanitize(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

/* -------------------------------------------------------------------------- */
/*  POST /api/contact                                                         */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  // ---- Parse request body ------------------------------------------------
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  // ---- Sanitize inputs ---------------------------------------------------
  const name = sanitize(body.name, MAX_NAME_LENGTH);
  const email = sanitize(body.email, MAX_EMAIL_LENGTH);
  const phone = sanitize(body.phone, MAX_PHONE_LENGTH);
  const subject = sanitize(body.subject, MAX_SUBJECT_LENGTH);
  const message = sanitize(body.message, MAX_MESSAGE_LENGTH);
  const serviceInterest = sanitize(body.service_interest, MAX_SERVICE_LENGTH);
  const projectAddress = sanitize(body.project_address, MAX_ADDRESS_LENGTH);
  const rawTimeline = sanitize(body.project_timeline, MAX_TIMELINE_LENGTH);
  const rawPropertyType = sanitize(body.property_type, MAX_PROPERTY_TYPE_LENGTH);
  const rawSource = sanitize(body.source, MAX_SOURCE_LENGTH);

  // ---- Validate required fields ------------------------------------------
  if (!name) {
    return NextResponse.json(
      { error: "Name is required." },
      { status: 400 }
    );
  }

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  if (!message) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 }
    );
  }

  // ---- Validate enum fields (if provided) --------------------------------
  const source = rawSource && VALID_SOURCES.includes(rawSource)
    ? rawSource
    : "website_contact";

  const projectTimeline = rawTimeline && VALID_TIMELINES.includes(rawTimeline)
    ? rawTimeline
    : null;

  const propertyType = rawPropertyType && VALID_PROPERTY_TYPES.includes(rawPropertyType)
    ? rawPropertyType
    : "residential";

  // ---- Insert lead into Supabase -----------------------------------------
  // Use service role key to bypass RLS (contact form is unauthenticated)
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: dbError } = await supabase.from("leads").insert({
      name,
      email,
      phone: phone || null,
      source,
      service_interest: serviceInterest || null,
      message: subject ? `[${subject}] ${message}` : message,
      status: "new",
      project_address: projectAddress || null,
      project_timeline: projectTimeline,
      property_type: propertyType,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Unexpected error inserting lead:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }

  // ---- Send email notification (fire-and-forget) -------------------------
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail =
      process.env.ADMIN_EMAIL || "nicholas@trinity-remodeling.com";

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://trinity-remodeling.com";

    resend.emails
      .send({
        from: "Trinity Remodeling <notifications@trinity-remodeling.com>",
        to: adminEmail.split(",").map((e) => e.trim()),
        subject: `New Lead: ${name}${serviceInterest ? ` — ${serviceInterest}` : ""}`,
        html: `
        <h2 style="margin:0 0 16px;color:#0A1A2F">New Lead from Trinity Remodeling</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;width:100%">
          <tr>
            <td style="padding:8px 12px 8px 0;font-weight:bold;color:#0A1A2F;vertical-align:top;white-space:nowrap">Name</td>
            <td style="padding:8px 0">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px 8px 0;font-weight:bold;color:#0A1A2F;vertical-align:top;white-space:nowrap">Email</td>
            <td style="padding:8px 0"><a href="mailto:${email}" style="color:#2BB6C9">${email}</a></td>
          </tr>
          ${phone ? `<tr><td style="padding:8px 12px 8px 0;font-weight:bold;color:#0A1A2F;vertical-align:top;white-space:nowrap">Phone</td><td style="padding:8px 0"><a href="tel:${phone.replace(/\D/g, "")}" style="color:#2BB6C9">${phone}</a></td></tr>` : ""}
          ${serviceInterest ? `<tr><td style="padding:8px 12px 8px 0;font-weight:bold;color:#0A1A2F;vertical-align:top;white-space:nowrap">Service</td><td style="padding:8px 0">${serviceInterest}</td></tr>` : ""}
          ${subject ? `<tr><td style="padding:8px 12px 8px 0;font-weight:bold;color:#0A1A2F;vertical-align:top;white-space:nowrap">Subject</td><td style="padding:8px 0">${subject}</td></tr>` : ""}
          ${projectAddress ? `<tr><td style="padding:8px 12px 8px 0;font-weight:bold;color:#0A1A2F;vertical-align:top;white-space:nowrap">Address</td><td style="padding:8px 0">${projectAddress}</td></tr>` : ""}
          ${projectTimeline ? `<tr><td style="padding:8px 12px 8px 0;font-weight:bold;color:#0A1A2F;vertical-align:top;white-space:nowrap">Timeline</td><td style="padding:8px 0">${projectTimeline.replace(/_/g, " ")}</td></tr>` : ""}
          ${propertyType ? `<tr><td style="padding:8px 12px 8px 0;font-weight:bold;color:#0A1A2F;vertical-align:top;white-space:nowrap">Property</td><td style="padding:8px 0">${propertyType}</td></tr>` : ""}
          <tr>
            <td style="padding:8px 12px 8px 0;font-weight:bold;color:#0A1A2F;vertical-align:top;white-space:nowrap">Source</td>
            <td style="padding:8px 0">${source.replace(/_/g, " ")}</td>
          </tr>
        </table>
        <h3 style="margin:24px 0 8px;color:#0A1A2F">Message</h3>
        <p style="margin:0;white-space:pre-wrap;color:#333;background:#f9f9f9;padding:12px;border-radius:8px">${message}</p>
        <hr style="margin:24px 0;border:none;border-top:1px solid #ddd" />
        <p style="margin:0;font-size:12px;color:#888">
          <a href="${siteUrl}/admin/leads" style="color:#2BB6C9">View in CRM &rarr;</a>
        </p>
      `,
      })
      .catch((err) => {
        console.error("Resend notification failed:", err);
      });
  }

  // ---- Success response --------------------------------------------------
  return NextResponse.json(
    { success: true, message: "Your message has been sent successfully." },
    { status: 200 }
  );
}

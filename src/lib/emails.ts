/* -------------------------------------------------------------------------- */
/*  Email Templates for Trinity Remodeling                                    */
/* -------------------------------------------------------------------------- */

/** HTML-escape user-supplied strings to prevent XSS in email clients. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/* ---- Shared constants --------------------------------------------------- */

const NAVY = "#0A1A2F";
const TEAL = "#2BB6C9";
const FROM = "Trinity Remodeling <notifications@mail.trinity-remodeling.com>";
const PHONE = "(817) 809-7997";
const OWNER_EMAIL = "nicholas@trinity-remodeling.com";

export { FROM as EMAIL_FROM };

/* ---- 1. Confirmation email to lead -------------------------------------- */

interface ConfirmationParams {
  name: string;
  serviceInterest: string;
  siteUrl: string;
}

export function buildConfirmationEmail({ name, serviceInterest, siteUrl }: ConfirmationParams) {
  const safeName = escapeHtml(name);
  const safeService = escapeHtml(serviceInterest);
  const projectLabel = safeService || "your project";

  return {
    subject: `Thanks for reaching out, ${name} — Trinity Remodeling`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
        <div style="background:${NAVY};padding:24px 32px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;color:#fff;font-size:20px">Trinity Remodeling</h1>
        </div>
        <div style="padding:32px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px">
          <p style="margin:0 0 16px;font-size:16px">Hi ${safeName},</p>
          <p style="margin:0 0 16px">Thanks for reaching out about ${projectLabel}. I personally review every inquiry, and my team will be in touch within <strong>1-2 business days</strong> to schedule your free consultation.</p>
          <h3 style="margin:24px 0 12px;color:${NAVY}">What happens next:</h3>
          <ol style="margin:0 0 24px;padding-left:20px;line-height:1.8">
            <li>I'll review your project details</li>
            <li>We'll reach out to schedule a free, no-obligation consultation</li>
            <li>You'll receive a detailed estimate tailored to your project</li>
          </ol>
          <p style="margin:0 0 16px">In the meantime, feel free to browse our <a href="${siteUrl}/gallery" style="color:${TEAL}">recent projects</a> or call me directly at <a href="tel:8178097997" style="color:${TEAL}">${PHONE}</a>.</p>
          <p style="margin:24px 0 0;color:${NAVY}">— Nick Stephens, Owner</p>
        </div>
      </div>
    `,
  };
}

/* ---- 2. Admin reminder email (day 2) ------------------------------------ */

interface AdminReminderParams {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  serviceInterest: string | null;
  createdAt: string;
  siteUrl: string;
}

export function buildAdminReminderEmail({
  id, name, email, phone, serviceInterest, createdAt, siteUrl,
}: AdminReminderParams) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : null;
  const safeService = serviceInterest ? escapeHtml(serviceInterest) : "General Inquiry";
  const dateStr = new Date(createdAt).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  return {
    subject: `Reminder: ${name} is waiting to hear back — ${serviceInterest || "General Inquiry"}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
        <div style="background:${NAVY};padding:16px 24px;border-radius:8px 8px 0 0">
          <h2 style="margin:0;color:#fff;font-size:16px">Lead Follow-up Reminder</h2>
        </div>
        <div style="padding:24px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px">
          <p style="margin:0 0 16px">You have a lead that hasn't been contacted yet:</p>
          <table style="border-collapse:collapse;font-size:14px;width:100%">
            <tr>
              <td style="padding:6px 12px 6px 0;font-weight:bold;color:${NAVY}">Name</td>
              <td style="padding:6px 0">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:6px 12px 6px 0;font-weight:bold;color:${NAVY}">Service</td>
              <td style="padding:6px 0">${safeService}</td>
            </tr>
            <tr>
              <td style="padding:6px 12px 6px 0;font-weight:bold;color:${NAVY}">Submitted</td>
              <td style="padding:6px 0">${dateStr}</td>
            </tr>
            <tr>
              <td style="padding:6px 12px 6px 0;font-weight:bold;color:${NAVY}">Email</td>
              <td style="padding:6px 0"><a href="mailto:${safeEmail}" style="color:${TEAL}">${safeEmail}</a></td>
            </tr>
            ${safePhone ? `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;color:${NAVY}">Phone</td><td style="padding:6px 0"><a href="tel:${phone!.replace(/\D/g, "")}" style="color:${TEAL}">${safePhone}</a></td></tr>` : ""}
          </table>
          <div style="margin:24px 0 0;text-align:center">
            <a href="${siteUrl}/admin/leads/${id}" style="display:inline-block;background:${TEAL};color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold">View in CRM &rarr;</a>
          </div>
        </div>
      </div>
    `,
  };
}

/* ---- 3. Customer follow-up email (day 5) -------------------------------- */

interface CustomerFollowupParams {
  name: string;
  serviceInterest: string | null;
}

export function buildCustomerFollowupEmail({ name, serviceInterest }: CustomerFollowupParams) {
  const safeName = escapeHtml(name);
  const safeService = serviceInterest ? escapeHtml(serviceInterest) : "your project";

  return {
    subject: `Still interested in your ${serviceInterest || "remodeling"} project? — Trinity Remodeling`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
        <div style="background:${NAVY};padding:24px 32px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;color:#fff;font-size:20px">Trinity Remodeling</h1>
        </div>
        <div style="padding:32px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px">
          <p style="margin:0 0 16px;font-size:16px">Hi ${safeName},</p>
          <p style="margin:0 0 16px">Just checking in — we received your inquiry about ${safeService} and wanted to make sure we didn't miss you.</p>
          <p style="margin:0 0 8px">If you're still interested, you can reach me directly:</p>
          <ul style="margin:0 0 24px;padding-left:20px;line-height:1.8">
            <li><strong>Call:</strong> <a href="tel:8178097997" style="color:${TEAL}">${PHONE}</a></li>
            <li><strong>Email:</strong> <a href="mailto:${OWNER_EMAIL}" style="color:${TEAL}">${OWNER_EMAIL}</a></li>
          </ul>
          <p style="margin:0 0 24px">No pressure at all — we're here whenever you're ready.</p>
          <p style="margin:0;color:${NAVY}">— Nick Stephens, Owner</p>
        </div>
      </div>
    `,
  };
}

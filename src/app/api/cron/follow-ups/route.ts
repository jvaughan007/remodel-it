import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import {
  buildAdminReminderEmail,
  buildCustomerFollowupEmail,
  EMAIL_FROM,
} from "@/lib/emails";

/* -------------------------------------------------------------------------- */
/*  POST /api/cron/follow-ups                                                 */
/*                                                                            */
/*  Vercel Cron: runs daily at 14:00 UTC (9:00 AM CT).                       */
/*  Sends admin reminders (day 2) and customer follow-ups (day 5).           */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  // ---- Auth check --------------------------------------------------------
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ---- Env validation ----------------------------------------------------
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || "nicholas@trinity-remodeling.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trinity-remodeling.com";

  if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
    console.error("Cron: missing required env vars");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const resend = new Resend(resendApiKey);

  let adminReminders = 0;
  let customerFollowups = 0;

  // ---- Admin reminders (day 2) ------------------------------------------
  const { data: adminLeads, error: adminErr } = await supabase.rpc(
    "claim_admin_reminder_leads"
  );

  if (adminErr) {
    console.error("Cron: admin reminder query error:", adminErr);
  } else if (adminLeads && adminLeads.length > 0) {
    for (const lead of adminLeads) {
      try {
        const email = buildAdminReminderEmail({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          serviceInterest: lead.service_interest,
          createdAt: lead.created_at,
          siteUrl,
        });

        await resend.emails.send({
          from: EMAIL_FROM,
          to: adminEmail.split(",").map((e: string) => e.trim()),
          subject: email.subject,
          html: email.html,
        });

        adminReminders++;
      } catch (err) {
        console.error(`Cron: admin reminder failed for lead ${lead.id}:`, err);
      }
    }
  }

  // ---- Customer follow-ups (day 5) --------------------------------------
  const { data: customerLeads, error: customerErr } = await supabase.rpc(
    "claim_customer_followup_leads"
  );

  if (customerErr) {
    console.error("Cron: customer followup query error:", customerErr);
  } else if (customerLeads && customerLeads.length > 0) {
    for (const lead of customerLeads) {
      try {
        const email = buildCustomerFollowupEmail({
          name: lead.name,
          serviceInterest: lead.service_interest,
        });

        await resend.emails.send({
          from: EMAIL_FROM,
          to: [lead.email],
          subject: email.subject,
          html: email.html,
        });

        customerFollowups++;
      } catch (err) {
        console.error(`Cron: customer followup failed for lead ${lead.id}:`, err);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    adminReminders,
    customerFollowups,
  });
}

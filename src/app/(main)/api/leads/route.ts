import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/* -------------------------------------------------------------------------- */
/*  GET /api/leads — Auth-gated: list leads with optional filters             */
/* -------------------------------------------------------------------------- */

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const archived = searchParams.get("archived");
  const search = searchParams.get("search");

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (archived === "true") {
    query = query.eq("archived", true);
  } else if (archived !== "all") {
    query = query.eq("archived", false);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/* -------------------------------------------------------------------------- */
/*  POST /api/leads — Auth-gated: create a lead from admin panel              */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  const lead: Record<string, unknown> = {
    name,
    email,
    phone: typeof body.phone === "string" ? body.phone.trim() || null : null,
    company:
      typeof body.company === "string" ? body.company.trim() || null : null,
    source: typeof body.source === "string" ? body.source : "manual",
    service_interest:
      typeof body.service_interest === "string"
        ? body.service_interest.trim() || null
        : null,
    message:
      typeof body.message === "string" ? body.message.trim() || null : null,
    status: typeof body.status === "string" ? body.status : "new",
    notes: typeof body.notes === "string" ? body.notes.trim() || null : null,
    deal_value: typeof body.deal_value === "number" ? body.deal_value : null,
    project_address:
      typeof body.project_address === "string"
        ? body.project_address.trim() || null
        : null,
    project_timeline:
      typeof body.project_timeline === "string"
        ? body.project_timeline || null
        : null,
    property_type:
      typeof body.property_type === "string"
        ? body.property_type
        : "residential",
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(lead)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

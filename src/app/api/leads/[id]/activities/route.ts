import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_ACTIVITY_TYPES = [
  "note",
  "email",
  "call",
  "text_message",
  "site_visit",
  "meeting",
  "status_change",
  "document_sent",
  "payment_received",
];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify authenticated
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

  const { type, description } = body as {
    type: string | undefined;
    description: string | undefined;
  };

  if (!type || !description) {
    return NextResponse.json(
      { error: "type and description are required" },
      { status: 400 }
    );
  }

  if (!VALID_ACTIVITY_TYPES.includes(type)) {
    return NextResponse.json(
      {
        error: `type must be one of: ${VALID_ACTIVITY_TYPES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("activities")
    .insert({ lead_id: id, type, description })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

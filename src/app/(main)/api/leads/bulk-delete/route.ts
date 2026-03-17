import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { ids?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json(
      { error: "No lead IDs provided" },
      { status: 400 }
    );
  }

  const ids = body.ids.filter((id): id is string => typeof id === "string");

  if (ids.length === 0) {
    return NextResponse.json(
      { error: "No valid lead IDs provided" },
      { status: 400 }
    );
  }

  const action =
    body.action === "archive"
      ? "archive"
      : body.action === "unarchive"
        ? "unarchive"
        : "delete";

  if (action === "archive") {
    const { error } = await supabase
      .from("leads")
      .update({ archived: true })
      .in("id", ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, archived: ids.length });
  }

  if (action === "unarchive") {
    const { error } = await supabase
      .from("leads")
      .update({ archived: false })
      .in("id", ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, unarchived: ids.length });
  }

  // Default: delete
  const { error } = await supabase.from("leads").delete().in("id", ids);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, deleted: ids.length });
}

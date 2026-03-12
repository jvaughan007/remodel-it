import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/* -------------------------------------------------------------------------- */
/*  GET /api/gallery — Public: fetch published gallery projects               */
/* -------------------------------------------------------------------------- */

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_projects")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/* -------------------------------------------------------------------------- */
/*  POST /api/gallery — Auth-gated: create a new gallery project              */
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

  const title =
    typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const project: Record<string, unknown> = {
    title,
    description:
      typeof body.description === "string"
        ? body.description.trim() || null
        : null,
    service_type:
      typeof body.service_type === "string"
        ? body.service_type.trim() || null
        : null,
    location:
      typeof body.location === "string"
        ? body.location.trim() || null
        : null,
    before_image_url:
      typeof body.before_image_url === "string"
        ? body.before_image_url.trim() || null
        : null,
    after_image_url:
      typeof body.after_image_url === "string"
        ? body.after_image_url.trim() || null
        : null,
    additional_images: Array.isArray(body.additional_images)
      ? body.additional_images
      : [],
    featured: body.featured === true,
    published: body.published !== false, // default true
  };

  const { data, error } = await supabase
    .from("gallery_projects")
    .insert(project)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

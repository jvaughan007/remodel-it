export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GalleryForm } from "@/components/admin/gallery-form";

interface GalleryProject {
  id: string;
  title: string;
  description: string | null;
  service_type: string | null;
  location: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  additional_images: string[];
  featured: boolean;
  display_order: number;
  published: boolean;
}

export default async function GalleryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("gallery_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  const typedProject = project as GalleryProject;

  return <GalleryForm project={typedProject} mode="edit" />;
}

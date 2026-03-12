export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatService } from "@/lib/format";
import {
  Plus,
  Star,
  Eye,
  EyeOff,
  Pencil,
  ImageIcon,
} from "lucide-react";

interface GalleryProject {
  id: string;
  created_at: string;
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

export default async function GalleryAdminPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("gallery_projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const allProjects = (projects ?? []) as GalleryProject[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1A2F]">Gallery</h1>
          <p className="mt-1 text-sm text-[#71797E]">
            {allProjects.length} project
            {allProjects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/gallery/new">
          <Button>
            <Plus className="mr-1.5 size-4" />
            Add New Project
          </Button>
        </Link>
      </div>

      {allProjects.length === 0 ? (
        <Card className="border-[#71797E]/10">
          <CardContent className="px-6 py-16 text-center">
            <ImageIcon className="mx-auto mb-4 size-12 text-[#71797E]/30" />
            <p className="text-[#71797E]">
              No gallery projects yet. Add your first project to showcase your
              work.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((project) => (
            <Card
              key={project.id}
              className="group border-[#71797E]/10 overflow-hidden"
            >
              {/* Image Preview */}
              <div className="relative aspect-video bg-gray-100">
                {project.after_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.after_image_url}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : project.before_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.before_image_url}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="size-10 text-[#71797E]/20" />
                  </div>
                )}

                {/* Status badges overlay */}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  {project.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-xs font-medium text-white">
                      <Star className="size-3" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2">
                  {project.published ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-medium text-white">
                      <Eye className="size-3" />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#71797E]/80 px-2 py-0.5 text-xs font-medium text-white">
                      <EyeOff className="size-3" />
                      Draft
                    </span>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-[#0A1A2F]">
                  {project.title}
                </h3>

                {project.service_type && (
                  <Badge variant="default" className="mt-2">
                    {formatService(project.service_type)}
                  </Badge>
                )}

                {project.location && (
                  <p className="mt-1 text-xs text-[#71797E]">
                    {project.location}
                  </p>
                )}

                {project.description && (
                  <p className="mt-2 text-sm text-[#71797E] line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <Link href={`/admin/gallery/${project.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Pencil className="mr-1.5 size-3" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

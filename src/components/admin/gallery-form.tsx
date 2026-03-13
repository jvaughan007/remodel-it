"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

interface GalleryFormProps {
  project?: GalleryProject;
  mode: "create" | "edit";
}

export function GalleryForm({ project, mode }: GalleryFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [serviceType, setServiceType] = useState(
    project?.service_type ?? ""
  );
  const [location, setLocation] = useState(project?.location ?? "");
  const [beforeImageUrl, setBeforeImageUrl] = useState(
    project?.before_image_url ?? ""
  );
  const [afterImageUrl, setAfterImageUrl] = useState(
    project?.after_image_url ?? ""
  );
  const [additionalImagesText, setAdditionalImagesText] = useState(
    (project?.additional_images ?? []).join("\n")
  );
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [displayOrder, setDisplayOrder] = useState(
    project?.display_order?.toString() ?? "0"
  );
  const [published, setPublished] = useState(project?.published ?? true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSave() {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSaving(true);

    const additionalImages = additionalImagesText
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    const body: Record<string, unknown> = {
      title: title.trim(),
      description: description.trim() || null,
      service_type: serviceType || null,
      location: location.trim() || null,
      before_image_url: beforeImageUrl.trim() || null,
      after_image_url: afterImageUrl.trim() || null,
      additional_images: additionalImages,
      featured,
      display_order: parseInt(displayOrder) || 0,
      published,
    };

    try {
      let res: Response;

      if (mode === "create") {
        res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/gallery/${project!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        router.push("/admin/gallery");
        router.refresh();
      } else {
        const data = await res.json();
        setErrors({ form: data.error || "Failed to save" });
      }
    } catch {
      setErrors({ form: "Network error" });
    }

    setSaving(false);
  }

  async function handleDelete() {
    if (!project) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/gallery/${project.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/gallery");
        router.refresh();
      }
    } catch {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/gallery"
        className="inline-flex items-center gap-1 text-sm text-[#71797E] transition-colors hover:text-[#0A1A2F]"
      >
        <ArrowLeft className="size-3" />
        Back to gallery
      </Link>

      <h1 className="text-2xl font-bold text-[#0A1A2F]">
        {mode === "create" ? "Add New Project" : `Edit: ${project?.title}`}
      </h1>

      {errors.form && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.form}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-[#71797E]/10">
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title)
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.title;
                        return next;
                      });
                  }}
                  placeholder="e.g. Modern Kitchen Remodel in Plano"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the project, materials used, scope of work..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="service_type">Service Type</Label>
                  <select
                    id="service_type"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-[#71797E]/30 bg-white px-3 py-1 text-sm text-[#0A1A2F] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BB6C9]/20 focus-visible:border-[#2BB6C9]"
                  >
                    <option value="">Select service...</option>
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Plano, TX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#71797E]/10">
            <CardHeader>
              <CardTitle className="text-lg">Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="before_image_url">Before Image URL</Label>
                  <Input
                    id="before_image_url"
                    value={beforeImageUrl}
                    onChange={(e) => setBeforeImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                  {beforeImageUrl && (
                    <div className="mt-2 aspect-video overflow-hidden rounded-lg border border-[#71797E]/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={beforeImageUrl}
                        alt="Before preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="after_image_url">After Image URL</Label>
                  <Input
                    id="after_image_url"
                    value={afterImageUrl}
                    onChange={(e) => setAfterImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                  {afterImageUrl && (
                    <div className="mt-2 aspect-video overflow-hidden rounded-lg border border-[#71797E]/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={afterImageUrl}
                        alt="After preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="additional_images">
                  Additional Image URLs (one per line)
                </Label>
                <Textarea
                  id="additional_images"
                  value={additionalImagesText}
                  onChange={(e) => setAdditionalImagesText(e.target.value)}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-[#71797E]/10">
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published" className="cursor-pointer">
                  Published
                </Label>
                <button
                  id="published"
                  type="button"
                  role="switch"
                  aria-checked={published}
                  onClick={() => setPublished(!published)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    published ? "bg-[#2BB6C9]" : "bg-[#71797E]/30"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      published ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured
                </Label>
                <button
                  id="featured"
                  type="button"
                  role="switch"
                  aria-checked={featured}
                  onClick={() => setFeatured(!featured)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    featured ? "bg-amber-500" : "bg-[#71797E]/30"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      featured ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-[#71797E]">
                  Lower numbers appear first
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#71797E]/10">
            <CardContent className="space-y-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                {saving
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Project"
                    : "Save Changes"}
              </Button>

              {mode === "edit" && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete Project
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirmation */}
      {mode === "edit" && (
        <AlertDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &ldquo;{project?.title}&rdquo;
                and all its images. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

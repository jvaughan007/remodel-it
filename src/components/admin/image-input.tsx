"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Link as LinkIcon, X } from "lucide-react";

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  id: string;
}

/**
 * Resize an image file client-side to max 1200px and compress to JPEG ~80%.
 * Keeps storage costs low — typical output: 100-300KB per photo.
 */
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
        "image/jpeg",
        0.8
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function ImageInput({ label, value, onChange, id }: ImageInputProps) {
  const [mode, setMode] = useState<"url" | "upload">(value && !value.includes("supabase") ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const compressed = await compressImage(file);
      const filename = `${id}-${Date.now()}.jpg`;

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(filename, compressed, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("gallery-images")
        .getPublicUrl(filename);

      onChange(urlData.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex rounded-lg border border-[#71797E]/30 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-3 py-1 flex items-center gap-1 transition-colors ${
              mode === "upload"
                ? "bg-[#2BB6C9] text-white"
                : "bg-white text-[#71797E] hover:bg-gray-50"
            }`}
          >
            <Upload className="size-3" />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-3 py-1 flex items-center gap-1 transition-colors ${
              mode === "url"
                ? "bg-[#2BB6C9] text-white"
                : "bg-white text-[#71797E] hover:bg-gray-50"
            }`}
          >
            <LinkIcon className="size-3" />
            URL
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#71797E]/30 px-4 py-3 text-sm text-[#71797E] transition-colors hover:border-[#2BB6C9] hover:text-[#2BB6C9] disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Compressing & uploading...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Choose image (auto-compressed)
              </>
            )}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {value && (
        <div className="relative mt-2 aspect-video overflow-hidden rounded-lg border border-[#71797E]/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={`${label} preview`}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={() => {
              onChange("");
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
          >
            <X className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}

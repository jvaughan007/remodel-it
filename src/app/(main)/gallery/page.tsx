import { createClient } from "@/lib/supabase/server";
import { SERVICES } from "@/lib/constants";
import GalleryContent, { type Project } from "@/components/gallery-content";

const SERVICE_SLUG_TO_CATEGORY: Record<string, string> = {
  "kitchen-remodeling": "Kitchen",
  "bathroom-renovation": "Bathroom",
  "whole-home-remodel": "Whole Home",
  "home-additions": "Additions",
  "outdoor-living": "Outdoor",
  "flooring-installation": "Flooring",
};

// Fallback projects shown when Supabase isn't configured
const FALLBACK_PROJECTS: Project[] = [
  {
    id: "fallback-1",
    title: "Modern Kitchen Transformation",
    category: "Kitchen",
    beforeImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&h=400&fit=crop",
    description: "Complete kitchen renovation featuring custom white oak cabinets, quartz waterfall island, and premium stainless steel appliances.",
    location: "Plano, TX",
  },
  {
    id: "fallback-2",
    title: "Luxury Master Bathroom Retreat",
    category: "Bathroom",
    beforeImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop",
    description: "Spa-like master bathroom with freestanding tub, walk-in shower with dual heads, and heated floors.",
    location: "Frisco, TX",
  },
  {
    id: "fallback-3",
    title: "Whole Home Renovation",
    category: "Whole Home",
    beforeImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    description: "Complete home transformation including open floor plan, updated electrical, new flooring throughout, and modern fixtures.",
    location: "Southlake, TX",
  },
];

export default async function Gallery() {
  let projects: Project[] = FALLBACK_PROJECTS;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder")) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("gallery_projects")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        projects = data.map((p) => ({
          id: p.id,
          title: p.title,
          category: SERVICE_SLUG_TO_CATEGORY[p.service_type ?? ""] ?? p.service_type ?? "Other",
          beforeImage: p.before_image_url ?? "",
          afterImage: p.after_image_url ?? "",
          description: p.description ?? "",
          location: p.location ?? "",
        }));
      }
    } catch {
      // Supabase unavailable — use fallback
    }
  }

  // Build dynamic categories from actual projects
  const categorySet = new Set(projects.map((p) => p.category));
  const allCategories = ["All", ...SERVICES
    .map((s) => SERVICE_SLUG_TO_CATEGORY[s.slug])
    .filter((c) => c && categorySet.has(c))];

  // Add any categories not in SERVICES mapping
  categorySet.forEach((c) => {
    if (!allCategories.includes(c)) allCategories.push(c);
  });

  return <GalleryContent projects={projects} categories={allCategories} />;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  ArrowRightLeft,
  Plus,
  Loader2,
} from "lucide-react";

interface Activity {
  id: string;
  lead_id: string;
  type: string;
  description: string;
  created_at: string;
}

const TYPE_ICONS: Record<string, typeof MessageSquare> = {
  note: MessageSquare,
  email: Mail,
  call: Phone,
  text_message: MessageCircle,
  site_visit: MapPin,
  meeting: Calendar,
  status_change: ArrowRightLeft,
};

const TYPE_LABELS: Record<string, string> = {
  note: "Note",
  email: "Email",
  call: "Call",
  text_message: "Text Message",
  site_visit: "Site Visit",
  meeting: "Meeting",
  status_change: "Status Change",
};

const ACTIVITY_TYPES = [
  "note",
  "email",
  "call",
  "text_message",
  "site_visit",
  "meeting",
] as const;

export function ActivityTimeline({
  leadId,
  activities,
}: {
  leadId: string;
  activities: Activity[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("note");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  async function handleAdd() {
    if (!description.trim()) return;
    setSaving(true);

    await supabase.from("activities").insert({
      lead_id: leadId,
      type,
      description: description.trim(),
    });

    setDescription("");
    setShowForm(false);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Add Activity Button/Form */}
      {showForm ? (
        <div className="space-y-3 rounded-lg border border-[#71797E]/20 p-4">
          <div className="flex flex-wrap gap-2">
            {ACTIVITY_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  type === t
                    ? "bg-[#2BB6C9]/10 text-[#2BB6C9]"
                    : "text-[#71797E] hover:text-[#0A1A2F]"
                }`}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          <Textarea
            placeholder="What happened?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              disabled={saving || !description.trim()}
              size="sm"
            >
              {saving && <Loader2 className="mr-1 size-3 animate-spin" />}
              Add
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setDescription("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(true)}
          className="w-full border-dashed"
        >
          <Plus className="mr-1 size-3" />
          Add activity
        </Button>
      )}

      {/* Timeline */}
      {activities.length === 0 ? (
        <p className="py-4 text-center text-sm text-[#71797E]">
          No activity yet
        </p>
      ) : (
        <div className="relative space-y-4 pl-6">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[#71797E]/15" />

          {activities.map((activity) => {
            const Icon = TYPE_ICONS[activity.type] ?? MessageSquare;
            return (
              <div key={activity.id} className="relative flex gap-3">
                <div className="absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full border border-[#71797E]/20 bg-white">
                  <Icon className="size-3 text-[#71797E]" />
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#71797E]">
                      {TYPE_LABELS[activity.type] ?? activity.type}
                    </span>
                    <span className="text-xs text-[#71797E]/60">
                      {new Date(activity.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-[#0A1A2F]">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

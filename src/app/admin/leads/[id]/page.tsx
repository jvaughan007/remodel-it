export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LeadActions } from "@/components/admin/lead-actions";
import { ActivityTimeline } from "@/components/admin/activity-timeline";
import {
  formatStatus,
  formatSource,
  formatService,
  formatPhone,
} from "@/lib/format";

interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string;
  service_interest: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  next_follow_up: string | null;
  deal_value: number | null;
  lost_reason: string | null;
  project_address: string | null;
  project_timeline: string | null;
  property_type: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

interface ActivityRow {
  id: string;
  lead_id: string;
  type: string;
  description: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "border-[#2BB6C9]/30 bg-[#2BB6C9]/10 text-[#2BB6C9]",
  contacted: "border-blue-500/30 bg-blue-500/10 text-blue-600",
  estimate_scheduled: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600",
  estimate_done: "border-violet-500/30 bg-violet-500/10 text-violet-600",
  proposal_sent: "border-purple-500/30 bg-purple-500/10 text-purple-600",
  negotiating: "border-amber-500/30 bg-amber-500/10 text-amber-600",
  won: "border-green-500/30 bg-green-500/10 text-green-600",
  in_progress: "border-sky-500/30 bg-sky-500/10 text-sky-600",
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
  lost: "border-red-500/30 bg-red-500/10 text-red-600",
  unresponsive: "border-gray-400/30 bg-gray-400/10 text-gray-500",
  archived: "border-[#71797E]/20 bg-[#71797E]/5 text-[#71797E]",
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (!lead) {
    notFound();
  }

  const typedLead = lead as LeadRow;

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  const typedActivities = (activities ?? []) as ActivityRow[];

  const today = new Date().toISOString().split("T")[0];
  const isOverdue =
    !!typedLead.next_follow_up &&
    typedLead.next_follow_up < today &&
    !["won", "lost", "completed"].includes(typedLead.status) &&
    !typedLead.archived;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1 text-sm text-[#71797E] transition-colors hover:text-[#0A1A2F]"
      >
        <ArrowLeft className="size-3" />
        Back to leads
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1A2F]">
            {typedLead.name}
          </h1>
          <p className="mt-1 text-[#71797E]">{typedLead.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {typedLead.archived && (
            <Badge variant="secondary" className="text-sm">
              Archived
            </Badge>
          )}
          <Badge
            variant="outline"
            className={`text-sm ${STATUS_COLORS[typedLead.status] ?? ""}`}
          >
            {formatStatus(typedLead.status)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Lead info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Details Card */}
          <Card className="border-[#71797E]/10">
            <CardHeader>
              <CardTitle className="text-lg">Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <PhoneDetail value={typedLead.phone} />
                <Detail label="Company" value={typedLead.company} />
                <Detail
                  label="Source"
                  value={formatSource(typedLead.source)}
                />
                <Detail
                  label="Service Interest"
                  value={
                    typedLead.service_interest
                      ? formatService(typedLead.service_interest)
                      : null
                  }
                />
                <Detail
                  label="Deal Value"
                  value={
                    typedLead.deal_value
                      ? `$${typedLead.deal_value.toLocaleString()}`
                      : null
                  }
                />
                <div>
                  <p className="text-sm font-medium text-[#71797E]">
                    Next Follow-up
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <p
                      className={`text-sm ${isOverdue ? "font-medium text-amber-600" : "text-[#0A1A2F]"}`}
                    >
                      {typedLead.next_follow_up
                        ? new Date(
                            typedLead.next_follow_up
                          ).toLocaleDateString()
                        : "-"}
                    </p>
                    {isOverdue && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-600">
                        <AlertTriangle className="size-3" />
                        Overdue
                      </span>
                    )}
                  </div>
                </div>
                {typedLead.project_address && (
                  <Detail
                    label="Project Address"
                    value={typedLead.project_address}
                  />
                )}
                {typedLead.project_timeline && (
                  <Detail
                    label="Timeline"
                    value={typedLead.project_timeline}
                  />
                )}
                {typedLead.property_type && (
                  <Detail
                    label="Property Type"
                    value={
                      typedLead.property_type.charAt(0).toUpperCase() +
                      typedLead.property_type.slice(1)
                    }
                  />
                )}
              </div>

              {typedLead.message && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-1 text-sm font-medium text-[#71797E]">
                      Message
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-[#0A1A2F]">
                      {typedLead.message}
                    </p>
                  </div>
                </>
              )}

              {typedLead.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-1 text-sm font-medium text-[#71797E]">
                      Notes
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-[#0A1A2F]">
                      {typedLead.notes}
                    </p>
                  </div>
                </>
              )}

              {typedLead.lost_reason && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-1 text-sm font-medium text-red-500">
                      Lost Reason
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-[#0A1A2F]">
                      {typedLead.lost_reason}
                    </p>
                  </div>
                </>
              )}

              <Separator />
              <div className="flex gap-4 text-xs text-[#71797E]">
                <span>
                  Created:{" "}
                  {new Date(typedLead.created_at).toLocaleDateString()}
                </span>
                <span>
                  Updated:{" "}
                  {new Date(typedLead.updated_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-[#71797E]/10">
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
              <CardDescription>
                Timeline of interactions with this lead
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTimeline
                leadId={typedLead.id}
                activities={typedActivities}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right column: Actions */}
        <div>
          <LeadActions lead={typedLead} />
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-[#71797E]">{label}</p>
      <p className="mt-0.5 text-sm text-[#0A1A2F]">{value || "-"}</p>
    </div>
  );
}

function PhoneDetail({ value }: { value: string | null | undefined }) {
  if (!value) {
    return (
      <div>
        <p className="text-sm font-medium text-[#71797E]">Phone</p>
        <p className="mt-0.5 text-sm text-[#0A1A2F]">-</p>
      </div>
    );
  }

  const digits = value.replace(/\D/g, "");
  const telHref = `tel:${digits.length === 10 ? "+1" + digits : "+" + digits}`;

  return (
    <div>
      <p className="text-sm font-medium text-[#71797E]">Phone</p>
      <a
        href={telHref}
        className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{ color: "#2BB6C9" }}
      >
        {formatPhone(value)}
      </a>
    </div>
  );
}

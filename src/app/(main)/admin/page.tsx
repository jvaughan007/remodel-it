export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Users, UserPlus, DollarSign, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatStatus, formatCurrency, formatService } from "@/lib/format";

interface LeadRow {
  id: string;
  name: string;
  email: string;
  status: string;
  service_interest: string | null;
  created_at: string;
  deal_value: number | null;
  next_follow_up: string | null;
  archived: boolean;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch all leads
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const allLeads = (leads ?? []) as LeadRow[];
  const activeLeads = allLeads.filter((l) => !l.archived);

  // Compute stats (exclude archived)
  const totalLeads = activeLeads.length;

  // New leads this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = activeLeads.filter(
    (l) => new Date(l.created_at) >= oneWeekAgo
  ).length;

  // Pipeline value (all active leads not in terminal statuses)
  const pipelineValue = activeLeads
    .filter((l) => !["won", "lost", "completed"].includes(l.status))
    .reduce((sum, l) => sum + (l.deal_value ?? 0), 0);

  const today = new Date().toISOString().split("T")[0];

  // Follow-ups due today or overdue
  const followUpsDueToday = activeLeads.filter((l) => {
    if (!l.next_follow_up) return false;
    return l.next_follow_up <= today;
  }).length;

  // Overdue leads (past follow-up, not in terminal status)
  const overdueLeads = activeLeads.filter((l) => {
    if (!l.next_follow_up) return false;
    if (["won", "lost", "completed"].includes(l.status)) return false;
    return l.next_follow_up < today;
  });

  const recentLeads = activeLeads.slice(0, 5);

  const stats = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "#2BB6C9",
    },
    {
      label: "New This Week",
      value: newThisWeek,
      icon: UserPlus,
      color: "#34D399",
    },
    {
      label: "Pipeline Value",
      value: formatCurrency(pipelineValue),
      icon: DollarSign,
      color: "#FBBF24",
    },
    {
      label: "Follow-ups Due",
      value: followUpsDueToday,
      icon: Clock,
      color: followUpsDueToday > 0 ? "#F87171" : "#2BB6C9",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1A2F]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#71797E]">
          Overview of your leads and pipeline
        </p>
      </div>

      {/* Overdue Follow-ups Alert */}
      {overdueLeads.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-400/30 bg-amber-50 px-4 py-3">
          <AlertTriangle className="size-5 shrink-0 text-amber-500" />
          <p className="flex-1 text-sm text-amber-700">
            <span className="font-semibold">{overdueLeads.length}</span>{" "}
            lead{overdueLeads.length !== 1 ? "s" : ""} ha
            {overdueLeads.length !== 1 ? "ve" : "s"} overdue follow-ups
          </p>
          <Link
            href="/admin/leads"
            className="shrink-0 text-sm font-medium text-amber-600 transition-colors hover:text-amber-700"
          >
            View leads &rarr;
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-[#71797E]/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-sm font-medium">
                  {stat.label}
                </CardDescription>
                <div
                  className="flex size-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="size-4" style={{ color: stat.color }} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[#0A1A2F]">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Leads */}
      <Card className="border-[#71797E]/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Leads</CardTitle>
            <Link
              href="/admin/leads"
              className="text-sm font-medium transition-colors"
              style={{ color: "#2BB6C9" }}
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#71797E]">
              No leads yet. They&apos;ll appear here when someone submits the
              contact or quote form.
            </p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between rounded-lg border border-[#71797E]/10 p-3 transition-colors hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-[#0A1A2F]">{lead.name}</p>
                    <p className="text-sm text-[#71797E]">{lead.email}</p>
                    {lead.service_interest && (
                      <p className="mt-0.5 text-xs" style={{ color: "#2BB6C9" }}>
                        {formatService(lead.service_interest)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor:
                          lead.status === "new"
                            ? "rgba(43, 182, 201, 0.1)"
                            : lead.status === "won"
                              ? "rgba(52, 211, 153, 0.1)"
                              : lead.status === "lost"
                                ? "rgba(248, 113, 113, 0.1)"
                                : "rgba(113, 121, 126, 0.1)",
                        color:
                          lead.status === "new"
                            ? "#2BB6C9"
                            : lead.status === "won"
                              ? "#34D399"
                              : lead.status === "lost"
                                ? "#F87171"
                                : "#71797E",
                      }}
                    >
                      {formatStatus(lead.status)}
                    </span>
                    <p className="mt-1 text-xs text-[#71797E]">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                    {lead.deal_value ? (
                      <p className="mt-0.5 text-xs font-medium text-[#0A1A2F]">
                        {formatCurrency(lead.deal_value)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

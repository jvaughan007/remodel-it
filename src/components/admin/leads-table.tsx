"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatStatus, formatService } from "@/lib/format";
import { SERVICES, LEAD_STATUSES } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Loader2,
  Trash2,
  Archive,
  ArchiveRestore,
  Search,
  Download,
  AlertTriangle,
  SlidersHorizontal,
} from "lucide-react";

interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string;
  service_interest: string | null;
  status: string;
  deal_value: number | null;
  next_follow_up: string | null;
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

const checkboxClass =
  "size-4 cursor-pointer appearance-none rounded border border-[#71797E]/30 bg-white transition-colors checked:border-[#2BB6C9] checked:bg-[#2BB6C9]";

const selectClass =
  "flex h-9 rounded-lg border border-[#71797E]/30 bg-white px-3 py-1 text-sm text-[#0A1A2F] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BB6C9]/20 focus-visible:border-[#2BB6C9]";

const ACTIVE_STATUSES = LEAD_STATUSES.filter(
  (s) => s.value !== "archived"
).map((s) => s.value);

type Tab = "active" | "archived";

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("active");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [dialogAction, setDialogAction] = useState<"archive" | "delete" | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  const today = new Date().toISOString().split("T")[0];

  function isOverdue(lead: LeadRow): boolean {
    if (!lead.next_follow_up) return false;
    if (["won", "lost", "completed", "archived"].includes(lead.status))
      return false;
    return lead.next_follow_up < today;
  }

  // The DB uses an `archived` boolean field, but server pages pass all leads.
  // Some leads may have an `archived` property; fall back to status check for safety.
  const activeLeads = leads.filter(
    (l) => !(l as LeadRow & { archived?: boolean }).archived
  );
  const archivedLeads = leads.filter(
    (l) => !!(l as LeadRow & { archived?: boolean }).archived
  );

  const visibleLeads = useMemo(() => {
    const pool = tab === "active" ? activeLeads : archivedLeads;
    const query = search.toLowerCase().trim();

    return pool.filter((lead) => {
      if (query) {
        const haystack = [
          lead.name,
          lead.email,
          lead.company ?? "",
          lead.phone ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      if (
        tab === "active" &&
        statusFilter !== "all" &&
        lead.status !== statusFilter
      ) {
        return false;
      }

      if (serviceFilter !== "all" && lead.service_interest !== serviceFilter) {
        return false;
      }

      return true;
    });
  }, [tab, activeLeads, archivedLeads, search, statusFilter, serviceFilter]);

  const allSelected =
    visibleLeads.length > 0 && selected.size === visibleLeads.length;
  const someSelected = selected.size > 0;

  function switchTab(next: Tab) {
    setTab(next);
    setSelected(new Set());
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(visibleLeads.map((l) => l.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleBulkAction(
    action: "archive" | "unarchive" | "delete"
  ) {
    setLoading(true);

    const res = await fetch("/api/leads/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected), action }),
    });

    if (res.ok) {
      setSelected(new Set());
      setDialogAction(null);
      router.refresh();
    }

    setLoading(false);
  }

  function exportCsv() {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Service Interest",
      "Status",
      "Deal Value",
      "Next Follow-up",
      "Created Date",
    ];

    function escapeCsv(value: string): string {
      if (
        value.includes(",") ||
        value.includes('"') ||
        value.includes("\n")
      ) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }

    const rows = visibleLeads.map((lead) => [
      escapeCsv(lead.name),
      escapeCsv(lead.email),
      escapeCsv(lead.phone ?? ""),
      escapeCsv(lead.company ?? ""),
      escapeCsv(
        lead.service_interest ? formatService(lead.service_interest) : ""
      ),
      escapeCsv(formatStatus(lead.status)),
      lead.deal_value != null ? String(lead.deal_value) : "",
      lead.next_follow_up
        ? new Date(lead.next_follow_up).toLocaleDateString()
        : "",
      new Date(lead.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const exportDate = new Date().toISOString().split("T")[0];
    const a = document.createElement("a");
    a.href = url;
    a.download = `trinity-leads-export-${exportDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#71797E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company, or phone..."
            className="flex h-10 w-full rounded-lg border border-[#71797E]/30 bg-white pl-10 pr-3 py-2 text-sm text-[#0A1A2F] shadow-sm transition-colors placeholder:text-[#71797E]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BB6C9]/20 focus-visible:border-[#2BB6C9]"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 text-[#71797E] shrink-0">
            <SlidersHorizontal className="size-3.5" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Filters
            </span>
          </div>

          {tab === "active" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${selectClass} w-full sm:w-auto sm:min-w-[150px]`}
            >
              <option value="all">All Statuses</option>
              {ACTIVE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {formatStatus(s)}
                </option>
              ))}
            </select>
          )}

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className={`${selectClass} w-full sm:w-auto sm:min-w-[170px]`}
          >
            <option value="all">All Services</option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.shortTitle}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            disabled={visibleLeads.length === 0}
            className="w-full sm:ml-auto sm:w-auto"
          >
            <Download className="mr-1.5 size-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Data table */}
      <Card className="border-[#71797E]/15">
        <CardContent className="p-0">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[#71797E]/10 px-4">
            <button
              onClick={() => switchTab("active")}
              className={`relative px-3 py-2.5 text-sm font-medium transition-colors ${
                tab === "active"
                  ? "text-[#0A1A2F]"
                  : "text-[#71797E] hover:text-[#0A1A2F]"
              }`}
            >
              Active
              <Badge variant="secondary" className="ml-1.5 text-xs">
                {activeLeads.length}
              </Badge>
              {tab === "active" && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#2BB6C9]" />
              )}
            </button>
            <button
              onClick={() => switchTab("archived")}
              className={`relative px-3 py-2.5 text-sm font-medium transition-colors ${
                tab === "archived"
                  ? "text-[#0A1A2F]"
                  : "text-[#71797E] hover:text-[#0A1A2F]"
              }`}
            >
              Archived
              <Badge variant="secondary" className="ml-1.5 text-xs">
                {archivedLeads.length}
              </Badge>
              {tab === "archived" && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#2BB6C9]" />
              )}
            </button>
          </div>

          {/* Bulk actions bar */}
          {someSelected && (
            <div className="flex items-center gap-2 border-b border-[#71797E]/10 px-4 py-2 bg-[#2BB6C9]/5">
              <span className="mr-1 text-sm text-[#71797E]">
                {selected.size} selected
              </span>

              {tab === "active" ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("archive")}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    ) : (
                      <Archive className="mr-1.5 size-3.5" />
                    )}
                    Archive
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDialogAction("delete")}
                  >
                    <Trash2 className="mr-1.5 size-3.5" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("unarchive")}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    ) : (
                      <ArchiveRestore className="mr-1.5 size-3.5" />
                    )}
                    Restore
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDialogAction("delete")}
                  >
                    <Trash2 className="mr-1.5 size-3.5" />
                    Delete Permanently
                  </Button>
                </>
              )}
            </div>
          )}

          {visibleLeads.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-[#71797E]">
                {search || statusFilter !== "all" || serviceFilter !== "all"
                  ? "No leads match your filters."
                  : tab === "active"
                    ? "No active leads."
                    : "No archived leads."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className={checkboxClass}
                      aria-label="Select all leads"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleLeads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className={`group ${selected.has(lead.id) ? "bg-[#2BB6C9]/5" : ""}`}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.has(lead.id)}
                        onChange={() => toggleOne(lead.id)}
                        className={checkboxClass}
                        aria-label={`Select ${lead.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-medium text-[#0A1A2F] transition-colors group-hover:text-[#2BB6C9]"
                      >
                        {lead.name}
                      </Link>
                      {lead.company && (
                        <p className="text-xs text-[#71797E]">
                          {lead.company}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-[#71797E]">
                      {lead.email}
                    </TableCell>
                    <TableCell className="text-[#71797E]">
                      {lead.service_interest
                        ? formatService(lead.service_interest)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={STATUS_COLORS[lead.status] ?? ""}
                      >
                        {formatStatus(lead.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#71797E]">
                      {lead.deal_value
                        ? `$${lead.deal_value.toLocaleString()}`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-[#71797E]">
                      <div className="flex items-center gap-1.5">
                        {new Date(lead.created_at).toLocaleDateString()}
                        {isOverdue(lead) && (
                          <span title="Overdue follow-up">
                            <AlertTriangle className="size-3.5 text-amber-500" />
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirm delete dialog */}
      <AlertDialog
        open={!!dialogAction}
        onOpenChange={(open) => !open && setDialogAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Permanently Delete {selected.size} Lead
              {selected.size !== 1 ? "s" : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selected.size} lead
              {selected.size !== 1 ? "s" : ""} and all associated activity
              history. This cannot be undone. Consider archiving instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => handleBulkAction("delete")}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {loading ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

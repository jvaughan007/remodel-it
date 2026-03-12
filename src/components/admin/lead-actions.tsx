"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatStatus } from "@/lib/format";
import { LEAD_STATUSES } from "@/lib/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import { Loader2, Trash2, Archive, ArchiveRestore } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string;
  notes: string | null;
  deal_value: number | null;
  next_follow_up: string | null;
  archived?: boolean;
}

export function LeadActions({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [contactName, setContactName] = useState(lead.name);
  const [phone, setPhone] = useState(lead.phone ?? "");
  const [company, setCompany] = useState(lead.company ?? "");
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [dealValue, setDealValue] = useState(
    lead.deal_value?.toString() ?? ""
  );
  const [followUp, setFollowUp] = useState(lead.next_follow_up ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notesError, setNotesError] = useState("");
  const [followUpError, setFollowUpError] = useState("");

  const supabase = createClient();

  async function handleSave() {
    let hasError = false;

    // Validate: if status changed, notes must not be empty
    if (status !== lead.status && !notes.trim()) {
      setNotesError("Please add a note explaining this status change");
      hasError = true;
    }

    // Validate: if status changed and not terminal, follow-up date required
    if (
      status !== lead.status &&
      !["lost", "completed", "won"].includes(status) &&
      !followUp
    ) {
      setFollowUpError("Please set a next follow-up date");
      hasError = true;
    }

    if (hasError) return;

    setSaving(true);

    const updates: Record<string, unknown> = {
      name: contactName.trim(),
      phone: phone.trim() || null,
      company: company.trim() || null,
      status,
      notes: notes || null,
      deal_value: dealValue ? parseFloat(dealValue) : null,
      next_follow_up: followUp || null,
    };

    // If status changed, log an activity
    if (status !== lead.status) {
      await supabase.from("activities").insert({
        lead_id: lead.id,
        type: "status_change",
        description: `Status changed from "${formatStatus(lead.status)}" to "${formatStatus(status)}"`,
      });
    }

    await supabase.from("leads").update(updates).eq("id", lead.id);

    setSaving(false);
    router.refresh();
  }

  async function handleArchiveToggle() {
    setArchiving(true);
    const action = lead.archived ? "unarchive" : "archive";

    const res = await fetch("/api/leads/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [lead.id], action }),
    });

    if (res.ok) {
      router.refresh();
      if (action === "archive") {
        router.push("/admin/leads");
      }
    }
    setArchiving(false);
  }

  async function handleDelete() {
    setDeleting(true);

    const res = await fetch(`/api/leads/${lead.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/admin/leads");
      router.refresh();
    } else {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  }

  return (
    <Card className="border-[#71797E]/15">
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2">
          <Label htmlFor="contact_name">Contact Name</Label>
          <Input
            id="contact_name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Contact name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
          />
        </div>

        <Separator className="my-2" />

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-[#71797E]/30 bg-white px-3 py-1 text-sm text-[#0A1A2F] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BB6C9]/20 focus-visible:border-[#2BB6C9]"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deal_value">Deal Value ($)</Label>
          <Input
            id="deal_value"
            type="number"
            placeholder="0.00"
            value={dealValue}
            onChange={(e) => setDealValue(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="follow_up">Next Follow-up</Label>
          <Input
            id="follow_up"
            type="date"
            value={followUp}
            onChange={(e) => {
              setFollowUp(e.target.value);
              if (followUpError) setFollowUpError("");
            }}
            className={
              followUpError
                ? "border-red-500 focus-visible:ring-red-500/20"
                : ""
            }
          />
          {followUpError && (
            <p className="text-sm text-red-500">{followUpError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add notes about this lead..."
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              if (notesError) setNotesError("");
            }}
            rows={4}
            className={
              notesError
                ? "border-red-500 focus-visible:ring-red-500/20"
                : ""
            }
          />
          {notesError && (
            <p className="text-sm text-red-500">{notesError}</p>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full"
        >
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>

        <Button
          variant="outline"
          onClick={handleArchiveToggle}
          disabled={archiving}
          className="w-full"
        >
          {archiving ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : lead.archived ? (
            <ArchiveRestore className="mr-2 size-4" />
          ) : (
            <Archive className="mr-2 size-4" />
          )}
          {lead.archived ? "Restore from Archive" : "Archive Lead"}
        </Button>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-2 size-4" />
          Delete Lead
        </Button>

        <AlertDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Lead</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this lead and all associated
                activity history. This cannot be undone. Consider archiving
                instead.
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
      </CardContent>
    </Card>
  );
}

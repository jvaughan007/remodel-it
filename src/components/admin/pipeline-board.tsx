"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { createClient } from "@/lib/supabase/client";
import { formatStatus, formatService } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LeadRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service_interest: string | null;
  status: string;
  deal_value: number | null;
  created_at: string;
}

interface PendingMove {
  leadId: string;
  leadName: string;
  oldStatus: string;
  newStatus: string;
}

const PIPELINE_STAGES = [
  { key: "new", label: "New", color: "text-[#2BB6C9]" },
  { key: "contacted", label: "Contacted", color: "text-blue-500" },
  {
    key: "estimate_scheduled",
    label: "Estimate Scheduled",
    color: "text-indigo-500",
  },
  { key: "estimate_done", label: "Estimate Done", color: "text-violet-500" },
  { key: "proposal_sent", label: "Proposal Sent", color: "text-purple-500" },
  { key: "negotiating", label: "Negotiating", color: "text-amber-500" },
  { key: "won", label: "Won", color: "text-green-500" },
] as const;

export function PipelineBoard({
  initialLeads,
}: {
  initialLeads: LeadRow[];
}) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [reason, setReason] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [followUpError, setFollowUpError] = useState("");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const grouped = PIPELINE_STAGES.map((stage) => {
    const stageLeads = leads.filter((l) => l.status === stage.key);
    return {
      ...stage,
      leads: stageLeads,
      total: stageLeads.reduce((sum, l) => sum + (l.deal_value ?? 0), 0),
    };
  });

  function onDragEnd(result: DropResult) {
    const { draggableId, destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;
    const oldStatus = source.droppableId;
    const lead = leads.find((l) => l.id === draggableId);

    setPendingMove({
      leadId: draggableId,
      leadName: lead?.name ?? "Lead",
      oldStatus,
      newStatus,
    });
    setReason("");
    setFollowUp("");
    setReasonError("");
    setFollowUpError("");
  }

  async function confirmMove() {
    if (!pendingMove) return;

    let hasError = false;

    if (!reason.trim()) {
      setReasonError("Please provide a reason for this status change");
      hasError = true;
    }

    // Require follow-up date for all statuses except "lost" and "won"
    if (
      pendingMove.newStatus !== "lost" &&
      pendingMove.newStatus !== "won" &&
      !followUp
    ) {
      setFollowUpError("Please set a next follow-up date");
      hasError = true;
    }

    if (hasError) return;

    setSaving(true);

    const updates: Record<string, unknown> = {
      status: pendingMove.newStatus,
      notes: reason.trim(),
    };
    if (followUp) {
      updates.next_follow_up = followUp;
    }

    const { error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", pendingMove.leadId);

    if (error) {
      setSaving(false);
      return;
    }

    // Log activity with the reason
    await supabase.from("activities").insert({
      lead_id: pendingMove.leadId,
      type: "status_change",
      description: `Status changed from "${formatStatus(pendingMove.oldStatus)}" to "${formatStatus(pendingMove.newStatus)}": ${reason.trim()}`,
    });

    // Update local state
    setLeads((prev) =>
      prev.map((l) =>
        l.id === pendingMove.leadId
          ? { ...l, status: pendingMove.newStatus }
          : l
      )
    );

    setSaving(false);
    setPendingMove(null);
    router.refresh();
  }

  function cancelMove() {
    setPendingMove(null);
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 lg:grid-cols-7">
          {grouped.map((stage) => (
            <div key={stage.key} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${stage.color}`}
                  >
                    {stage.label}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {stage.leads.length}
                  </Badge>
                </div>
              </div>

              {stage.total > 0 && (
                <p className="px-1 text-xs text-[#71797E]">
                  ${stage.total.toLocaleString()}
                </p>
              )}

              {/* Droppable Column */}
              <Droppable droppableId={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[80px] space-y-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver
                        ? "bg-[#2BB6C9]/5 ring-1 ring-[#2BB6C9]/20"
                        : ""
                    }`}
                  >
                    {stage.leads.map((lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${
                              snapshot.isDragging
                                ? "opacity-90 shadow-lg"
                                : ""
                            }`}
                          >
                            <Link
                              href={`/admin/leads/${lead.id}`}
                              className="block"
                              onClick={(e) => {
                                if (snapshot.isDragging)
                                  e.preventDefault();
                              }}
                            >
                              <Card
                                className={`border-[#71797E]/10 transition-colors hover:border-[#71797E]/25 hover:shadow-sm ${
                                  snapshot.isDragging
                                    ? "border-[#2BB6C9]/30 shadow-md"
                                    : ""
                                }`}
                              >
                                <CardContent className="p-3">
                                  <p className="text-sm font-medium text-[#0A1A2F]">
                                    {lead.name}
                                  </p>
                                  {lead.company && (
                                    <p className="text-xs text-[#71797E]">
                                      {lead.company}
                                    </p>
                                  )}
                                  {lead.service_interest && (
                                    <p className="mt-1 text-xs text-[#2BB6C9]/80">
                                      {formatService(
                                        lead.service_interest
                                      )}
                                    </p>
                                  )}
                                  {lead.deal_value ? (
                                    <p className="mt-1 text-xs font-medium text-[#2BB6C9]">
                                      $
                                      {lead.deal_value.toLocaleString()}
                                    </p>
                                  ) : null}
                                </CardContent>
                              </Card>
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {stage.leads.length === 0 &&
                      !snapshot.isDraggingOver && (
                        <div className="rounded-lg border border-dashed border-[#71797E]/20 px-3 py-6 text-center">
                          <p className="text-xs text-[#71797E]/50">
                            Empty
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={!!pendingMove}
        onOpenChange={(open) => !open && cancelMove()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Move {pendingMove?.leadName} to{" "}
              {pendingMove ? formatStatus(pendingMove.newStatus) : ""}
            </DialogTitle>
            <DialogDescription>
              {formatStatus(pendingMove?.oldStatus ?? "")} &rarr;{" "}
              {formatStatus(pendingMove?.newStatus ?? "")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="move-reason">
                Reason for status change{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="move-reason"
                placeholder="e.g. Completed the site walk-through, they want a kitchen estimate..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (reasonError) setReasonError("");
                }}
                rows={3}
                className={
                  reasonError
                    ? "border-red-500 focus-visible:ring-red-500/20"
                    : ""
                }
              />
              {reasonError && (
                <p className="text-sm text-red-500">{reasonError}</p>
              )}
            </div>

            {pendingMove?.newStatus !== "lost" &&
              pendingMove?.newStatus !== "won" && (
                <div className="space-y-2">
                  <Label htmlFor="move-followup">
                    Next follow-up date{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="move-followup"
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
                    <p className="text-sm text-red-500">
                      {followUpError}
                    </p>
                  )}
                </div>
              )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelMove}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={confirmMove} disabled={saving}>
              {saving && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              {saving ? "Saving..." : "Confirm Move"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

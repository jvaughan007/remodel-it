import { createClient } from "@/lib/supabase/server";
import { PipelineBoard } from "@/components/admin/pipeline-board";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  const allLeads = (leads ?? []) as {
    id: string;
    name: string;
    email: string;
    company: string | null;
    service_interest: string | null;
    status: string;
    deal_value: number | null;
    created_at: string;
  }[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1A2F]">Pipeline</h1>
        <p className="mt-1 text-sm text-[#71797E]">
          Drag leads between stages to update their status
        </p>
      </div>

      <PipelineBoard initialLeads={allLeads} />
    </div>
  );
}

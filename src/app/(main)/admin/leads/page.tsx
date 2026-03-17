import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { LeadsTable } from "@/components/admin/leads-table";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const allLeads = (leads ?? []) as {
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
    archived: boolean;
  }[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1A2F]">Leads</h1>
          <p className="mt-1 text-sm text-[#71797E]">
            {allLeads.length} total lead{allLeads.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {allLeads.length === 0 ? (
        <Card className="border-[#71797E]/10">
          <CardContent className="px-6 py-16 text-center">
            <p className="text-[#71797E]">
              No leads yet. They&apos;ll appear here when someone submits the
              contact or quote form.
            </p>
          </CardContent>
        </Card>
      ) : (
        <LeadsTable leads={allLeads} />
      )}
    </div>
  );
}

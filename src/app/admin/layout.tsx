import Link from "next/link";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/tr-admin-gate");
  }

  // Double-check: even if authenticated, must be on the allowlist
  if (
    ADMIN_EMAILS.length > 0 &&
    (!user.email || !ADMIN_EMAILS.includes(user.email.toLowerCase()))
  ) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Top Bar */}
      <header
        className="sticky top-0 z-50 border-b shadow-lg"
        style={{
          backgroundColor: "rgba(10, 26, 47, 0.97)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-lg font-bold tracking-tight text-white"
            >
              <span style={{ color: "#2BB6C9" }}>Trinity</span>{" "}
              <span className="text-white/80">CRM</span>
            </Link>
            <AdminNav />
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-white/50 sm:inline">
              {user.email}
            </span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-sm text-white/40 transition-colors hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

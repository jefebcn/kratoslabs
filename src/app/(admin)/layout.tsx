import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured, isAdminUser } from "@/lib/supabase/config";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Difesa lato server (oltre al middleware): solo admin autenticati.
  if (isSupabaseConfigured) {
    const user = await getCurrentUser();
    if (!user) redirect("/login?next=/admin");
    if (!isAdminUser(user)) redirect("/");
  }

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

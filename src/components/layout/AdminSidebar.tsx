import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { AdminNav } from "@/components/admin/AdminNav";

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <AdminNav />
      </div>
      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-base px-3 py-2 text-sm text-muted transition-colors hover:text-text"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Torna allo store
        </Link>
      </div>
    </aside>
  );
}

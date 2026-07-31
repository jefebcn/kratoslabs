"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Images,
  LayoutDashboard,
  Package,
  Settings,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ADMIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "/admin": LayoutDashboard,
  "/admin/products": Package,
  "/admin/images": Images,
  "/admin/categories": Tags,
  "/admin/orders": ClipboardList,
  "/admin/users": Users,
  "/admin/settings": Settings,
};

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Amministrazione">
      {ADMIN_NAV.map((item) => {
        const Icon = ICONS[item.href] ?? LayoutDashboard;
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-base px-3 py-2 text-sm transition-colors",
              active
                ? "bg-surface-2 text-accent"
                : "text-muted hover:bg-surface-2 hover:text-text",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

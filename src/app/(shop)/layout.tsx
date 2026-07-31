import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/Topbar";
import { AccountBar } from "@/components/layout/AccountBar";
import { Header } from "@/components/layout/Header";
import { CategoryNav } from "@/components/layout/CategoryNav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getSiteSettings } from "@/features/settings";
import { listCategories } from "@/features/categories";
import { ANNOUNCEMENTS } from "@/lib/constants";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories, tTop] = await Promise.all([
    getSiteSettings(),
    listCategories(),
    getTranslations("topbar"),
  ]);

  // Annunci: se l'admin non li ha personalizzati (== default IT), mostra la
  // versione tradotta; altrimenti rispetta il testo custom impostato.
  const defaults = [...ANNOUNCEMENTS];
  const isDefault =
    settings.announcements.length === defaults.length &&
    settings.announcements.every((a, i) => a === defaults[i]);
  const announcements = isDefault
    ? (tTop.raw("announcements") as string[])
    : settings.announcements;

  return (
    <div className="flex min-h-dvh flex-col">
      <Topbar announcements={announcements} />
      <AccountBar />
      <Header categories={categories} />
      <CategoryNav categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

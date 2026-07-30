import { Topbar } from "@/components/layout/Topbar";
import { AccountBar } from "@/components/layout/AccountBar";
import { Header } from "@/components/layout/Header";
import { CategoryNav } from "@/components/layout/CategoryNav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getSiteSettings } from "@/features/settings";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <div className="flex min-h-dvh flex-col">
      <Topbar announcements={settings.announcements} />
      <AccountBar />
      <Header />
      <CategoryNav />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

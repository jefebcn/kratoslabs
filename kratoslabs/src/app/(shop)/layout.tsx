export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Topbar, Header e MegaMenu arrivano al task 3. */}
      <main className="flex-1">{children}</main>
      {/* Footer arriva al task 3. */}
    </div>
  );
}

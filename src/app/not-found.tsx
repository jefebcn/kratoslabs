import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6">
      <p className="num text-sm text-muted">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Pagina non trovata</h1>
      <p className="mt-2 text-muted">
        Il link è rotto o la pagina è stata spostata.
      </p>
      <Link
        href="/"
        className="mt-6 self-start rounded-[4px] border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent"
      >
        Torna alla home
      </Link>
    </div>
  );
}

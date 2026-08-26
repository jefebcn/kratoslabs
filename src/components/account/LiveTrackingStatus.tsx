"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

interface Info {
  status: string;
  description?: string;
  location?: string;
  timeIso?: string;
}

/** Etichetta + colore per lo stato normalizzato 17TRACK. */
const STATUS_META: Record<string, { label: string; color: string }> = {
  InfoReceived: { label: "Informazioni ricevute", color: "text-sky-600" },
  InTransit: { label: "In transito", color: "text-blue-600" },
  PickUp: { label: "Disponibile al ritiro", color: "text-indigo-600" },
  AvailableForPickup: {
    label: "Disponibile al ritiro",
    color: "text-indigo-600",
  },
  OutForDelivery: { label: "In consegna", color: "text-amber-600" },
  Delivered: { label: "Consegnato", color: "text-emerald-600" },
  Exception: { label: "Problema di consegna", color: "text-rose-600" },
  Undelivered: { label: "Problema di consegna", color: "text-rose-600" },
  DeliveryFailure: { label: "Problema di consegna", color: "text-rose-600" },
  Expired: { label: "Scaduto", color: "text-muted" },
};

export function LiveTrackingStatus({
  trackingId,
  labels,
}: {
  trackingId: string;
  labels: { refresh: string; checking: string; noInfo: string };
}) {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);
  const [done, setDone] = useState(false);

  async function check() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/track?num=${encodeURIComponent(trackingId)}`,
      );
      setInfo(res.ok ? ((await res.json()) as Info) : null);
    } catch {
      setInfo(null);
    }
    setLoading(false);
    setDone(true);
  }

  const meta = info?.status ? STATUS_META[info.status] : undefined;
  const hasUpdate =
    info && info.status && info.status !== "unknown" && info.status !== "NotFound";

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={check}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline disabled:opacity-60"
      >
        <RefreshCw
          className={`size-3 ${loading ? "animate-spin" : ""}`}
          aria-hidden
        />
        {loading ? labels.checking : labels.refresh}
      </button>

      {done && !loading && (
        <>
          {hasUpdate ? (
            <p className="mt-1.5 text-xs">
              <span className={`font-semibold ${meta?.color ?? "text-text"}`}>
                {meta?.label ?? info!.status}
              </span>
              {info!.description && (
                <span className="text-muted"> — {info!.description}</span>
              )}
              {info!.location && (
                <span className="text-muted"> · {info!.location}</span>
              )}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-muted">{labels.noInfo}</p>
          )}
        </>
      )}
    </div>
  );
}

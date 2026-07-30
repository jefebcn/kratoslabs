"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ORDER_STATUS_META } from "@/lib/constants";
import type { OrderStatus } from "@/types";

/**
 * Selettore di stato dell'ordine. Per ora aggiorna solo lo stato locale;
 * il collegamento alla Server Action `updateOrderStatus` arriva con il DB.
 */
export function OrderStatusSelect({
  initial,
  trackingId,
}: {
  initial: OrderStatus;
  trackingId?: string;
}) {
  const [status, setStatus] = useState<OrderStatus>(initial);

  return (
    <div className="flex flex-col gap-2">
      <StatusBadge status={status} />
      <Select
        aria-label="Cambia stato ordine"
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="h-8 w-44 text-xs"
      >
        {ORDER_STATUS_META.map((m) => (
          <option key={m.status} value={m.status}>
            {m.label}
          </option>
        ))}
      </Select>
      {status === "shipped" && (
        <p className="num text-xs text-muted">
          Tracking: {trackingId ?? "da assegnare"}
        </p>
      )}
    </div>
  );
}

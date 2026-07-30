"use client";

import { useState } from "react";
import { BadgeCheck, Check } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { updateOrderStatus, confirmPayment } from "@/features/orders/actions";
import { ORDER_STATUS_META } from "@/lib/constants";
import type { OrderStatus } from "@/types";
import type { PaymentStatus } from "@/features/orders/queries";

export function OrderControls({
  orderId,
  status,
  trackingId,
  paymentStatus,
}: {
  orderId: string;
  status: OrderStatus;
  trackingId?: string;
  paymentStatus: PaymentStatus;
}) {
  const [st, setSt] = useState<OrderStatus>(status);

  return (
    <div className="flex flex-col gap-2">
      <StatusBadge status={st} />

      <form action={updateOrderStatus} className="flex flex-col gap-2">
        <input type="hidden" name="orderId" value={orderId} />
        <Select
          name="status"
          aria-label="Cambia stato ordine"
          value={st}
          onChange={(e) => {
            setSt(e.target.value as OrderStatus);
            e.currentTarget.form?.requestSubmit();
          }}
          className="h-8 w-44 text-xs"
        >
          {ORDER_STATUS_META.map((m) => (
            <option key={m.status} value={m.status}>
              {m.label}
            </option>
          ))}
        </Select>
        {st === "shipped" && (
          <div className="flex items-center gap-1.5">
            <Input
              name="trackingId"
              defaultValue={trackingId}
              placeholder="Tracking"
              className="h-8 w-32 text-xs"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-base border border-border px-2 py-1.5 text-xs font-medium transition-colors hover:text-accent"
            >
              <Check className="size-3.5" aria-hidden />
              Salva
            </button>
          </div>
        )}
      </form>

      {paymentStatus === "paid" ? (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
          <BadgeCheck className="size-3.5" aria-hidden />
          Pagamento confermato
        </span>
      ) : (
        <form action={confirmPayment}>
          <input type="hidden" name="orderId" value={orderId} />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-base border border-accent/40 px-2 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent-soft"
          >
            <BadgeCheck className="size-3.5" aria-hidden />
            Conferma pagamento
          </button>
        </form>
      )}
    </div>
  );
}

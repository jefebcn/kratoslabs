import type { ProductSpecs } from "@/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="num text-sm font-medium">{value}</dd>
    </div>
  );
}

export function SpecsTable({ specs }: { specs: ProductSpecs }) {
  const totalActive = specs.activePerServingG * specs.servingsPerContainer;

  return (
    <dl>
      <Row label="Peso netto" value={`${specs.netWeightG} g`} />
      <Row label="Porzione" value={`${specs.servingSizeG} g`} />
      <Row
        label="Porzioni per confezione"
        value={`${specs.servingsPerContainer}`}
      />
      <Row
        label={`${specs.activeName} per porzione`}
        value={`${specs.activePerServingG} g`}
      />
      <Row
        label={`${specs.activeName} totali`}
        value={`${Number(totalActive.toFixed(1))} g`}
      />
    </dl>
  );
}

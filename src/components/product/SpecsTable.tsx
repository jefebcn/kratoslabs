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
      {specs.activeName && (
        <Row label="Principio attivo" value={specs.activeName} />
      )}
      {specs.concentration && (
        <Row label="Concentrazione" value={specs.concentration} />
      )}
      {specs.productClass && (
        <Row label="Classe" value={specs.productClass} />
      )}
      {specs.form && <Row label="Forma" value={specs.form} />}
      {specs.packaging && <Row label="Confezione" value={specs.packaging} />}
      {specs.manufacturer && (
        <Row label="Produttore" value={specs.manufacturer} />
      )}
      {specs.netWeightG > 0 && (
        <Row label="Peso netto" value={`${specs.netWeightG} g`} />
      )}
      {specs.servingSizeG > 0 && (
        <Row label="Porzione" value={`${specs.servingSizeG} g`} />
      )}
      {specs.servingsPerContainer > 0 && (
        <Row
          label="Porzioni per confezione"
          value={`${specs.servingsPerContainer}`}
        />
      )}
      {specs.activePerServingG > 0 && (
        <Row
          label={`${specs.activeName} per porzione`}
          value={`${specs.activePerServingG} g`}
        />
      )}
      {totalActive > 0 && (
        <Row
          label={`${specs.activeName} totali`}
          value={`${Number(totalActive.toFixed(1))} g`}
        />
      )}
    </dl>
  );
}

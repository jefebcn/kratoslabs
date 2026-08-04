import { getTranslations } from "next-intl/server";
import type { ProductSpecs } from "@/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="num text-sm font-medium">{value}</dd>
    </div>
  );
}

export async function SpecsTable({ specs }: { specs: ProductSpecs }) {
  const t = await getTranslations("specs");
  const totalActive = specs.activePerServingG * specs.servingsPerContainer;

  return (
    <dl>
      {specs.activeName && <Row label={t("active")} value={specs.activeName} />}
      {specs.concentration && (
        <Row label={t("concentration")} value={specs.concentration} />
      )}
      {specs.productClass && (
        <Row label={t("class")} value={specs.productClass} />
      )}
      {specs.form && <Row label={t("form")} value={specs.form} />}
      {specs.packaging && <Row label={t("packaging")} value={specs.packaging} />}
      {specs.manufacturer && (
        <Row label={t("manufacturer")} value={specs.manufacturer} />
      )}
      {specs.netWeightG > 0 && (
        <Row label={t("netWeight")} value={`${specs.netWeightG} g`} />
      )}
      {specs.servingSizeG > 0 && (
        <Row label={t("serving")} value={`${specs.servingSizeG} g`} />
      )}
      {specs.servingsPerContainer > 0 && (
        <Row
          label={t("servingsPerContainer")}
          value={`${specs.servingsPerContainer}`}
        />
      )}
      {specs.activePerServingG > 0 && (
        <Row
          label={t("perServing", { active: specs.activeName })}
          value={`${specs.activePerServingG} g`}
        />
      )}
      {totalActive > 0 && (
        <Row
          label={t("totalActive", { active: specs.activeName })}
          value={`${Number(totalActive.toFixed(1))} g`}
        />
      )}
    </dl>
  );
}

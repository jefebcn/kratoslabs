import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function StockBadge({ stock }: { stock: number }) {
  const t = useTranslations("product");
  if (stock <= 0) return <Badge variant="danger">{t("soldOut")}</Badge>;
  if (stock < 15)
    return <Badge variant="outline">{t("lastFew", { count: stock })}</Badge>;
  return <Badge variant="success">{t("inStock")}</Badge>;
}

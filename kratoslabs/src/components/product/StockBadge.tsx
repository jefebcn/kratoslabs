import { Badge } from "@/components/ui/badge";

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge variant="danger">Esaurito</Badge>;
  if (stock < 15) return <Badge variant="outline">Ultimi {stock}</Badge>;
  return <Badge variant="success">Disponibile</Badge>;
}

import { Card } from "@/components/ui/card";
import { SALES_SERIES } from "@/lib/constants";

const W = 640;
const H = 240;
const PAD = { l: 16, r: 16, t: 16, b: 32 };
const GAP = 18;

function shortEuro(cents: number) {
  return `€${Math.round(cents / 100000)}k`;
}

export function SalesChart() {
  const data = SALES_SERIES;
  const max = Math.max(...data.map((d) => d.revenueCents));
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const barW = (innerW - GAP * (data.length - 1)) / data.length;

  return (
    <Card className="p-5">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm font-medium">Ricavi mensili</p>
          <p className="text-xs text-muted">Ultimi 6 mesi</p>
        </div>
        <p className="num text-xs text-muted">picco {shortEuro(max)}</p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 h-auto w-full"
        role="img"
        aria-label="Grafico a barre dei ricavi degli ultimi sei mesi"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = PAD.t + innerH * (1 - t);
          return (
            <line
              key={t}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y}
              y2={y}
              stroke="#23262C"
              strokeWidth="1"
            />
          );
        })}

        {data.map((d, i) => {
          const h = (d.revenueCents / max) * innerH;
          const x = PAD.l + i * (barW + GAP);
          const y = PAD.t + innerH - h;
          const isLast = i === data.length - 1;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="2"
                fill="#DC2626"
                opacity={isLast ? 1 : 0.5}
              />
              <text
                x={x + barW / 2}
                y={H - 12}
                textAnchor="middle"
                fill="#8A9099"
                fontSize="11"
                fontFamily="monospace"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, ImageIcon, TrendingUp, Layers } from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

/* ───────────────── BASE ───────────────── */
const WORK_HOURS = 8;
const REVIEW_HOUR = 1;

const TEAM_PER_HOUR = 80;
const TEAM_SIZE = 4;

const MANUAL_DAILY = TEAM_PER_HOUR * WORK_HOURS; // 640

/* IA */
const AI_OVERNIGHT = 2000;

/* REAL */
const MANUAL_WITH_REVIEW = TEAM_PER_HOUR * (WORK_HOURS - REVIEW_HOUR); // 560
const TOTAL_DAY = MANUAL_WITH_REVIEW + AI_OVERNIGHT; // 2560

/* 🔥 MÉTRICAS POR ANALISTA */
const BEFORE_PER_ANALYST_HOUR = Math.round(TEAM_PER_HOUR / TEAM_SIZE); // 20
const BEFORE_PER_ANALYST_DAY = Math.round(MANUAL_DAILY / TEAM_SIZE); // 160

const AFTER_PER_ANALYST_DAY = Math.round(TOTAL_DAY / TEAM_SIZE); // 640
const AFTER_PER_ANALYST_HOUR = Math.round(AFTER_PER_ANALYST_DAY / WORK_HOURS); // 80

/* VOLUMES */
const SUPPLIER_VOLUMES = [600, 800, 1000, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3200, 3500];

const PURPLE = "#7F77DD";
const GREEN = "#1D9E75";

/* KPIs PADRÃO */
const kpis = [
  {
    icon: ImageIcon,
    label: "Imgs / hora / analista",
    value: `${BEFORE_PER_ANALYST_HOUR} → ${AFTER_PER_ANALYST_HOUR}`,
    sub: "Produtividade individual",
    badge: "Antes vs depois",
  },
  {
    icon: Clock,
    label: "Imgs / dia / analista",
    value: `${BEFORE_PER_ANALYST_DAY} → ${AFTER_PER_ANALYST_DAY}`,
    sub: "Capacidade diária individual",
    badge: "Com IA",
  },
  {
    icon: Layers,
    label: "Volume adicional",
    value: `+${AI_OVERNIGHT}`,
    sub: "Gerado fora do expediente",
    badge: "Overnight",
  },
  {
    icon: TrendingUp,
    label: "Produção total / dia",
    value: `${MANUAL_DAILY} → ${TOTAL_DAY}`,
    sub: "Time + automação",
    badge: "Escala",
  },
];

/* ───────────────── CHART ───────────────── */
function useChartJs(cb: () => void) {
  useEffect(() => {
    if ((window as any).Chart) return cb();
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    s.onload = cb;
    document.head.appendChild(s);
  }, []);
}

function theme() {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return {
    grid: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
    tick: dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)",
  };
}

const CoverageCompareChart = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const inst = useRef<any>(null);

  useChartJs(() => {
    if (!ref.current) return;
    inst.current?.destroy();

    const { grid, tick } = theme();

    // 🔥 sempre por analista (igual manual)
    const daysManual = SUPPLIER_VOLUMES.map((v) =>
      Math.round((v / BEFORE_PER_ANALYST_DAY) * 10) / 10
    );

    const daysAI = SUPPLIER_VOLUMES.map((v) =>
      Math.round((v / AFTER_PER_ANALYST_DAY) * 10) / 10
    );

    inst.current = new (window as any).Chart(ref.current, {
      type: "line",
      data: {
        labels: SUPPLIER_VOLUMES.map((v) => v.toLocaleString("pt-BR")),
        datasets: [
          {
            label: "Manual",
            data: daysManual,
            borderColor: "#E24B4A",
            backgroundColor: "rgba(226,75,74,0.07)",
            pointBackgroundColor: "#E24B4A",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
          {
            label: "Manual + IA",
            data: daysAI,
            borderColor: GREEN,
            backgroundColor: "rgba(29,158,117,0.10)",
            pointBackgroundColor: GREEN,
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
          {
            label: "Limite crítico (5d)",
            data: SUPPLIER_VOLUMES.map(() => 5),
            borderColor: "#E24B4A",
            borderDash: [5, 4],
            borderWidth: 1.5,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 24, bottom: 30 } },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: grid },
            ticks: { color: "#6B7280", autoSkip: false },
          },
          y: {
            grid: { color: grid },
            ticks: {
              color: tick,
              callback: (v: number) => v + " dias",
            },
            beginAtZero: true,
          },
        },
      },

      // 🔥 labels visíveis (igual manual)
      plugins: [
        {
          id: "pointLabels",
          afterDatasetsDraw(chart: any) {
            const { ctx } = chart;

            [0, 1].forEach((datasetIdx) => {
              const dataset = chart.data.datasets[datasetIdx];
              const meta = chart.getDatasetMeta(datasetIdx);
              const color = datasetIdx === 0 ? "#E24B4A" : GREEN;

              dataset.data.forEach((value: number, i: number) => {
                const point = meta.data[i];
                const x = point.x;
                const y = point.y;

                ctx.save();
                ctx.font = "bold 10px sans-serif";
                ctx.textAlign = "center";

                const text = value + "d";
                const metrics = ctx.measureText(text);
                const pw = metrics.width + 8;
                const ph = 14;

                const px = x - pw / 2;
                const py = y - 12 - ph;

                ctx.fillStyle =
                  datasetIdx === 0
                    ? "rgba(226,75,74,0.15)"
                    : "rgba(29,158,117,0.15)";

                ctx.beginPath();
                ctx.roundRect(px, py, pw, ph, 4);
                ctx.fill();

                ctx.fillStyle = color;
                ctx.fillText(text, x, y - 10);

                ctx.restore();
              });
            });
          },
        },
      ],
    });
  });

  useEffect(() => () => inst.current?.destroy(), []);
  return <canvas ref={ref} />;
};

/* ───────────────── COMPONENTE ───────────────── */
const PixelForgeProductivitySection = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <SectionBackground />

      <div className="relative z-10 w-full container mx-auto px-6 py-8 space-y-5">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Produtividade do time com <span className="text-gradient-forge">Pixel Forge</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Produção manual durante o dia + apoio automatizado fora do expediente
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <k.icon size={14} style={{ color: PURPLE }} />
                <p className="text-xs text-muted-foreground uppercase">
                  {k.label}
                </p>
              </div>

              <p className="text-2xl font-semibold">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.sub}</p>

              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 w-fit">
                {k.badge}
              </span>
            </div>
          ))}
        </div>

        {/* GRÁFICO */}
        <div className="rounded-2xl border bg-card/60 p-4">
          <p className="text-sm font-semibold">
            Cobertura por volume de fornecedor
          </p>

          <div className="flex gap-4 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-red-500 rounded-sm" />
              Manual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2" style={{ background: GREEN }} />
              Manual + IA
            </span>
          </div>

          <div style={{ height: 260 }}>
            <CoverageCompareChart />
          </div>
        </div>

      </div>
    </section>
  );
};

export default PixelForgeProductivitySection;
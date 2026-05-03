import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ImageIcon, TrendingDown, Clock, Users } from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

const TEAM_MEMBERS = [
  { name: "Thiago",  hourly: 20, color: "#7F77DD" },
  { name: "Raphael", hourly: 20, color: "#1D9E75" },
  { name: "Rodrigo", hourly: 20, color: "#BA7517" },
  { name: "Matheus", hourly: 20, color: "#378ADD" },
];

const WORK_HOURS = 8;

const HOURLY_TOTAL = TEAM_MEMBERS.reduce((s, m) => s + m.hourly, 0);
const DAILY_TOTAL = HOURLY_TOTAL * WORK_HOURS;

// 🔥 NOVO FOCO POR ANALISTA
const AVG_PER_ANALYST_HOUR = Math.round(HOURLY_TOTAL / TEAM_MEMBERS.length);
const AVG_PER_ANALYST_DAY = Math.round(DAILY_TOTAL / TEAM_MEMBERS.length);

// 🔥 gráfico continua baseado nisso (correto)
const DAILY_AVG_ANALYST = AVG_PER_ANALYST_DAY;

const SUPPLIER_VOLUMES = [600, 800, 1000, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3200, 3500];

const PURPLE = "#7F77DD";

const kpis = [
  {
    icon: ImageIcon,
    label: "Imgs / hora / analista",
    value: `${AVG_PER_ANALYST_HOUR}`,
    sub: "Produção média individual",
    badge: "Eficiência",
  },
  {
    icon: TrendingDown,
    label: "Imgs / dia / analista",
    value: `${AVG_PER_ANALYST_DAY}`,
    sub: `${AVG_PER_ANALYST_HOUR}/h × ${WORK_HOURS}h`,
    badge: "Capacidade individual",
  },
  {
    icon: Users,
    label: "Total equipe / hora",
    value: `${HOURLY_TOTAL}`,
    sub: "Soma dos 4 analistas",
    badge: "Capacidade conjunta",
  },
  {
    icon: Clock,
    label: "Total equipe / dia",
    value: `${DAILY_TOTAL}`,
    sub: `${HOURLY_TOTAL}/h × ${WORK_HOURS}h`,
    badge: "Produção diária",
  },
];

function useChartJs(cb: () => void) {
  useEffect(() => {
    if ((window as any).Chart) { cb(); return; }
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

const CoverageChart = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const inst = useRef<any>(null);

  useChartJs(() => {
    if (!ref.current) return;
    inst.current?.destroy();

    const { grid, tick } = theme();

    const days = SUPPLIER_VOLUMES.map((v) =>
      Math.round((v / DAILY_AVG_ANALYST) * 10) / 10
    );

    const pointColors = days.map((d) => (d > 5 ? "#E24B4A" : PURPLE));

    inst.current = new (window as any).Chart(ref.current, {
      type: "line",
      data: {
        labels: SUPPLIER_VOLUMES.map((v) =>
          v.toLocaleString("pt-BR")
        ),
        datasets: [
          {
            label: "Dias necessários",
            data: days,
            borderColor: PURPLE,
            backgroundColor: "rgba(127,119,221,0.10)",
            pointBackgroundColor: pointColors,
            pointRadius: 5,
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
            ticks: {
              color: "#6B7280",
              autoSkip: false,
              padding: 12,
            },
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

      // 🔥 labels visíveis
      plugins: [
        {
          id: "pointLabels",
          afterDatasetsDraw(chart: any) {
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);
            const values = chart.data.datasets[0].data;

            meta.data.forEach((point: any, i: number) => {
              const value = values[i];
              const x = point.x;
              const y = point.y;

              ctx.save();
              ctx.font = "bold 10px sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "bottom";

              const text = value + "d";
              const metrics = ctx.measureText(text);
              const pw = metrics.width + 8;
              const ph = 14;

              const px = x - pw / 2;
              const py = y - 10 - ph;

              ctx.fillStyle = "rgba(127,119,221,0.15)";
              ctx.beginPath();
              ctx.roundRect(px, py, pw, ph, 4);
              ctx.fill();

              ctx.fillStyle = PURPLE;
              ctx.fillText(text, x, y - 10);

              ctx.restore();
            });
          },
        },
      ],
    });
  });

  useEffect(() => () => inst.current?.destroy(), []);

  return <canvas ref={ref} />;
};

const ManualProductivitySection = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <SectionBackground showOrb={false} imageOpacity={0.25} gridOpacity={0.15} />

      <div className="relative z-10 w-full container mx-auto px-6 py-8 space-y-4">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Time ecommerce sem o <span className="text-gradient-forge">Pixel Forge</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            4 analistas · 8h efetivas/dia · 07h00–17h30 · intervalo 11h–12h30
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
              <span className="inline-block h-2 w-2 rounded-sm" style={{ background: PURPLE }} />
              Dias necessários
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ background: "#E24B4A", opacity: 0.6 }} />
              Zona crítica (&gt;5d)
            </span>
          </div>

          <div style={{ height: 260 }}>
            <CoverageChart />
          </div>
        </div>

      </div>
    </section>
  );
};

export default ManualProductivitySection;
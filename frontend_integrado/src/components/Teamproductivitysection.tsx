import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Clock, ImageIcon, TrendingDown } from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

// ─── Dados do time ─────────────────────────────────────────────────────────
const TEAM_MEMBERS = [
  { name: "Thiago",  hourly: 20, color: "#7F77DD" },
  { name: "Raphael", hourly: 20, color: "#1D9E75" },
  { name: "Rodrigo", hourly: 20, color: "#BA7517" },
  { name: "Matheus", hourly: 20, color: "#378ADD" },
];

const WORK_HOURS        = 8;
const HOURLY_TOTAL      = TEAM_MEMBERS.reduce((s, m) => s + m.hourly, 0); // 80
const DAILY_TOTAL       = HOURLY_TOTAL * WORK_HOURS;                       // 560
const DAILY_AVG_ANALYST = Math.round(DAILY_TOTAL / TEAM_MEMBERS.length);   // 140

const SUPPLIER_VOLUMES = [1200, 1500, 1800, 2100, 2400, 2700, 3000, 3200, 3500];

const PURPLE = "#7F77DD";
const BADGES = {
  purple: { bg: "#EEEDFE", color: "#3C3489" },
  teal:   { bg: "#E1F5EE", color: "#0F6E56" },
  amber:  { bg: "#FAEEDA", color: "#633806" },
};

const kpis = [
  {
    icon: Users,
    label: "Analistas",
    value: "4",
    sub: "Thiago, Raphael, Rodrigo, Matheus",
    badge: "Time completo",
    badgeStyle: BADGES.purple,
  },
  {
    icon: Clock,
    label: "Horas efetivas",
    value: "8h/dia",
    sub: "07h–17h30 · almoço 11h–12h30",
    badge: "5 dias/semana",
    badgeStyle: BADGES.teal,
  },
  {
    icon: ImageIcon,
    label: "Imagens / hora",
    value: `${HOURLY_TOTAL}`,
    sub: "Soma dos 4 analistas",
    badge: "Base de cálculo",
    badgeStyle: BADGES.amber,
  },
  {
    icon: TrendingDown,
    label: "Imagens / dia",
    value: `${DAILY_TOTAL}`,
    sub: `${HOURLY_TOTAL}/h × ${WORK_HOURS}h efetivas`,
    badge: "Capacidade atual",
    badgeStyle: BADGES.teal,
  },
];

// ─── Hook Chart.js ─────────────────────────────────────────────────────────
function useChartJs(cb: () => void) {
  useEffect(() => {
    if ((window as any).Chart) { cb(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    s.onload = cb;
    document.head.appendChild(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
function theme() {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return {
    grid: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
    tick: dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)",
  };
}

// ─── Gráfico 1: Donut distribuição ─────────────────────────────────────────
const DonutChart = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const inst = useRef<any>(null);

  useChartJs(() => {
    if (!ref.current) return;
    inst.current?.destroy();
    inst.current = new (window as any).Chart(ref.current, {
      type: "doughnut",
      data: {
        labels: TEAM_MEMBERS.map((m) => m.name),
        datasets: [{
          data: TEAM_MEMBERS.map((m) => m.hourly * WORK_HOURS),
          backgroundColor: TEAM_MEMBERS.map((m) => m.color),
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c: any) =>
                ` ${c.label}: ${c.parsed} imgs/dia (${Math.round((c.parsed / DAILY_TOTAL) * 100)}%)`,
            },
          },
        },
      },
    });
  });

  useEffect(() => () => inst.current?.destroy(), []);
  return <canvas ref={ref} aria-label="Distribuição percentual da produção diária por analista" />;
};

// ─── Gráfico 2: Cobertura por volume de fornecedor ─────────────────────────
const CoverageChart = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const inst = useRef<any>(null);

  useChartJs(() => {
    if (!ref.current) return;
    inst.current?.destroy();
    const { grid, tick } = theme();
    const days = SUPPLIER_VOLUMES.map((v) => Math.round((v / DAILY_AVG_ANALYST) * 10) / 10);
    const pointColors = days.map((d) => (d > 5 ? "#E24B4A" : PURPLE));

    inst.current = new (window as any).Chart(ref.current, {
      type: "line",
      data: {
        labels: SUPPLIER_VOLUMES.map((v) => v.toLocaleString("pt-BR")),
        datasets: [
          {
            label: "Dias necessários",
            data: days,
            borderColor: PURPLE,
            backgroundColor: "rgba(127,119,221,0.10)",
            pointBackgroundColor: pointColors,
            pointRadius: 4,
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
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c: any) =>
                c.datasetIndex === 0
                  ? ` ${c.parsed.y} dias para ${Number(SUPPLIER_VOLUMES[c.dataIndex]).toLocaleString("pt-BR")} imgs`
                  : " Limite crítico: 5 dias",
            },
          },
        },
        scales: {
          x: {
            grid: { color: grid },
            ticks: { color: tick, font: { size: 9 }, maxRotation: 0 },
            title: { display: true, text: "Volume por fornecedor (imgs)", color: tick, font: { size: 10 } },
          },
          y: {
            grid: { color: grid },
            ticks: { color: tick, font: { size: 10 }, callback: (v: number) => v + "d" },
            title: { display: true, text: "Dias", color: tick, font: { size: 10 } },
            beginAtZero: true,
          },
        },
      },
    });
  });

  useEffect(() => () => inst.current?.destroy(), []);
  return (
    <canvas
      ref={ref}
      aria-label="Dias necessários por analista para cobrir volumes de 1200 a 3500 imagens"
    />
  );
};

// ─── Componente principal ──────────────────────────────────────────────────
const ManualProductivitySection = () => {
  return (
    <section
      id="produtividade-manual"
      className="relative h-screen flex items-center overflow-hidden"
    >
      {/* Background — mesmo padrão da HeroSection */}
      <SectionBackground showOrb={false} imageOpacity={0.25} gridOpacity={0.15} />

      <div className="relative z-10 w-full container mx-auto px-6 py-8 space-y-3">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold sm:text-4xl text-foreground">
            Time ecommerce sem o{" "}
            <span className="text-gradient-forge"> Pixel Forge</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            4 analistas · 8h efetivas/dia · 07h00–17h30 · intervalo 11h–12h30
          </p>
        </motion.div>

        {/* KPI cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-3 sm:p-4 flex flex-col gap-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex-shrink-0"
                  style={{ background: "rgba(127,119,221,0.12)" }}
                >
                  <k.icon size={13} style={{ color: PURPLE }} />
                </span>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wide font-medium leading-tight">
                  {k.label}
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-semibold text-foreground leading-none">{k.value}</p>
              <p className="text-[11px] text-muted-foreground">{k.sub}</p>
              <span
                className="mt-1 self-start text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: k.badgeStyle.bg, color: k.badgeStyle.color }}
              >
                {k.badge}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Gráficos: Cobertura + Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {/* Cobertura */}
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4">
            <p className="text-sm font-semibold text-foreground">
              Cobertura por volume de fornecedor
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-2">
              Dias/analista — média de {DAILY_AVG_ANALYST} imgs/dia
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
            <div className="relative w-full" style={{ height: 190 }}>
              <CoverageChart />
            </div>
          </div>

          {/* Donut */}
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4">
            <p className="text-sm font-semibold text-foreground">
              Distribuição da produção diária
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-2">
              Participação de cada analista — {DAILY_TOTAL} imgs/dia
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
              {TEAM_MEMBERS.map((m) => (
                <span key={m.name} className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-sm" style={{ background: m.color }} />
                  {m.name} {Math.round(((m.hourly * WORK_HOURS) / DAILY_TOTAL) * 100)}%
                </span>
              ))}
            </div>
            <div className="relative w-full" style={{ height: 190 }}>
              <DonutChart />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ManualProductivitySection;
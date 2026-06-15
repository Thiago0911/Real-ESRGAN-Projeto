import { useEffect, useRef } from "react";
import { Clock, ImageIcon, TrendingUp, Users } from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

const WORK_HOURS = 8;
const REVIEW_HOURS = 1;
const TEAM_SIZE = 4;
const ANALYST_IMAGES_PER_HOUR = 20;
const MACHINE_CAPACITY_PER_CYCLE = 500;

const PIXEL_FORGE_OVERNIGHT_CAPACITY = MACHINE_CAPACITY_PER_CYCLE * TEAM_SIZE;
const INDIVIDUAL_DAILY_CAPACITY = ANALYST_IMAGES_PER_HOUR * WORK_HOURS;
const INDIVIDUAL_CAPACITY_WITH_REVIEW = ANALYST_IMAGES_PER_HOUR * (WORK_HOURS - REVIEW_HOURS);
const INDIVIDUAL_ASSISTED_CAPACITY = INDIVIDUAL_CAPACITY_WITH_REVIEW + MACHINE_CAPACITY_PER_CYCLE;
const TEAM_IMAGES_PER_HOUR = ANALYST_IMAGES_PER_HOUR * TEAM_SIZE;
const TEAM_DAILY_CAPACITY = TEAM_IMAGES_PER_HOUR * WORK_HOURS;
const TEAM_CAPACITY_WITH_REVIEW = TEAM_IMAGES_PER_HOUR * (WORK_HOURS - REVIEW_HOURS);
const ASSISTED_OPERATION_CAPACITY = TEAM_CAPACITY_WITH_REVIEW + PIXEL_FORGE_OVERNIGHT_CAPACITY;
const INDIVIDUAL_CAPACITY_MULTIPLIER = INDIVIDUAL_ASSISTED_CAPACITY / INDIVIDUAL_DAILY_CAPACITY;
const TEAM_CAPACITY_MULTIPLIER = ASSISTED_OPERATION_CAPACITY / TEAM_DAILY_CAPACITY;
const INDIVIDUAL_EXTRA_CAPACITY = INDIVIDUAL_ASSISTED_CAPACITY - INDIVIDUAL_DAILY_CAPACITY;
const TEAM_EXTRA_CAPACITY = ASSISTED_OPERATION_CAPACITY - TEAM_DAILY_CAPACITY;
const TIME_REDUCTION_PERCENT = (1 - TEAM_DAILY_CAPACITY / ASSISTED_OPERATION_CAPACITY) * 100;
const TEAM_MANUAL_HOURS_EQUIVALENT =
PIXEL_FORGE_OVERNIGHT_CAPACITY /
TEAM_IMAGES_PER_HOUR;

const TEAM_WORKDAYS_EQUIVALENT =
TEAM_MANUAL_HOURS_EQUIVALENT /
WORK_HOURS;


const SUPPLIER_VOLUMES = [600, 800, 1000, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3200, 3500];
const REFERENCE_PERIODS = 5;

const PURPLE = "#7F77DD";
const RED = "#E24B4A";
const GREEN = "#1D9E75";

function formatNumber(value: number, maximumFractionDigits = 0) {
  return value.toLocaleString("pt-BR", { maximumFractionDigits });
}

const kpis = [
  {
    icon: ImageIcon,
    label: "Potencial individual",
    value: `${formatNumber(INDIVIDUAL_CAPACITY_MULTIPLIER, 1)}×`,
    unit: "mais capacidade",
    sub: `${formatNumber(INDIVIDUAL_DAILY_CAPACITY)} → ${formatNumber(INDIVIDUAL_ASSISTED_CAPACITY)} imagens por dia`,
  //gain: `+${formatNumber(INDIVIDUAL_EXTRA_CAPACITY)} imagens por analista`,
    badge: `+${formatNumber(INDIVIDUAL_EXTRA_CAPACITY)} imagens por analista`,
  },
  {
    icon: Users,
    label: "Potencial da equipe",
    value: `${formatNumber(TEAM_CAPACITY_MULTIPLIER, 1)}×`,
    unit: "mais capacidade",
    sub: `${formatNumber(TEAM_DAILY_CAPACITY)} → ${formatNumber(ASSISTED_OPERATION_CAPACITY)} imagens por dia`,
  //gain: `+${formatNumber(TEAM_EXTRA_CAPACITY)} imagens por dia`,
    badge: `+${formatNumber(TEAM_EXTRA_CAPACITY)} imagens por dia`,
  },
  {
    icon: Clock,
    label: "Redução de prazo",
    value: `-${formatNumber(TIME_REDUCTION_PERCENT)}%`,
    unit: "no tempo estimado",
    sub: "Menor dependência de horas manuais",
  // gain: "Mais velocidade para o go-live",
    badge: "Mais velocidade para o go-live",
  },
  {
    icon: TrendingUp,
    label: "Carga automatizada",
    value: `${formatNumber(TEAM_MANUAL_HOURS_EQUIVALENT)}h`,
    unit: "da equipe",
    sub: `Equivalente a ${formatNumber(PIXEL_FORGE_OVERNIGHT_CAPACITY)} imagens`,
 // gain: `Cerca de ${formatNumber( TEAM_WORKDAYS_EQUIVALENT, 1 )} jornadas da equipe`,
    badge: `Cerca de ${formatNumber( TEAM_WORKDAYS_EQUIVALENT, 1 )} jornadas da equipe`,
  },
];

const TABLE_VOLUMES = [600, 1200, 1800, 2400, 3000, 3500];

function useChartJs(callback: () => void) {
  useEffect(() => {
    if ((window as any).Chart) {
      callback();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-chartjs="true"]');

    if (existingScript) {
      existingScript.addEventListener("load", callback, { once: true });
      return () => existingScript.removeEventListener("load", callback);
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.dataset.chartjs = "true";
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);

    return () => { script.onload = null; };
  }, []);
}

function getTheme() {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return {
    grid: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
    tick: dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)",
  };
}

type CapacityComparisonChartProps = {
  manualCapacity: number;
  assistedCapacity: number;
  mode: "individual" | "team";
};

const CapacityComparisonChart = ({ manualCapacity, assistedCapacity, mode }: CapacityComparisonChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useChartJs(() => {
    if (!canvasRef.current) return;
    chartInstance.current?.destroy();

    const { grid, tick } = getTheme();
    const manualPeriods = SUPPLIER_VOLUMES.map((v) => Number((v / manualCapacity).toFixed(1)));
    const assistedPeriods = SUPPLIER_VOLUMES.map((v) => Number((v / assistedCapacity).toFixed(1)));
    const manualLabel = mode === "individual" ? "1 analista — manual" : "Equipe — manual";
    const assistedLabel = mode === "individual" ? "Analista + Pixel Forge" : "Equipe + Pixel Forge";

    chartInstance.current = new (window as any).Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: SUPPLIER_VOLUMES.map((v) => formatNumber(v)),
        datasets: [
          {
            label: manualLabel,
            data: manualPeriods,
            borderColor: RED,
            backgroundColor: "rgba(226,75,74,0.07)",
            pointBackgroundColor: RED,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
          {
            label: assistedLabel,
            data: assistedPeriods,
            borderColor: GREEN,
            backgroundColor: "rgba(29,158,117,0.10)",
            pointBackgroundColor: GREEN,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
          {
            label: `Referência de ${REFERENCE_PERIODS} períodos`,
            data: SUPPLIER_VOLUMES.map(() => REFERENCE_PERIODS),
            borderColor: PURPLE,
            borderDash: [5, 4],
            borderWidth: 1.5,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 8, bottom: 6, left: 4, right: 4 } },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items: any[]) => `${items[0].label} imagens`,
              label: (context: any) => {
                const label = context.dataset.label || "";
                const value = context.raw;
                if (label.startsWith("Referência")) return `Referência: ${REFERENCE_PERIODS} dias`;
                const unit = "dias";
                return `${label}: ${formatNumber(value, 1)} ${unit}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: grid },
            ticks: { color: "#6B7280", autoSkip: true, maxTicksLimit: 6, padding: 6, font: { size: 10 } },
            title: { display: true, text: "Volume de imagens", color: tick, font: { size: 10 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: grid },
            ticks: { color: tick, font: { size: 10 }, callback: (v: number | string) => `${v}` },
            title: { display: true, text: "Dias necessários", color: tick, font: { size: 10 } },
          },
        },
      },
    });
  });

  useEffect(() => {
    return () => { chartInstance.current?.destroy(); };
  }, []);

  return <canvas ref={canvasRef} />;
};

type CapacityTableProps = {
  manualCapacity: number;
  assistedCapacity: number;
  manualUnit: string;
  assistedUnit: string;
};

const CapacityTable = ({ manualCapacity, assistedCapacity, manualUnit, assistedUnit }: CapacityTableProps) => (
  <div className="mt-0 overflow-x-auto">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border/50">
          <th className="text-left py-1 pr-2 text-muted-foreground font-medium whitespace-nowrap">Imagens</th>
          {TABLE_VOLUMES.map((v) => (
            <th key={v} className="text-center py-1 px-1 text-muted-foreground font-medium">
              {formatNumber(v)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border/30">
          <td className="py-1 pr-2 text-muted-foreground whitespace-nowrap">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-sm flex-shrink-0" style={{ background: RED }} />
              {manualUnit}
            </span>
          </td>
          {TABLE_VOLUMES.map((v) => (
            <td key={v} className="text-center py-1 px-1 font-semibold" style={{ color: RED }}>
              {formatNumber(v / manualCapacity, 1)} dias
            </td>
          ))}
        </tr>
        <tr>
          <td className="py-1 pr-2 text-muted-foreground whitespace-nowrap">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-sm flex-shrink-0" style={{ background: GREEN }} />
              {assistedUnit}
            </span>
          </td>
          {TABLE_VOLUMES.map((v) => (
            <td key={v} className="text-center py-1 px-1 font-semibold" style={{ color: GREEN }}>
              {formatNumber(v / assistedCapacity, 1)} dias
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
);

const PixelForgeProductivitySection = () => {
  const referenceVolume = SUPPLIER_VOLUMES[SUPPLIER_VOLUMES.length - 1];
  const individualManualReference = referenceVolume / INDIVIDUAL_DAILY_CAPACITY;
  const individualAssistedReference = referenceVolume / INDIVIDUAL_ASSISTED_CAPACITY;
  const teamManualReference = referenceVolume / TEAM_DAILY_CAPACITY;
  const teamAssistedReference = referenceVolume / ASSISTED_OPERATION_CAPACITY;

  return (
    <section className="relative h-screen flex flex-col justify-center overflow-hidden">
      <SectionBackground />

      <div className="relative z-10 w-full container mx-auto px-6 flex flex-col gap-4 py-6 max-h-screen overflow-hidden">
        {/* Header */}
        <div className="text-center mx-auto">
          <h2 className="text-3xl font-bold text-foreground">
            Capacidade potencializada com{" "}
            <span className="text-gradient-forge">Pixel Forge</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            A automação amplia a capacidade operacional sem exigir mais velocidade dos analistas.
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <kpi.icon size={14} style={{ color: PURPLE }} />
                <p className="text-xs text-muted-foreground uppercase">{kpi.label}</p>
              </div>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-semibold">{kpi.value}</p>
                <span className="text-xs text-muted-foreground">{kpi.unit}</span>
              </div>
              <p className="text-xs text-muted-foreground">{kpi.sub}</p>
             {/* <p className="text-xs font-semibold mt-0.5" style={{ color: GREEN }}>{kpi.gain}</p> */}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 w-fit mt-1">
                {kpi.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="rounded-2xl border bg-card/60 p-4">
          <div className="mb-3">
            <p className="text-sm font-semibold">Como o Pixel Forge potencializa a capacidade</p>
            <p className="text-xs text-muted-foreground mt-1">
              Comparação individual e coletiva entre o esforço manual e a operação apoiada pela automação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Individual */}
            <div className="rounded-xl border bg-background/30 p-3 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Potencial individual</p>
                  <p className="text-xs text-muted-foreground mt-0.5">1 analista com apoio de 1 máquina</p>
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 whitespace-nowrap">
                  {formatNumber(INDIVIDUAL_DAILY_CAPACITY)} → {formatNumber(INDIVIDUAL_ASSISTED_CAPACITY)} imagens
                </span>
              </div>

              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: RED }} />Manual
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: GREEN }} />Com Pixel Forge
                </span>
              </div>

              <div className="h-[150px]">
                <CapacityComparisonChart
                  manualCapacity={INDIVIDUAL_DAILY_CAPACITY}
                  assistedCapacity={INDIVIDUAL_ASSISTED_CAPACITY}
                  mode="individual"
                />
              </div>

              <CapacityTable
                manualCapacity={INDIVIDUAL_DAILY_CAPACITY}
                assistedCapacity={INDIVIDUAL_ASSISTED_CAPACITY}
                manualUnit="Manual"
                assistedUnit="Pixel Forge"
              />

              <div className="rounded-lg border border-primary/15 bg-primary/5 px-3 py-2">
                <p className="text-xs text-foreground">
                  Para <strong>{formatNumber(referenceVolume)} imagens</strong>:{" "}
                  <strong style={{ color: RED }}>{formatNumber(individualManualReference, 1)} dias</strong> manual →{" "}
                  <strong style={{ color: GREEN }}>{formatNumber(individualAssistedReference, 1)} dias</strong> com Pixel Forge.
                </p>
              </div>
            </div>

            {/* Team */}
            <div className="rounded-xl border bg-background/30 p-3 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Potencial da equipe</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{TEAM_SIZE} analistas com apoio de {TEAM_SIZE} máquinas</p>
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 whitespace-nowrap">
                  {formatNumber(TEAM_DAILY_CAPACITY)} → {formatNumber(ASSISTED_OPERATION_CAPACITY)} imagens
                </span>
              </div>

              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: RED }} />Equipe manual
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: GREEN }} />Equipe + Pixel Forge
                </span>
              </div>

              <div className="h-[150px]">
                <CapacityComparisonChart
                  manualCapacity={TEAM_DAILY_CAPACITY}
                  assistedCapacity={ASSISTED_OPERATION_CAPACITY}
                  mode="team"
                />
              </div>

              <CapacityTable
                manualCapacity={TEAM_DAILY_CAPACITY}
                assistedCapacity={ASSISTED_OPERATION_CAPACITY}
                manualUnit="Equipe manual"
                assistedUnit="Equipe + Pixel Forge"
              />

              <div className="rounded-lg border border-primary/15 bg-primary/5 px-3 py-2">
                <p className="text-xs text-foreground">
                  Para <strong>{formatNumber(referenceVolume)} imagens</strong>:{" "}
                  <strong style={{ color: RED }}>{formatNumber(teamManualReference, 1)} dias</strong> manual →{" "}
                  <strong style={{ color: GREEN }}>{formatNumber(teamAssistedReference, 1)} dias</strong> com Pixel Forge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PixelForgeProductivitySection;
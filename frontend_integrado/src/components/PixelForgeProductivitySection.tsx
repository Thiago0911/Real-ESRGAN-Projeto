import { useEffect, useRef } from "react";
import { Clock, ImageIcon, TrendingUp, Users } from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

/* ───────────────── CONFIGURAÇÃO ───────────────── */

const WORK_HOURS = 8;
const REVIEW_HOURS = 1;

const TEAM_SIZE = 4;
const ANALYST_IMAGES_PER_HOUR = 20;

const MACHINE_COUNT = 4;
const MACHINE_CAPACITY_PER_CYCLE = 500;

const REFERENCE_VOLUME = 3500;
const REFERENCE_PERIODS = 5;

/* ───────────────── CAPACIDADE MANUAL ───────────────── */

const TEAM_IMAGES_PER_HOUR = TEAM_SIZE * ANALYST_IMAGES_PER_HOUR;
const TEAM_DAILY_CAPACITY = TEAM_IMAGES_PER_HOUR * WORK_HOURS;

/*
Durante o expediente, uma hora é considerada
para revisão e validação das imagens processadas.
*/
const TEAM_CAPACITY_WITH_REVIEW =
  TEAM_IMAGES_PER_HOUR * (WORK_HOURS - REVIEW_HOURS);

/* ───────────────── PIXEL FORGE ───────────────── */

const PIXEL_FORGE_OVERNIGHT_CAPACITY =
  MACHINE_COUNT * MACHINE_CAPACITY_PER_CYCLE;

const ASSISTED_OPERATION_CAPACITY =
  TEAM_CAPACITY_WITH_REVIEW + PIXEL_FORGE_OVERNIGHT_CAPACITY;

/* ───────────────── RESULTADOS ───────────────── */

const TEAM_CAPACITY_MULTIPLIER =
  ASSISTED_OPERATION_CAPACITY / TEAM_DAILY_CAPACITY;

const TEAM_EXTRA_CAPACITY =
  ASSISTED_OPERATION_CAPACITY - TEAM_DAILY_CAPACITY;

const TIME_REDUCTION_PERCENT =
  (1 - TEAM_DAILY_CAPACITY / ASSISTED_OPERATION_CAPACITY) * 100;

/*
Esforço humano equivalente:
2.000 imagens ÷ 20 imagens/hora
*/
const MANUAL_PERSON_HOURS_EQUIVALENT =
  PIXEL_FORGE_OVERNIGHT_CAPACITY / ANALYST_IMAGES_PER_HOUR;

/*
Tempo equivalente com os quatro analistas
trabalhando simultaneamente.
*/
const TEAM_MANUAL_HOURS_EQUIVALENT =
  PIXEL_FORGE_OVERNIGHT_CAPACITY / TEAM_IMAGES_PER_HOUR;

const MANUAL_REFERENCE_TIME = REFERENCE_VOLUME / TEAM_DAILY_CAPACITY;
const ASSISTED_REFERENCE_TIME =
  REFERENCE_VOLUME / ASSISTED_OPERATION_CAPACITY;

/* ───────────────── GRÁFICO ───────────────── */

const SUPPLIER_VOLUMES = [
  600,
  800,
  1000,
  1200,
  1500,
  1800,
  2100,
  2400,
  2700,
  3000,
  3200,
  3500,
];

const PURPLE = "#7F77DD";
const RED = "#E24B4A";
const GREEN = "#1D9E75";

function formatNumber(value: number, maximumFractionDigits = 0) {
  return value.toLocaleString("pt-BR", {
    maximumFractionDigits,
  });
}

/* ───────────────── KPIS ───────────────── */

const kpis = [
  {
    icon: Users,
    label: "Capacidade operacional",
    value: `${formatNumber(TEAM_CAPACITY_MULTIPLIER, 1)}×`,
    unit: "mais capacidade",
    sub: `${formatNumber(TEAM_DAILY_CAPACITY)} → ${formatNumber(
      ASSISTED_OPERATION_CAPACITY,
    )} imagens por jornada`,
    badge: `+${formatNumber(TEAM_EXTRA_CAPACITY)} imagens`,
  },
  {
    icon: Clock,
    label: "Redução de prazo",
    value: `-${formatNumber(TIME_REDUCTION_PERCENT)}%`,
    unit: "no tempo estimado",
    sub: `${formatNumber(MANUAL_REFERENCE_TIME, 1)} → ${formatNumber(
      ASSISTED_REFERENCE_TIME,
      1,
    )} jornadas operacionais`,
    badge: "Mais agilidade operacional",
  },
  {
    icon: ImageIcon,
    label: "Processamento automatizado",
    value: formatNumber(PIXEL_FORGE_OVERNIGHT_CAPACITY),
    unit: "imagens por noite",
    sub: `${MACHINE_COUNT} máquinas × ${MACHINE_CAPACITY_PER_CYCLE} imagens`,
    badge: "Fora do expediente",
  },
  {
    icon: TrendingUp,
    label: "Esforço absorvido",
    value: formatNumber(MANUAL_PERSON_HOURS_EQUIVALENT),
    unit: "horas-homem",
    sub: `Equivale a ${formatNumber(
      TEAM_MANUAL_HOURS_EQUIVALENT,
    )}h com toda a equipe`,
    badge: "Carga repetitiva automatizada",
  },
];

/* ───────────────── CARREGAMENTO DO CHART.JS ───────────────── */

let chartJsPromise: Promise<void> | null = null;

function loadChartJs() {
  if ((window as any).Chart) {
    return Promise.resolve();
  }

  if (chartJsPromise) {
    return chartJsPromise;
  }

  chartJsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-chartjs="true"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), {
        once: true,
      });

      existingScript.addEventListener(
        "error",
        () => reject(new Error("Não foi possível carregar o Chart.js.")),
        { once: true },
      );

      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.dataset.chartjs = "true";
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Não foi possível carregar o Chart.js."));

    document.head.appendChild(script);
  });

  return chartJsPromise;
}

function getTheme() {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return {
    grid: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
    tick: dark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)",
  };
}

/* ───────────────── GRÁFICO COMPARATIVO ───────────────── */

const ProductivityComparisonChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    loadChartJs()
      .then(() => {
        if (cancelled || !canvasRef.current) {
          return;
        }

        chartInstance.current?.destroy();

        const { grid, tick } = getTheme();

        const manualPeriods = SUPPLIER_VOLUMES.map((volume) =>
          Number((volume / TEAM_DAILY_CAPACITY).toFixed(1)),
        );

        const assistedPeriods = SUPPLIER_VOLUMES.map((volume) =>
          Number((volume / ASSISTED_OPERATION_CAPACITY).toFixed(1)),
        );

        chartInstance.current = new (window as any).Chart(canvasRef.current, {
          type: "line",

          data: {
            labels: SUPPLIER_VOLUMES.map((volume) => formatNumber(volume)),

            datasets: [
              {
                label: "Processo manual",
                data: manualPeriods,
                borderColor: RED,
                backgroundColor: "rgba(226,75,74,0.06)",
                pointBackgroundColor: RED,
                pointBorderColor: RED,
                pointRadius: 4,
                pointHoverRadius: 7,
                borderWidth: 2,
                fill: false,
                tension: 0.3,
              },
              {
                label: "Operação com Pixel Forge",
                data: assistedPeriods,
                borderColor: GREEN,
                backgroundColor: "rgba(29,158,117,0.10)",
                pointBackgroundColor: GREEN,
                pointBorderColor: GREEN,
                pointRadius: 4,
                pointHoverRadius: 7,
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
                fill: false,
              },
            ],
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
              duration: 1000,
              easing: "easeOutQuart",
            },

            interaction: {
              mode: "index",
              intersect: false,
            },

            layout: {
              padding: {
                top: 8,
                bottom: 8,
                left: 4,
                right: 4,
              },
            },

            plugins: {
              legend: {
                display: false,
              },

              tooltip: {
                callbacks: {
                  title: (items: any[]) => `${items[0].label} imagens`,

                  label: (context: any) => {
                    const label = context.dataset.label || "";
                    const value = context.raw;

                    if (label.startsWith("Referência")) {
                      return `Limite de referência: ${REFERENCE_PERIODS} períodos`;
                    }

                    if (label.includes("manual")) {
                      return `Processo manual: ${formatNumber(
                        value,
                        1,
                      )} jornadas`;
                    }

                    return `Com Pixel Forge: ${formatNumber(
                      value,
                      1,
                    )} jornadas`;
                  },
                },
              },
            },

            scales: {
              x: {
                grid: {
                  color: grid,
                },

                ticks: {
                  color: "#6B7280",
                  autoSkip: true,
                  maxTicksLimit: 7,
                  padding: 7,
                  font: {
                    size: 10,
                  },
                },

                title: {
                  display: true,
                  text: "Volume de imagens",
                  color: tick,
                  font: {
                    size: 10,
                  },
                },
              },

              y: {
                beginAtZero: true,

                grid: {
                  color: grid,
                },

                ticks: {
                  color: tick,
                  font: {
                    size: 10,
                  },
                  callback: (value: number | string) => `${value}`,
                },

                title: {
                  display: true,
                  text: "Jornadas operacionais necessárias",
                  color: tick,
                  font: {
                    size: 10,
                  },
                },
              },
            },
          },
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar gráfico:", error);
      });

    return () => {
      cancelled = true;
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="!h-full !w-full" />;
};

/* ───────────────── COMPONENTE PRINCIPAL ───────────────── */

const PixelForgeProductivitySection = () => {
  return (
    <section
      id="beneficios"
      className="relative min-h-[100svh] overflow-x-hidden lg:flex lg:h-[100svh] lg:min-h-0 lg:items-center lg:overflow-y-auto"
    >
      <SectionBackground />

      <div className="container relative z-10 mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-4">
        <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-3 lg:gap-2.5">
          {/* HEADER COMPACTO */}
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
              Benefícios e resultados esperados
            </p>

            <h2 className="mt-1.5 text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:whitespace-nowrap lg:text-[2.25rem] xl:text-[2.5rem]">
              Mais capacidade, menos{" "}
              <span className="text-gradient-forge">
                esforço repetitivo
              </span>
            </h2>

            <p className="mx-auto mt-1.5 max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              O Pixel Forge amplia a capacidade de tratamento sem exigir mais
              velocidade individual da equipe.
            </p>

            <p className="mx-auto mt-1 max-w-3xl text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]">
              {TEAM_SIZE} analistas · {MACHINE_COUNT} máquinas ·{" "}
              {formatNumber(PIXEL_FORGE_OVERNIGHT_CAPACITY)} imagens processadas
              durante a noite
            </p>
          </div>

          {/* KPIS EM FAIXA COMPACTA */}
          <div className="grid min-w-0 grid-cols-2 gap-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="flex min-w-0 items-start gap-2.5 rounded-xl border bg-card/60 p-2.5 backdrop-blur-sm sm:p-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                  <kpi.icon
                    size={15}
                    style={{ color: PURPLE }}
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] font-medium uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                    {kpi.label}
                  </p>

                  <div className="mt-0.5 flex min-w-0 flex-wrap items-baseline gap-x-1.5">
                    <p className="text-lg font-semibold leading-none text-foreground sm:text-xl">
                      {kpi.value}
                    </p>

                    <span className="text-[9px] text-muted-foreground sm:text-[10px]">
                      {kpi.unit}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-[9px] leading-tight text-muted-foreground sm:text-[10px]">
                    {kpi.sub}
                  </p>

                  <p className="mt-1 truncate text-[9px] font-medium text-purple-700 dark:text-purple-300">
                    {kpi.badge}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ÁREA PRINCIPAL: GRÁFICO + RESULTADOS LATERAIS */}
          <div className="grid min-w-0 gap-2.5 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.75fr)]">
            {/* GRÁFICO */}
            <div className="min-w-0 rounded-2xl border bg-card/60 p-3 backdrop-blur-sm sm:p-4">
              <div className="mb-2 flex min-w-0 flex-col gap-2 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground sm:text-sm">
                    Processo manual × operação apoiada
                  </p>

                  <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]">
                    Tempo necessário conforme o volume de imagens aumenta.
                  </p>
                </div>

                <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-[9px] text-muted-foreground sm:text-[10px]">
                  <span className="flex items-center gap-1">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-sm"
                      style={{ background: RED }}
                    />
                    Manual
                  </span>

                  <span className="flex items-center gap-1">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-sm"
                      style={{ background: GREEN }}
                    />
                    Pixel Forge
                  </span>

                  <span className="flex items-center gap-1">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-sm"
                      style={{ background: PURPLE }}
                    />
                    {REFERENCE_PERIODS} períodos
                  </span>
                </div>
              </div>

              <div className="relative h-[210px] min-w-0 overflow-hidden sm:h-[240px] lg:h-[clamp(235px,38vh,310px)]">
                <ProductivityComparisonChart />
              </div>
            </div>

            {/* RESULTADOS COMPACTOS */}
            <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 lg:block">
                <div className="min-w-0">
                  <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                    Processo manual
                  </p>

                  <p
                    className="mt-0.5 text-lg font-semibold leading-none"
                    style={{ color: RED }}
                  >
                    {formatNumber(MANUAL_REFERENCE_TIME, 1)} jornadas
                  </p>
                </div>

                <p className="max-w-[180px] text-right text-[9px] leading-relaxed text-muted-foreground sm:max-w-none lg:mt-1.5 lg:text-left lg:text-[10px]">
                  Equipe dedicada para {formatNumber(REFERENCE_VOLUME)} imagens.
                </p>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-2.5 lg:block">
                <div className="min-w-0">
                  <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                    Com Pixel Forge
                  </p>

                  <p
                    className="mt-0.5 text-lg font-semibold leading-none"
                    style={{ color: GREEN }}
                  >
                    {formatNumber(ASSISTED_REFERENCE_TIME, 1)} jornadas
                  </p>
                </div>

                <p className="max-w-[180px] text-right text-[9px] leading-relaxed text-muted-foreground sm:max-w-none lg:mt-1.5 lg:text-left lg:text-[10px]">
                  Operação assistida para o mesmo volume.
                </p>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 lg:block">
                <div className="min-w-0">
                  <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                    Resultado estimado
                  </p>

                  <p className="mt-0.5 text-lg font-semibold leading-none text-primary">
                    {formatNumber(TIME_REDUCTION_PERCENT)}% menos tempo
                  </p>
                </div>

                <p className="max-w-[180px] text-right text-[9px] leading-relaxed text-muted-foreground sm:max-w-none lg:mt-1.5 lg:text-left lg:text-[10px]">
                  Capacidade {formatNumber(TEAM_CAPACITY_MULTIPLIER, 1)}× maior.
                </p>
              </div>

              {/* PREMISSAS INTEGRADAS À LATERAL */}
              <div className="min-w-0 rounded-xl border border-border/70 bg-background/30 px-3 py-2 sm:col-span-3 lg:col-span-1">
                <p className="text-[9px] leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Premissas:</strong>{" "}
                  {formatNumber(TEAM_DAILY_CAPACITY)} imagens/dia · 1h de revisão ·{" "}
                  {formatNumber(TEAM_CAPACITY_WITH_REVIEW)} tratadas no expediente ·{" "}
                  {formatNumber(PIXEL_FORGE_OVERNIGHT_CAPACITY)} na janela noturna.
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

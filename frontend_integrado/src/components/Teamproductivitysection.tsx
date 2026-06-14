import { useEffect, useRef } from "react";
import {
  ImageIcon,
  TrendingDown,
  Clock,
  Users,
} from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

const TEAM_MEMBERS = [
  { name: "Thiago", hourly: 20 },
  { name: "Raphael", hourly: 20 },
  { name: "Rodrigo", hourly: 20 },
  { name: "Matheus", hourly: 20 },
];

const WORK_HOURS = 8;
const REFERENCE_VOLUME = 3500;
const CRITICAL_DAYS = 5;

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
const CRITICAL_COLOR = "#E24B4A";

/* Quantidade de analistas */
const TEAM_SIZE = TEAM_MEMBERS.length;

/* Capacidade conjunta por hora */
const HOURLY_TEAM_CAPACITY = TEAM_MEMBERS.reduce(
  (total, member) => total + member.hourly,
  0
);

/* Média individual por hora */
const AVG_PER_ANALYST_HOUR =
  HOURLY_TEAM_CAPACITY / TEAM_SIZE;

const DAILY_ANALYST_CAPACITY =
  AVG_PER_ANALYST_HOUR * WORK_HOURS;

/* Capacidade diária da equipe */
const DAILY_TEAM_CAPACITY =
  HOURLY_TEAM_CAPACITY * WORK_HOURS;

/* Esforço humano para o volume de referência */
const REFERENCE_EFFORT_HOURS =
  REFERENCE_VOLUME / AVG_PER_ANALYST_HOUR;

/* Prazo usando toda a equipe */
const REFERENCE_TEAM_DAYS =
  REFERENCE_VOLUME / DAILY_TEAM_CAPACITY;

const formatNumber = (
  value: number,
  maximumFractionDigits = 0
) =>
  value.toLocaleString("pt-BR", {
    maximumFractionDigits,
  });

const kpis = [
  {
    icon: ImageIcon,
    label: "Produtividade manual",
    value: formatNumber(AVG_PER_ANALYST_HOUR),
    unit: "imagens/hora",
    sub: "Média por analista",
    badge: "Ritmo atual",
  },
  {
    icon: Users,
    label: "Capacidade da equipe",
    value: formatNumber(DAILY_TEAM_CAPACITY),
    unit: "imagens/dia",
    sub: `${TEAM_SIZE} analistas × ${WORK_HOURS} horas produtivas`,
    badge: "Capacidade teórica",
  },
  {
    icon: Clock,
    label: `Esforço para ${formatNumber(REFERENCE_VOLUME)} imagens`,
    value: formatNumber(REFERENCE_EFFORT_HOURS),
    unit: "horas de trabalho",
    sub: "Somatório das horas dos analistas",
    badge: "Carga operacional",
  },
  {
    icon: TrendingDown,
    label: "Prazo com toda a equipe",
    value: formatNumber(REFERENCE_TEAM_DAYS, 1),
    unit: "dias úteis",
    sub: `Dedicação integral dos ${TEAM_SIZE} analistas`,
    badge: "Impacto no go-live",
  },
];

function useChartJs(callback: () => void) {
  useEffect(() => {
    if ((window as any).Chart) {
      callback();
      return;
    }

    const existingScript = document.querySelector(
      'script[data-chartjs="true"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", callback);

      return () => {
        existingScript.removeEventListener("load", callback);
      };
    }

    const script = document.createElement("script");

    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";

    script.dataset.chartjs = "true";
    script.onload = callback;

    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);
}

function theme() {
  const dark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  return {
    grid: dark
      ? "rgba(255,255,255,0.07)"
      : "rgba(0,0,0,0.06)",

    tick: dark
      ? "rgba(255,255,255,0.38)"
      : "rgba(0,0,0,0.38)",
  };
}

type CoverageChartProps = {
  dailyCapacity: number;
  mode: "individual" | "team";
};

const CoverageChart = ({
  dailyCapacity,
  mode,
}: CoverageChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useChartJs(() => {
    if (!canvasRef.current) return;

    chartInstance.current?.destroy();

    const { grid, tick } = theme();

    const days = SUPPLIER_VOLUMES.map((volume) =>
      Number((volume / dailyCapacity).toFixed(1))
    );

    const pointColors = days.map((day) =>
      day > CRITICAL_DAYS
        ? CRITICAL_COLOR
        : PURPLE
    );

    chartInstance.current = new (window as any).Chart(
      canvasRef.current,
      {
        type: "line",

        data: {
          labels: SUPPLIER_VOLUMES.map((volume) =>
            formatNumber(volume)
          ),

          datasets: [
            {
              label:
                mode === "individual"
                  ? "Prazo com um analista"
                  : "Prazo com a equipe dedicada",

              data: days,
              borderColor: PURPLE,
              backgroundColor:
                "rgba(127,119,221,0.10)",
              pointBackgroundColor: pointColors,
              pointRadius: 4,
              borderWidth: 2,
              fill: true,
              tension: 0.3,
            },
            {
              label: `Referência de ${CRITICAL_DAYS} dias`,
              data: SUPPLIER_VOLUMES.map(
                () => CRITICAL_DAYS
              ),
              borderColor: CRITICAL_COLOR,
              borderDash: [5, 4],
              borderWidth: 1.5,
              pointRadius: 0,
            },
          ],
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          layout: {
            padding: {
              top: 24,
              bottom: 10,
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
                title: (items: any[]) =>
                  `${items[0].label} imagens`,

                label: (context: any) =>
                  `${formatNumber(
                    context.parsed.y,
                    1
                  )} dias úteis`,
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
                maxTicksLimit: 6,
                padding: 8,
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

                callback: (
                  value: number | string
                ) => `${value}d`,
              },

              title: {
                display: true,
                text: "Dias úteis",
                color: tick,
                font: {
                  size: 10,
                },
              },
            },
          },
        },

        plugins: [
          {
            id: `point-labels-${mode}`,

            afterDatasetsDraw(chart: any) {
              const { ctx } = chart;
              const meta = chart.getDatasetMeta(0);

              const values =
                chart.data.datasets[0]
                  .data as number[];

              meta.data.forEach(
                (point: any, index: number) => {
                  const value = values[index];
                  const x = point.x;
                  const y = point.y;

                  ctx.save();

                  ctx.font = "bold 9px sans-serif";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "bottom";

                  const text =
                    `${formatNumber(value, 1)}d`;

                  const metrics =
                    ctx.measureText(text);

                  const pillWidth =
                    metrics.width + 8;

                  const pillHeight = 13;
                  const pillX =
                    x - pillWidth / 2;

                  const pillY =
                    y - 9 - pillHeight;

                  ctx.fillStyle =
                    value > CRITICAL_DAYS
                      ? "rgba(226,75,74,0.15)"
                      : "rgba(127,119,221,0.15)";

                  ctx.beginPath();

                  ctx.roundRect(
                    pillX,
                    pillY,
                    pillWidth,
                    pillHeight,
                    4
                  );

                  ctx.fill();

                  ctx.fillStyle =
                    value > CRITICAL_DAYS
                      ? CRITICAL_COLOR
                      : PURPLE;

                  ctx.fillText(
                    text,
                    x,
                    y - 9
                  );

                  ctx.restore();
                }
              );
            },
          },
        ],
      }
    );
  });

  useEffect(() => {
    return () => {
      chartInstance.current?.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

const ManualProductivitySection = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <SectionBackground
        showOrb={false}
        imageOpacity={0.25}
        gridOpacity={0.15}
      />

      <div className="relative z-10 w-full container mx-auto px-6 py-8 space-y-4">
        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Antes da automação: o limite do
            <span className="text-gradient-forge">
              {" "}
              processo manual
            </span>
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Mesmo com uma equipe produtiva, grandes volumes
            de imagens consomem capacidade operacional e
            ampliam o prazo para o go-live.
          </p>

          <p className="text-xs text-muted-foreground mt-2">
            Cenário considerado: {TEAM_SIZE} analistas ·
            média de{" "}
            {formatNumber(AVG_PER_ANALYST_HOUR)}{" "}
            imagens/hora por analista · {WORK_HOURS} horas
            produtivas por dia
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <kpi.icon
                  size={14}
                  style={{ color: PURPLE }}
                />

                <p className="text-xs text-muted-foreground uppercase">
                  {kpi.label}
                </p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-semibold">
                  {kpi.value}
                </p>

                <span className="text-xs text-muted-foreground">
                  {kpi.unit}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {kpi.sub}
              </p>

              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 w-fit">
                {kpi.badge}
              </span>
            </div>
          ))}
        </div>

        {/* COMPARATIVO DE PRAZO */}
        <div className="rounded-2xl border bg-card/60 p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-sm font-semibold">
                Quanto o volume de imagens impacta o go-live
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                Comparativo entre a capacidade individual e a
                mobilização de toda a equipe.
              </p>
            </div>

            <div className="hidden sm:flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ background: PURPLE }}
                />
                Prazo estimado
              </span>

              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{
                    background: CRITICAL_COLOR,
                    opacity: 0.6,
                  }}
                />
                Referência de {CRITICAL_DAYS} dias
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* INDIVIDUAL */}
            <div className="rounded-xl border bg-background/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    Capacidade individual
                  </p>

                  <p className="text-xs text-muted-foreground">
                    1 analista ·{" "}
                    {formatNumber(
                      DAILY_ANALYST_CAPACITY
                    )}{" "}
                    imagens/dia
                  </p>
                </div>

                <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-medium text-purple-700">
                  3.500 imagens ={" "}
                  {formatNumber(
                    REFERENCE_VOLUME /
                      DAILY_ANALYST_CAPACITY,
                    1
                  )}{" "}
                  dias
                </span>
              </div>

              <div className="h-[215px] mt-1">
                <CoverageChart
                  dailyCapacity={
                    DAILY_ANALYST_CAPACITY
                  }
                  mode="individual"
                />
              </div>
            </div>

            {/* EQUIPE */}
            <div className="rounded-xl border bg-background/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    Capacidade da equipe
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {TEAM_SIZE} analistas ·{" "}
                    {formatNumber(
                      DAILY_TEAM_CAPACITY
                    )}{" "}
                    imagens/dia
                  </p>
                </div>

                <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-medium text-purple-700">
                  3.500 imagens ={" "}
                  {formatNumber(
                    REFERENCE_VOLUME /
                      DAILY_TEAM_CAPACITY,
                    1
                  )}{" "}
                  dias
                </span>
              </div>

              <div className="h-[215px] mt-1">
                <CoverageChart
                  dailyCapacity={
                    DAILY_TEAM_CAPACITY
                  }
                  mode="team"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManualProductivitySection;

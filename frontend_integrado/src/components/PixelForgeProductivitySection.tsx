import {
useEffect,
useRef,
} from "react";
import {
Clock,
ImageIcon,
TrendingUp,
Users,
} from "lucide-react";
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

const TEAM_IMAGES_PER_HOUR =
TEAM_SIZE * ANALYST_IMAGES_PER_HOUR;

const TEAM_DAILY_CAPACITY =
TEAM_IMAGES_PER_HOUR * WORK_HOURS;

/*
Durante o expediente, uma hora é considerada
para revisão e validação das imagens processadas.
*/
const TEAM_CAPACITY_WITH_REVIEW =
TEAM_IMAGES_PER_HOUR *
(WORK_HOURS - REVIEW_HOURS);

/* ───────────────── PIXEL FORGE ───────────────── */

const PIXEL_FORGE_OVERNIGHT_CAPACITY =
MACHINE_COUNT *
MACHINE_CAPACITY_PER_CYCLE;

const ASSISTED_OPERATION_CAPACITY =
TEAM_CAPACITY_WITH_REVIEW +
PIXEL_FORGE_OVERNIGHT_CAPACITY;

/* ───────────────── RESULTADOS ───────────────── */

const TEAM_CAPACITY_MULTIPLIER =
ASSISTED_OPERATION_CAPACITY /
TEAM_DAILY_CAPACITY;

const TEAM_EXTRA_CAPACITY =
ASSISTED_OPERATION_CAPACITY -
TEAM_DAILY_CAPACITY;

const TIME_REDUCTION_PERCENT =
(1 -
TEAM_DAILY_CAPACITY /
ASSISTED_OPERATION_CAPACITY) *
100;

/*
Esforço humano equivalente:
2.000 imagens ÷ 20 imagens/hora
*/
const MANUAL_PERSON_HOURS_EQUIVALENT =
PIXEL_FORGE_OVERNIGHT_CAPACITY /
ANALYST_IMAGES_PER_HOUR;

/*
Tempo equivalente com os quatro analistas
trabalhando simultaneamente.
*/
const TEAM_MANUAL_HOURS_EQUIVALENT =
PIXEL_FORGE_OVERNIGHT_CAPACITY /
TEAM_IMAGES_PER_HOUR;

const MANUAL_REFERENCE_TIME =
REFERENCE_VOLUME /
TEAM_DAILY_CAPACITY;

const ASSISTED_REFERENCE_TIME =
REFERENCE_VOLUME /
ASSISTED_OPERATION_CAPACITY;

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

function formatNumber(
value: number,
maximumFractionDigits = 0
) {
return value.toLocaleString("pt-BR", {
maximumFractionDigits,
});
}

/* ───────────────── KPIS ───────────────── */

const kpis = [
{
icon: Users,
label: "Capacidade operacional",
value: `${formatNumber(
      TEAM_CAPACITY_MULTIPLIER,
      1
    )}×`,
unit: "mais capacidade",
sub: `${formatNumber(
      TEAM_DAILY_CAPACITY
    )} manuais/dia → ${formatNumber(
      ASSISTED_OPERATION_CAPACITY
    )} por ciclo`,
badge: `+${formatNumber(
      TEAM_EXTRA_CAPACITY
    )} imagens`,
},
{
icon: Clock,
label: "Redução de prazo",
value: `-${formatNumber(
      TIME_REDUCTION_PERCENT
    )}%`,
unit: "no tempo estimado",
sub: `${formatNumber(
      MANUAL_REFERENCE_TIME,
      1
    )} dias → ${formatNumber(
      ASSISTED_REFERENCE_TIME,
      1
    )} ciclos`,
badge: "Mais agilidade operacional",
},
{
icon: ImageIcon,
label: "Processamento automatizado",
value: formatNumber(
PIXEL_FORGE_OVERNIGHT_CAPACITY
),
unit: "imagens por noite",
sub: `${MACHINE_COUNT} máquinas × ${MACHINE_CAPACITY_PER_CYCLE} imagens`,
badge: "Fora do expediente",
},
{
icon: TrendingUp,
label: "Esforço absorvido",
value: formatNumber(
MANUAL_PERSON_HOURS_EQUIVALENT
),
unit: "horas-homem",
sub: `Equivale a ${formatNumber(
      TEAM_MANUAL_HOURS_EQUIVALENT
    )}h com toda a equipe`,
badge: "Carga repetitiva automatizada",
},
];

/* ───────────────── CARREGAMENTO DO CHART.JS ───────────────── */

let chartJsPromise: Promise<void> | null =
null;

function loadChartJs() {
if ((window as any).Chart) {
return Promise.resolve();
}

if (chartJsPromise) {
return chartJsPromise;
}

chartJsPromise = new Promise(
(resolve, reject) => {
const existingScript =
document.querySelector<HTMLScriptElement>(
'script[data-chartjs="true"]'
);


  if (existingScript) {
    existingScript.addEventListener(
      "load",
      () => resolve(),
      { once: true }
    );

    existingScript.addEventListener(
      "error",
      () =>
        reject(
          new Error(
            "Não foi possível carregar o Chart.js."
          )
        ),
      { once: true }
    );

    return;
  }

  const script =
    document.createElement("script");

  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";

  script.dataset.chartjs = "true";
  script.async = true;

  script.onload = () => resolve();

  script.onerror = () =>
    reject(
      new Error(
        "Não foi possível carregar o Chart.js."
      )
    );

  document.head.appendChild(script);
}


);

return chartJsPromise;
}

function getTheme() {
const dark = window.matchMedia(
"(prefers-color-scheme: dark)"
).matches;

return {
grid: dark
? "rgba(255,255,255,0.07)"
: "rgba(0,0,0,0.06)",


tick: dark
  ? "rgba(255,255,255,0.42)"
  : "rgba(0,0,0,0.42)",


};
}

/* ───────────────── GRÁFICO COMPARATIVO ───────────────── */

const ProductivityComparisonChart = () => {
const canvasRef =
useRef<HTMLCanvasElement>(null);

const chartInstance =
useRef<any>(null);

useEffect(() => {
let cancelled = false;


loadChartJs()
  .then(() => {
    if (
      cancelled ||
      !canvasRef.current
    ) {
      return;
    }

    chartInstance.current?.destroy();

    const { grid, tick } =
      getTheme();

    const manualPeriods =
      SUPPLIER_VOLUMES.map(
        (volume) =>
          Number(
            (
              volume /
              TEAM_DAILY_CAPACITY
            ).toFixed(1)
          )
      );

    const assistedPeriods =
      SUPPLIER_VOLUMES.map(
        (volume) =>
          Number(
            (
              volume /
              ASSISTED_OPERATION_CAPACITY
            ).toFixed(1)
          )
      );

    chartInstance.current = new (
      window as any
    ).Chart(canvasRef.current, {
      type: "line",

      data: {
        labels: SUPPLIER_VOLUMES.map(
          (volume) =>
            formatNumber(volume)
        ),

        datasets: [
          {
            label:
              "Equipe manual — dias úteis",

            data: manualPeriods,

            borderColor: RED,

            backgroundColor:
              "rgba(226,75,74,0.06)",

            pointBackgroundColor:
              RED,

            pointBorderColor: RED,

            pointRadius: 4,

            pointHoverRadius: 7,

            borderWidth: 2,

            fill: false,

            tension: 0.3,
          },
          {
            label:
              "Equipe + Pixel Forge — ciclos",

            data: assistedPeriods,

            borderColor: GREEN,

            backgroundColor:
              "rgba(29,158,117,0.10)",

            pointBackgroundColor:
              GREEN,

            pointBorderColor: GREEN,

            pointRadius: 4,

            pointHoverRadius: 7,

            borderWidth: 2,

            fill: true,

            tension: 0.3,
          },
          {
            label: `Referência de ${REFERENCE_PERIODS} períodos`,

            data: SUPPLIER_VOLUMES.map(
              () => REFERENCE_PERIODS
            ),

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
              title: (
                items: any[]
              ) =>
                `${items[0].label} imagens`,

              label: (
                context: any
              ) => {
                const label =
                  context.dataset
                    .label || "";

                const value =
                  context.raw;

                if (
                  label.startsWith(
                    "Referência"
                  )
                ) {
                  return `Limite de referência: ${REFERENCE_PERIODS} períodos`;
                }

                if (
                  label.includes(
                    "manual"
                  )
                ) {
                  return `Equipe manual: ${formatNumber(
                    value,
                    1
                  )} dias úteis`;
                }

                return `Equipe + Pixel Forge: ${formatNumber(
                  value,
                  1
                )} ciclos operacionais`;
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

              callback: (
                value:
                  | number
                  | string
              ) => `${value}`,
            },

            title: {
              display: true,
              text: "Períodos necessários",
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
    console.error(
      "Erro ao carregar gráfico:",
      error
    );
  });

return () => {
  cancelled = true;

  chartInstance.current?.destroy();

  chartInstance.current = null;
};


}, []);

return <canvas ref={canvasRef} />;
};

/* ───────────────── COMPONENTE PRINCIPAL ───────────────── */

const PixelForgeProductivitySection = () => {
return ( <section
   id="beneficios"
   className="relative flex min-h-screen items-center overflow-hidden py-12"
 > <SectionBackground />


  <div className="container relative z-10 mx-auto w-full px-6">
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Benefícios e resultados esperados
        </p>

        <h2 className="mt-2 text-3xl font-bold text-foreground">
          Mais capacidade, menos{" "}
          <span className="text-gradient-forge">
            esforço repetitivo
          </span>
        </h2>

        <p className="mx-auto mt-2 max-w-3xl text-sm text-muted-foreground">
          Com o apoio do Pixel Forge, a
          equipe amplia a capacidade de
          tratamento sem precisar aumentar
          sua velocidade individual.
        </p>

        <p className="mx-auto mt-2 max-w-3xl text-xs text-muted-foreground">
          Projeção operacional:{" "}
          {TEAM_SIZE} analistas ·{" "}
          {MACHINE_COUNT} máquinas ·{" "}
          {formatNumber(
            PIXEL_FORGE_OVERNIGHT_CAPACITY
          )}{" "}
          imagens processadas durante a noite
        </p>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="flex flex-col gap-1 rounded-2xl border bg-card/60 p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <kpi.icon
                size={14}
                style={{
                  color: PURPLE,
                }}
              />

              <p className="text-xs uppercase text-muted-foreground">
                {kpi.label}
              </p>
            </div>

            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-semibold text-foreground">
                {kpi.value}
              </p>

              <span className="text-xs text-muted-foreground">
                {kpi.unit}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              {kpi.sub}
            </p>

            <span className="mt-1 w-fit rounded-full bg-purple-100 px-2 py-0.5 text-[10px] text-purple-700">
              {kpi.badge}
            </span>
          </div>
        ))}
      </div>

      {/* COMPARATIVO */}
      <div className="rounded-2xl border bg-card/60 p-4 backdrop-blur-sm">
        <div className="mb-2 flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Processo manual × operação
              apoiada pelo Pixel Forge
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Comparação do tempo necessário
              conforme o volume de imagens
              aumenta.
            </p>
          </div>

          <div className="hidden shrink-0 gap-4 text-xs text-muted-foreground sm:flex">
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-sm"
                style={{
                  background: RED,
                }}
              />
              Equipe manual
            </span>

            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-sm"
                style={{
                  background: GREEN,
                }}
              />
              Equipe + Pixel Forge
            </span>

            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-sm"
                style={{
                  background: PURPLE,
                }}
              />
              Referência de 5 períodos
            </span>
          </div>
        </div>

        <div className="h-[245px]">
          <ProductivityComparisonChart />
        </div>

        {/* RESULTADOS DO LOTE DE REFERÊNCIA */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Processo manual
            </p>

            <p
              className="mt-1 text-xl font-semibold"
              style={{
                color: RED,
              }}
            >
              {formatNumber(
                MANUAL_REFERENCE_TIME,
                1
              )}{" "}
              dias
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Equipe integralmente dedicada para
              tratar{" "}
              {formatNumber(
                REFERENCE_VOLUME
              )}{" "}
              imagens.
            </p>
          </div>

          <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Com Pixel Forge
            </p>

            <p
              className="mt-1 text-xl font-semibold"
              style={{
                color: GREEN,
              }}
            >
              {formatNumber(
                ASSISTED_REFERENCE_TIME,
                1
              )}{" "}
              ciclos
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Operação assistida para o mesmo
              volume de{" "}
              {formatNumber(
                REFERENCE_VOLUME
              )}{" "}
              imagens.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Resultado estimado
            </p>

            <p className="mt-1 text-xl font-semibold text-primary">
              {formatNumber(
                TIME_REDUCTION_PERCENT
              )}
              % menos tempo
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Capacidade aproximadamente{" "}
              {formatNumber(
                TEAM_CAPACITY_MULTIPLIER,
                1
              )}
              × maior.
            </p>
          </div>
        </div>

        {/* PREMISSAS */}
        <div className="mt-3 rounded-xl border border-border/70 bg-background/30 px-4 py-2.5">
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            <strong className="text-foreground">
              Premissas:
            </strong>{" "}
            capacidade manual de{" "}
            {formatNumber(
              TEAM_DAILY_CAPACITY
            )}{" "}
            imagens por dia · uma hora destinada
            à revisão ·{" "}
            {formatNumber(
              TEAM_CAPACITY_WITH_REVIEW
            )}{" "}
            imagens tratadas durante o expediente
            ·{" "}
            {formatNumber(
              PIXEL_FORGE_OVERNIGHT_CAPACITY
            )}{" "}
            imagens processadas durante a janela
            noturna.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


);
};

export default PixelForgeProductivitySection;

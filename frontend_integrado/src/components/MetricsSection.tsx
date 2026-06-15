import { useEffect, useRef, useState } from "react";
import {
  Cpu,
  Clock,
  ImageIcon,
  Server,
} from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

const MACHINE_COUNT = 4;
const IMAGES_PER_MACHINE_PER_CYCLE = 500;

const BATCH_DURATION_HOURS = 13.5;
const BATCH_DURATION_LABEL = "13h30";

const BATCH_START = "17h30";
const BATCH_END = "07h00";

const STANDARD_MACHINE = "Intel Core i5 · 8 GB RAM";

const TOTAL_IMAGES_PER_CYCLE =
  MACHINE_COUNT * IMAGES_PER_MACHINE_PER_CYCLE;

const MACHINE_THROUGHPUT_PER_HOUR =
  IMAGES_PER_MACHINE_PER_CYCLE /
  BATCH_DURATION_HOURS;

const TOTAL_THROUGHPUT_PER_HOUR =
  TOTAL_IMAGES_PER_CYCLE /
  BATCH_DURATION_HOURS;

const TIMELINE = [
  { label: "17h30", elapsedHours: 0 },
  { label: "18h", elapsedHours: 0.5 },
  { label: "19h", elapsedHours: 1.5 },
  { label: "20h", elapsedHours: 2.5 },
  { label: "21h", elapsedHours: 3.5 },
  { label: "22h", elapsedHours: 4.5 },
  { label: "23h", elapsedHours: 5.5 },
  { label: "00h", elapsedHours: 6.5 },
  { label: "01h", elapsedHours: 7.5 },
  { label: "02h", elapsedHours: 8.5 },
  { label: "03h", elapsedHours: 9.5 },
  { label: "04h", elapsedHours: 10.5 },
  { label: "05h", elapsedHours: 11.5 },
  { label: "06h", elapsedHours: 12.5 },
  { label: "07h", elapsedHours: 13.5 },
];

const PURPLE = "#7F77DD";

const kpis = [
{
icon: Cpu,
label: "Infraestrutura utilizada",
value: String(MACHINE_COUNT),
unit: "máquinas",
sub: STANDARD_MACHINE,
badge: "Configuração padrão",
},
{
icon: ImageIcon,
label: "Capacidade por ciclo",
value: TOTAL_IMAGES_PER_CYCLE.toLocaleString("pt-BR"),
unit: "imagens",
sub: `${IMAGES_PER_MACHINE_PER_CYCLE} por máquina`,
badge: "Processamento paralelo",
},
{
icon: Clock,
label: "Janela aproveitada",
value: BATCH_DURATION_LABEL,
unit: "de execução",
sub: `${BATCH_START} → ${BATCH_END}`,
badge: "Fora do expediente",
},
{
icon: Server,
label: "Produção média conjunta",
value: Math.round(TOTAL_THROUGHPUT_PER_HOUR).toLocaleString("pt-BR"),
unit: "imagens/hora",
sub: `Cerca de ${Math.round(
      MACHINE_THROUGHPUT_PER_HOUR
    )} imagens/hora por máquina`,
badge: "4 máquinas em paralelo",
},
];

function useInView(
  ref: React.RefObject<HTMLElement>,
  margin = "-100px"
) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: margin,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, margin]);

  return visible;
}

let chartJsPromise: Promise<void> | null = null;

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
      ? "rgba(255,255,255,0.38)"
      : "rgba(0,0,0,0.38)",
  };
}

const OvernightChart = () => {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const chartRef = useRef<any>(null);

  const isVisible = useInView(
    containerRef as React.RefObject<HTMLElement>
  );

  useEffect(() => {
    if (!isVisible || !canvasRef.current) {
      return;
    }

    let cancelled = false;

    loadChartJs()
      .then(() => {
        if (
          cancelled ||
          !canvasRef.current
        ) {
          return;
        }

        chartRef.current?.destroy();

        const { grid, tick } =
          getTheme();

        const productionData =
          TIMELINE.map(
            ({ elapsedHours }) =>
              Math.min(
                Math.round(
                  TOTAL_THROUGHPUT_PER_HOUR *
                    elapsedHours
                ),
                TOTAL_IMAGES_PER_CYCLE
              )
          );

        chartRef.current = new (
          window as any
        ).Chart(canvasRef.current, {
          type: "line",

          data: {
            labels: TIMELINE.map(
              ({ label }) => label
            ),

            datasets: [
              {
                label:
                  "Produção acumulada",

                data: productionData,

                borderColor: PURPLE,

                backgroundColor:
                  "rgba(127,119,221,0.10)",

                pointBackgroundColor:
                  PURPLE,

                pointBorderColor:
                  PURPLE,

                pointRadius: 4,

                pointHoverRadius: 7,

                borderWidth: 2,

                fill: true,

                tension: 0.3,
              },
            ],
          },

          options: {
            responsive: true,

            maintainAspectRatio: false,

            animation: {
              duration: 1200,

              easing: "easeOutQuart",
            },

            layout: {
              padding: {
                top: 24,
                bottom: 20,
                left: 5,
                right: 5,
              },
            },

            interaction: {
              mode: "index",
              intersect: false,
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
                    `Horário: ${items[0].label}`,

                  label: (
                    context: any
                  ) =>
                    ` ${context.parsed.y.toLocaleString(
                      "pt-BR"
                    )} imagens`,
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
                  autoSkip: false,
                  padding: 10,

                  font: {
                    size: 10,
                  },
                },

                title: {
                  display: true,
                  text: "Horário da execução",
                  color: tick,

                  font: {
                    size: 10,
                  },
                },
              },

              y: {
                beginAtZero: true,

                suggestedMax:
                  TOTAL_IMAGES_PER_CYCLE,

                grid: {
                  color: grid,
                },

                ticks: {
                  color: tick,

                  callback: (
                    value:
                      | number
                      | string
                  ) => {
                    const numericValue =
                      Number(value);

                    if (
                      numericValue >= 1000
                    ) {
                      return `${(
                        numericValue / 1000
                      )
                        .toFixed(1)
                        .replace(
                          ".0",
                          ""
                        )}k`;
                    }

                    return numericValue;
                  },
                },

                title: {
                  display: true,
                  text: "Imagens processadas",
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
              id: "pointLabels",

              afterDatasetsDraw(
                chart: any
              ) {
                const { ctx } = chart;

                const meta =
                  chart.getDatasetMeta(0);

                const values =
                  chart.data.datasets[0]
                    .data as number[];

                meta.data.forEach(
                  (
                    point: any,
                    index: number
                  ) => {
                    const isLastPoint =
                      index ===
                      meta.data.length -
                        1;

                    const shouldShow =
                      index % 2 === 0 ||
                      isLastPoint;

                    if (!shouldShow) {
                      return;
                    }

                    const value =
                      values[index];

                    const x = point.x;
                    const y = point.y;

                    ctx.save();

                    ctx.font =
                      "bold 10px sans-serif";

                    ctx.textAlign =
                      "center";

                    ctx.textBaseline =
                      "bottom";

                    const text =
                      value >= 1000
                        ? `${(
                            value / 1000
                          ).toFixed(1)}k`
                        : value.toString();

                    const metrics =
                      ctx.measureText(text);

                    const pillWidth =
                      metrics.width + 8;

                    const pillHeight =
                      14;

                    const pillX =
                      x -
                      pillWidth / 2;

                    const pillY =
                      y -
                      10 -
                      pillHeight;

                    ctx.fillStyle =
                      "rgba(127,119,221,0.15)";

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
                      PURPLE;

                    ctx.fillText(
                      text,
                      x,
                      y - 10
                    );

                    ctx.restore();
                  }
                );
              },
            },
          ],
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

      chartRef.current?.destroy();

      chartRef.current = null;
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="h-[220px]"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

const MetricsSection = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <SectionBackground />

      <div className="relative z-10 w-full container mx-auto px-6 py-8 space-y-5">
        <div className="text-center mx-auto">
          <h2 className="text-3xl font-bold text-foreground">
            Capacidade noturna com{" "}
            <span className="text-gradient-forge">
              Pixel Forge
            </span>
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Quatro máquinas padrão
            processando imagens em paralelo
            fora do horário de trabalho.
          </p>

          <p className="text-xs text-muted-foreground mt-2">
            Janela analisada:{" "}
            {BATCH_START} até {BATCH_END} ·
            sem consumir horas produtivas
            dos analistas
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <kpi.icon
                  size={14}
                  style={{
                    color: PURPLE,
                  }}
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

        <div className="rounded-2xl border bg-card/60 p-5">
          <p className="text-sm font-semibold">
            Produção acumulada durante o
            ciclo noturno
          </p>

          <p className="text-xs text-muted-foreground mb-3">
            Projeção de {MACHINE_COUNT}{" "}
            máquinas operando
            simultaneamente até o início
            do expediente.
          </p>

          <OvernightChart />

          <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-sm text-foreground">
              Ao início do expediente, até{" "}
              <strong>
                {TOTAL_IMAGES_PER_CYCLE.toLocaleString(
                  "pt-BR"
                )}{" "}
                imagens
              </strong>{" "}
              podem estar processadas sem
              consumir o tempo operacional
              dos analistas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;

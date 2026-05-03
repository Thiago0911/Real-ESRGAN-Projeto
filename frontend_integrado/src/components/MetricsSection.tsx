import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Clock, ImageIcon, Server } from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

/* ───────────────── CONFIG ───────────────── */
const MACHINES = 4;
const IMAGES_PER_MACHINE = 500;
const BATCH_HOURS = 13.5;

const pixelForgeDaily = MACHINES * IMAGES_PER_MACHINE;
const pixelForgeHourly = Math.round(pixelForgeDaily / BATCH_HOURS);

const hours = [
  "17h30","18h","19h","20h","21h","22h","23h",
  "00h","01h","02h","03h","04h","05h","06h","07h"
];

const PURPLE = "#7F77DD";

const kpis = [
  {
    icon: Cpu,
    label: "Máquinas",
    value: `${MACHINES}`,
    sub: "Intel i5 · 8GB RAM",
    badge: "Infraestrutura",
  },
  {
    icon: ImageIcon,
    label: "Imagens / máquina",
    value: `${IMAGES_PER_MACHINE}`,
    sub: "Processadas por ciclo",
    badge: "Capacidade",
  },
  {
    icon: Clock,
    label: "Tempo de execução",
    value: `${BATCH_HOURS}h`,
    sub: "17h30 → 07h00",
    badge: "Overnight",
  },
  {
    icon: Server,
    label: "Imagens / hora",
    value: pixelForgeHourly.toLocaleString("pt-BR"),
    sub: "Média durante execução",
    badge: "Throughput",
  },
];

/* ───────────────── HOOK VIEW ───────────────── */
function useInView(ref: any, margin = "-100px") {
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
      { rootMargin: margin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return visible;
}

/* ───────────────── CHART LOADER ───────────────── */
function useChartJs(cb: () => void) {
  useEffect(() => {
    if ((window as any).Chart) return cb();
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    s.onload = cb;
    document.head.appendChild(s);
  }, [cb]);
}

function theme() {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return {
    grid: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
    tick: dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)",
  };
}

/* ───────────────── CHART ───────────────── */
const OvernightChart = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const chartRef = useRef<any>(null);

  const isVisible = useInView(containerRef);

  useChartJs(() => {
    if (!canvasRef.current || !isVisible) return;

    chartRef.current?.destroy();

    const { grid, tick } = theme();

    const data = hours.map((_, i) =>
      Math.min(
        Math.round((pixelForgeDaily / (hours.length - 1)) * i),
        pixelForgeDaily
      )
    );

    chartRef.current = new (window as any).Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: hours,
        datasets: [
          {
            data,
            borderColor: PURPLE,
            backgroundColor: "rgba(127,119,221,0.10)",
            pointBackgroundColor: PURPLE,
            pointRadius: 5,
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
          padding: { top: 24, bottom: 30 },
        },

        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c: any) =>
                ` ${c.parsed.y.toLocaleString("pt-BR")} imagens`,
            },
          },
        },

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
              callback: (v: number) =>
                v >= 1000 ? (v / 1000).toFixed(1) + "k" : v,
            },
            beginAtZero: true,
          },
        },
      },

      plugins: [
        {
          id: "pointLabels",
          afterDatasetsDraw(chart: any) {
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);
            const values = chart.data.datasets[0].data;

            // 🔥 pega progresso da animação
            const progress =
              chart.animator?.currentStep / chart.animator?.numSteps || 1;

            meta.data.forEach((point: any, i: number) => {
              const finalValue = values[i];
              const animatedValue = Math.round(finalValue * progress);

              const x = point.x;
              const y = point.y;

              ctx.save();
              ctx.font = "bold 10px sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "bottom";

              const text =
                animatedValue >= 1000
                  ? (animatedValue / 1000).toFixed(1) + "k"
                  : animatedValue.toString();

              const metrics = ctx.measureText(text);
              const pw = metrics.width + 8;
              const ph = 14;

              const px = x - pw / 2;
              const py = y - 10 - ph;

              // fundo igual ao gráfico manual
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

  useEffect(() => () => chartRef.current?.destroy(), []);

  return (
    <div ref={containerRef} style={{ height: 220 }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

/* ───────────────── COMPONENTE ───────────────── */
const MetricsSection = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <SectionBackground />

      <div className="relative z-10 w-full container mx-auto px-6 py-8 space-y-5">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Produção com <span className="text-gradient-forge">Pixel Forge</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Execução automatizada durante a noite (17h30 → 07h00)
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
        <div className="rounded-2xl border bg-card/60 p-5">
          <p className="text-sm font-semibold">
            Produção acumulada por horário
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Crescimento ao longo da execução
          </p>

          <OvernightChart />
        </div>

      </div>
    </section>
  );
};

export default MetricsSection;
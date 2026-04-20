import { useEffect, useRef } from "react";

const teamMembers = [
  { name: "Thiago", manual: 20 },
  { name: "Raphael", manual: 20 },
  { name: "Rodrigo", manual: 10 },
  { name: "Matheus", manual: 20 },
];

const MACHINES = 4;
const BATCH_HOURS = 13.5;
const IMAGES_PER_MACHINE = 500;
const WORK_HOURS = 8;

const manualHourly = teamMembers.reduce((s, m) => s + m.manual, 0);
const manualDaily = manualHourly * WORK_HOURS;
const pixelForgeDaily = MACHINES * IMAGES_PER_MACHINE;
const pixelForgeHourly = Math.round(pixelForgeDaily / BATCH_HOURS);
const multiplier = (pixelForgeDaily / manualDaily).toFixed(1);

const hours = ["7h","8h","9h","10h","11h","12h","13h","14h","15h","16h","17h","18h","19h","20h"];
const forgeData  = hours.map((_, i) => Math.min(Math.round((pixelForgeDaily / (hours.length - 1)) * i), pixelForgeDaily));
const manualData = hours.map((_, i) => Math.min(Math.round((manualDaily / (WORK_HOURS)) * (i * (BATCH_HOURS / (hours.length - 1)))), manualDaily));

const metrics = [
  { label: "Imgs / hora",  value: pixelForgeHourly.toLocaleString("pt-BR"), sub: `Antes: ${manualHourly}/h`,      badge: `↑ +${Math.round((pixelForgeHourly/manualHourly - 1)*100)}%`, type: "up" },
  { label: "Imgs / dia",   value: pixelForgeDaily.toLocaleString("pt-BR"),  sub: `Antes: ${manualDaily}/dia`,     badge: `↑ +${Math.round((pixelForgeDaily/manualDaily - 1)*100)}%`,  type: "up" },
  { label: "Pessoas",      value: "0",                                       sub: `Antes: ${teamMembers.length} pessoas`, badge: "Automatizado", type: "auto" },
  { label: "Máquinas",     value: String(MACHINES),                          sub: `${IMAGES_PER_MACHINE} imgs cada`, badge: "Overnight",    type: "up" },
];

const MetricsSection = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const loadChart = async () => {
      if (!window.Chart) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
      const tickColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

      chartInstance.current = new window.Chart(chartRef.current, {
        type: "line",
        data: {
          labels: hours,
          datasets: [
            {
              label: "Pixel Forge",
              data: forgeData,
              borderColor: "#7F77DD",
              backgroundColor: "rgba(127,119,221,0.12)",
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: "#7F77DD",
              fill: true,
              tension: 0.35,
            },
            {
              label: "Manual",
              data: manualData,
              borderColor: "#B4B2A9",
              backgroundColor: "rgba(180,178,169,0.07)",
              borderWidth: 1.5,
              pointRadius: 3,
              pointBackgroundColor: "#B4B2A9",
              fill: true,
              tension: 0.35,
              borderDash: [5, 3],
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
                label: (ctx) =>
                  ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString("pt-BR")} imgs`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: tickColor, font: { size: 11 }, autoSkip: false, maxRotation: 0 },
            },
            y: {
              min: 0,
              max: pixelForgeDaily + 100,
              grid: { color: gridColor },
              ticks: {
                color: tickColor,
                font: { size: 11 },
                callback: (v) => (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v),
              },
            },
          },
        },
      });
    };

    loadChart();

    return () => {
      chartInstance.current?.destroy();
    };
  }, []);

  return (
    <section id="impacto" className="relative flex flex-col overflow-hidden">
      <div className="relative flex-1 container mx-auto px-6 py-8 space-y-5">

        {/* Cabeçalho */}
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
            <br />
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl text-foreground">
            Impacto <span className="text-gradient-forge">real no time</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            4 máquinas · processamento overnight de 13,5h · comparado ao processo manual do time
          </p>
        </div>

        {/* Multiplier */}
        <div className="rounded-2xl border border-border bg-card px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
              Ganho de produtividade
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{pixelForgeDaily.toLocaleString("pt-BR")}</span>
              {" "}vs{" "}
              <span className="text-foreground font-medium">{manualDaily}</span>
              {" "}imgs/dia
            </p>
          </div>
          <div className="text-5xl font-bold leading-none" style={{ color: "#7F77DD" }}>
            {multiplier}×
          </div>
        </div>

        {/* Cards 2×2 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-1"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                {m.label}
              </p>
              <p className="text-2xl font-semibold text-foreground leading-none">
                {m.value}
              </p>
              <p className="text-xs text-muted-foreground">{m.sub}</p>
              <span
                className="mt-1 self-start text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={
                  m.type === "auto"
                    ? { background: "#EEEDFE", color: "#3C3489" }
                    : { background: "#E1F5EE", color: "#0F6E56" }
                }
              >
                {m.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Gráfico de área */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Produção acumulada ao longo do dia
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Imagens geradas por hora — manual vs Pixel Forge
              </p>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground items-center">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#7F77DD" }} />
                Pixel Forge
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#B4B2A9" }} />
                Manual
              </span>
            </div>
          </div>

          <div className="relative w-full" style={{ height: 260 }}>
            <canvas ref={chartRef} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default MetricsSection;
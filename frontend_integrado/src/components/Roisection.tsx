import { motion } from "framer-motion";
import { DollarSign, Clock, TrendingUp, Zap } from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

// ─── Base de cálculo ────────────────────────────────────────────────────────
const TEAM_SIZE = 4;

// Custo mensal das alternativas pagas (4 usuários)
const TOOLS_COST = [
  { name: "Pixlr",    monthly: 49.9  * TEAM_SIZE },   // R$ 199,60
  { name: "Picwish",  monthly: 139   * TEAM_SIZE },   // R$ 556,00
  { name: "Claid.ai", monthly: 49 * 5.2 * TEAM_SIZE }, // US$49 → ~R$254,80/user
];
const AVG_TOOL_COST = Math.round(
  TOOLS_COST.reduce((s, t) => s + t.monthly, 0) / TOOLS_COST.length
); // ~R$ 430/mês média

// Horas economizadas
// Manual: analista processa ~70 imgs/h → com IA overnight lote de 500 imgs
// Estimativa: 2h/dia de setup/revisão manual poupadas por analista
const HOURS_SAVED_PER_DAY = 2;
const WORK_DAYS = 22;
const HOURS_SAVED_MONTHLY = HOURS_SAVED_PER_DAY * WORK_DAYS * TEAM_SIZE; // 176h
const HOURLY_RATE = 20; // R$/h médio do time
const LABOR_VALUE_SAVED = HOURS_SAVED_MONTHLY * HOURLY_RATE; // R$ 3.520

const TOTAL_MONTHLY = AVG_TOOL_COST + LABOR_VALUE_SAVED;

const kpis = [
  {
    icon: DollarSign,
    label: "Economia em licenças",
    value: `R$ ${AVG_TOOL_COST.toLocaleString("pt-BR")}`,
    sub: "média vs Pixlr · Picwish · Claid.ai",
    detail: "por mês · 4 usuários",
    color: "#1D9E75",
    bg: "rgba(29,158,117,0.10)",
  },
  {
    icon: Clock,
    label: "Horas poupadas",
    value: `${HOURS_SAVED_MONTHLY}h`,
    sub: `${HOURS_SAVED_PER_DAY}h/dia × ${WORK_DAYS} dias × 4 analistas`,
    detail: "por mês no time inteiro",
    color: "#7F77DD",
    bg: "rgba(127,119,221,0.10)",
  },
  {
    icon: TrendingUp,
    label: "Valor de mão de obra",
    value: `R$ ${LABOR_VALUE_SAVED.toLocaleString("pt-BR")}`,
    sub: `${HOURS_SAVED_MONTHLY}h × R$ ${HOURLY_RATE}/h médio`,
    detail: "liberado para outras tarefas",
    color: "#BA7517",
    bg: "rgba(186,117,23,0.10)",
  },
  {
    icon: Zap,
    label: "Retorno total estimado",
    value: `R$ ${TOTAL_MONTHLY.toLocaleString("pt-BR")}`,
    sub: "licenças + valor de trabalho",
    detail: "por mês · ROI imediato",
    color: "#378ADD",
    bg: "rgba(55,138,221,0.10)",
  },
];

// Barra comparativa: Pixel Forge = R$0 vs concorrentes
const BAR_MAX = TOOLS_COST[2].monthly; // maior custo como referência visual
const bars = [
  { name: "Pixel Forge", cost: 0,                      color: "#1D9E75" },
  { name: "Pixlr",       cost: TOOLS_COST[0].monthly,  color: "#7F77DD" },
  { name: "Picwish",     cost: TOOLS_COST[1].monthly,  color: "#BA7517" },
  { name: "Claid.ai",    cost: TOOLS_COST[2].monthly,  color: "#378ADD" },
];

const ROISection = () => {
  return (
    <section id="roi" className="relative h-screen flex items-center overflow-hidden">
      {/* Background — mesmo padrão da HeroSection */}
      <SectionBackground showOrb={true} imageOpacity={0.2} gridOpacity={0.12} />

      <div className="container relative z-10 mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Retorno sobre o{" "}
            <span className="text-gradient-forge">investimento</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
            Pixel Forge custa R$ 0/mês — veja o que isso representa em economia real para o time PMZ.
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
              className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                  style={{ background: k.bg }}
                >
                  <k.icon size={14} style={{ color: k.color }} />
                </span>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium leading-tight">
                  {k.label}
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-semibold text-foreground leading-none">
                {k.value}
              </p>
              <p className="text-[11px] text-muted-foreground">{k.sub}</p>
              <p className="text-[10px] font-medium mt-1" style={{ color: k.color }}>
                {k.detail}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Gráfico de barras comparativo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5"
        >
          <p className="text-sm font-semibold text-foreground mb-1">
            Custo mensal por ferramenta — 4 usuários
          </p>
          <p className="text-xs text-muted-foreground mb-5">
            Valores em R$. Claid.ai convertido a R$ 5,20/US$.
          </p>

          <div className="space-y-3">
            {bars.map((bar, i) => {
              const pct = bar.cost === 0 ? 2 : Math.round((bar.cost / BAR_MAX) * 100);
              return (
                <motion.div
                  key={bar.name}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm text-foreground w-24 shrink-0">{bar.name}</span>
                  <div className="flex-1 h-7 rounded-lg bg-border/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                      className="h-full rounded-lg flex items-center px-3"
                      style={{ background: bar.cost === 0 ? "#1D9E75" : bar.color, opacity: bar.cost === 0 ? 1 : 0.7 }}
                    />
                  </div>
                  <span
                    className="text-sm font-semibold w-24 text-right shrink-0"
                    style={{ color: bar.cost === 0 ? "#1D9E75" : bar.color }}
                  >
                    {bar.cost === 0 ? "R$ 0" : `R$ ${bar.cost.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Destaque final */}
          <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Economia anual estimada (licenças + mão de obra)
            </p>
            <p className="text-xl font-bold text-gradient-forge whitespace-nowrap">
              R$ {(TOTAL_MONTHLY * 12).toLocaleString("pt-BR")} / ano
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ROISection;
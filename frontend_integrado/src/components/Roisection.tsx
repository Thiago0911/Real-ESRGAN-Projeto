import { motion } from "framer-motion";
import { CalendarDays, DollarSign, TrendingUp, Zap } from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

/* ───────────────── CUSTOS DE REFERÊNCIA ───────────────── */

const PIXEL_FORGE_MONTHLY_LICENSE_COST = 0;
const PIXLR_MONTHLY_LICENSE_COST = 55;
const CLAID_MONTHLY_LICENSE_COST = 275;

const MIN_MONTHLY_SAVINGS =
  PIXLR_MONTHLY_LICENSE_COST - PIXEL_FORGE_MONTHLY_LICENSE_COST;

const MAX_MONTHLY_SAVINGS =
  CLAID_MONTHLY_LICENSE_COST - PIXEL_FORGE_MONTHLY_LICENSE_COST;

const MIN_ANNUAL_SAVINGS = MIN_MONTHLY_SAVINGS * 12;
const MAX_ANNUAL_SAVINGS = MAX_MONTHLY_SAVINGS * 12;

const MIN_THREE_YEAR_SAVINGS = MIN_ANNUAL_SAVINGS * 3;
const MAX_THREE_YEAR_SAVINGS = MAX_ANNUAL_SAVINGS * 3;

const PIXEL_FORGE_ANNUAL_LICENSE_COST = PIXEL_FORGE_MONTHLY_LICENSE_COST * 12;

const PIXLR_ANNUAL_LICENSE_COST = PIXLR_MONTHLY_LICENSE_COST * 12;
const CLAID_ANNUAL_LICENSE_COST = CLAID_MONTHLY_LICENSE_COST * 12;

/* ───────────────── FORMATAÇÃO ───────────────── */

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatCurrencyRange(minimum: number, maximum: number) {
  return `${formatCurrency(minimum)} a ${formatCurrency(maximum)}`;
}

/* ───────────────── KPIS ───────────────── */

const kpis = [
  {
    icon: Zap,
    label: "Licença recorrente",
    value: formatCurrency(PIXEL_FORGE_MONTHLY_LICENSE_COST),
    unit: "/ mês",
    detail: "Sem assinatura ou cobrança por imagem",
    color: "#1D9E75",
    bg: "rgba(29,158,117,0.10)",
  },
  {
    icon: DollarSign,
    label: "Economia mensal",
    value: formatCurrencyRange(MIN_MONTHLY_SAVINGS, MAX_MONTHLY_SAVINGS),
    unit: "/ mês",
    detail: "Custo externo recorrente evitado",
    color: "#7F77DD",
    bg: "rgba(127,119,221,0.10)",
  },
  {
    icon: CalendarDays,
    label: "Economia anual",
    value: formatCurrencyRange(MIN_ANNUAL_SAVINGS, MAX_ANNUAL_SAVINGS),
    unit: "/ ano",
    detail: "Somente economia direta em licenças",
    color: "#378ADD",
    bg: "rgba(55,138,221,0.10)",
  },
  {
    icon: TrendingUp,
    label: "Economia em 3 anos",
    value: formatCurrencyRange(MIN_THREE_YEAR_SAVINGS, MAX_THREE_YEAR_SAVINGS),
    unit: "acumulados",
    detail: "Mantidos os valores de referência",
    color: "#BA7517",
    bg: "rgba(186,117,23,0.10)",
  },
];

/* ───────────────── COMPARAÇÃO ───────────────── */

const bars = [
  {
    name: "Pixel Forge",
    monthlyCost: PIXEL_FORGE_MONTHLY_LICENSE_COST,
    annualCost: PIXEL_FORGE_ANNUAL_LICENSE_COST,
    color: "#1D9E75",
  },
  {
    name: "Pixlr Premium",
    monthlyCost: PIXLR_MONTHLY_LICENSE_COST,
    annualCost: PIXLR_ANNUAL_LICENSE_COST,
    color: "#7F77DD",
  },
  {
    name: "Claid Pro",
    monthlyCost: CLAID_MONTHLY_LICENSE_COST,
    annualCost: CLAID_ANNUAL_LICENSE_COST,
    color: "#378ADD",
  },
];

const BAR_MAX = Math.max(...bars.map((bar) => bar.monthlyCost));

/* ───────────────── COMPONENTE ───────────────── */

const ROISection = () => {
  return (
    <section
      id="roi"
      className="relative min-h-screen min-h-[100svh] overflow-x-hidden py-5 sm:py-6 lg:flex lg:h-[100svh] lg:min-h-[680px] lg:items-center lg:py-4"
    >
      <SectionBackground showOrb imageOpacity={0.2} gridOpacity={0.12} />

      <div className="container relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 lg:gap-3.5">
          {/* CABEÇALHO COMPACTO */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
              Retorno financeiro direto
            </p>

            <h2 className="mt-1.5 text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:whitespace-nowrap lg:text-[2.25rem] xl:text-[2.5rem]">
              Economia recorrente e{" "}
              <span className="text-gradient-forge">retorno operacional</span>
            </h2>

            <p className="mx-auto mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              O Pixel Forge não necessita de licenças e APIs externas, mantendo o
              tratamento das imagens dentro da infraestrutura da PMZ.
            </p>
          </motion.div>

          {/* FAIXA DE KPIS */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="hidden"
          >
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="min-w-0 rounded-xl border border-border bg-card/60 px-3 py-2.5 backdrop-blur-sm"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: kpi.bg }}
                  >
                    <kpi.icon size={14} style={{ color: kpi.color }} />
                  </span>

                  <p className="min-w-0 truncate text-[9px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                    {kpi.label}
                  </p>
                </div>

                <div className="mt-2 flex min-w-0 flex-wrap items-end gap-x-1.5 gap-y-0.5">
                  <p
                    className="break-words text-lg font-bold leading-none sm:text-xl"
                    style={{ color: kpi.color }}
                  >
                    {kpi.value}
                  </p>

                  <span className="text-[9px] text-muted-foreground">
                    {kpi.unit}
                  </span>
                </div>

                <p className="mt-1 truncate text-[9px] text-muted-foreground sm:text-[10px]">
                  {kpi.detail}
                </p>
              </div>
            ))}
          </motion.div>

          {/* ÁREA PRINCIPAL */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.75fr)]"
          >
            {/* COMPARATIVO */}
            <div className="min-w-0 rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-sm sm:p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    Custo recorrente mensal de licenças
                  </p>

                  <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]">
                    Comparação entre o Pixel Forge e as ferramentas externas
                    utilizadas como referência.
                  </p>
                </div>

                <div className="shrink-0 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 sm:text-right">
                  <p className="text-[8px] uppercase tracking-wide text-muted-foreground sm:text-[9px]">
                    Economia mensal
                  </p>

                  <p className="text-xs font-bold text-primary sm:text-sm">
                    {formatCurrencyRange(
                      MIN_MONTHLY_SAVINGS,
                      MAX_MONTHLY_SAVINGS,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {bars.map((bar, index) => {
                  const percentage =
                    bar.monthlyCost === 0
                      ? 0
                      : Math.max(
                          10,
                          Math.round((bar.monthlyCost / BAR_MAX) * 100),
                        );

                  return (
                    <motion.div
                      key={bar.name}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.2 + index * 0.07,
                      }}
                      className="grid min-w-0 grid-cols-1 gap-1.5 sm:grid-cols-[120px_minmax(0,1fr)_120px] sm:items-center sm:gap-3"
                    >
                      <div className="flex min-w-0 items-center justify-between gap-2 sm:block">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                            {bar.name}
                          </p>

                          <p className="truncate text-[9px] text-muted-foreground">
                            {bar.annualCost === 0
                              ? "Sem licença anual"
                              : `${formatCurrency(bar.annualCost)} por ano`}
                          </p>
                        </div>

                        <p
                          className="shrink-0 text-right text-[10px] font-semibold sm:hidden"
                          style={{ color: bar.color }}
                        >
                          {bar.monthlyCost === 0
                            ? "R$ 0"
                            : `${formatCurrency(bar.monthlyCost)}/mês`}
                        </p>
                      </div>

                      <div className="h-6 min-w-0 overflow-hidden rounded-md bg-border/30 sm:h-7">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width:
                              bar.monthlyCost === 0 ? "7px" : `${percentage}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.7,
                            delay: 0.24 + index * 0.07,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-md"
                          style={{
                            background: bar.color,
                            opacity: bar.monthlyCost === 0 ? 1 : 0.78,
                          }}
                        />
                      </div>

                      <p
                        className="hidden text-right text-xs font-semibold sm:block"
                        style={{ color: bar.color }}
                      >
                        {bar.monthlyCost === 0
                          ? "Sem licença"
                          : `${formatCurrency(bar.monthlyCost)}/mês`}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="hidden">
                <div className="rounded-lg bg-background/35 px-3 py-2">
                  <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                    Pixel Forge 
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-green-600 dark:text-green-400">
                    R$ 0/mês
                  </p>
                </div>

                <div className="rounded-lg bg-background/35 px-3 py-2">
                  <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                    Menor economia anual
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-primary">
                    {formatCurrency(MIN_ANNUAL_SAVINGS)}
                  </p>
                </div>

                <div className="rounded-lg bg-background/35 px-3 py-2">
                  <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                    Maior economia anual
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-primary">
                    {formatCurrency(MAX_ANNUAL_SAVINGS)}
                  </p>
                </div>
              </div>
            </div>

            {/* RESUMO LATERAL */}
            <aside className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Economia anual direta
                    </p>
                    <p className="truncate text-sm font-bold text-primary">
                      {formatCurrencyRange(
                        MIN_ANNUAL_SAVINGS,
                        MAX_ANNUAL_SAVINGS,
                      )}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                  Valor que deixa de ser destinado às mensalidades das
                  ferramentas externas avaliadas.
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Acumulado em 3 anos
                    </p>
                    <p className="truncate text-sm font-bold text-amber-700 dark:text-amber-400">
                      {formatCurrencyRange(
                        MIN_THREE_YEAR_SAVINGS,
                        MAX_THREE_YEAR_SAVINGS,
                      )}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                  Projeção mantendo os valores mensais usados no comparativo.
                </p>
              </div>

              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3.5 sm:col-span-2 lg:col-span-1">
                <div className="flex items-start gap-2">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                    <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                      Retorno além da licença
                    </p>
                    <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                      A economia se soma ao processamento noturno, à redução de
                      tarefas repetitivas e à criação de tecnologia própria.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/50 px-3.5 py-3 sm:col-span-2 lg:col-span-1">
                <p className="text-[9px] leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Escopo:</strong>{" "}
                  comparação restrita aos custos recorrentes de licença.
                  Energia, infraestrutura, manutenção, suporte e desenvolvimento
                  interno não estão incluídos.
                </p>
              </div>
            </aside>
          </motion.div>

          {/* OBSERVAÇÃO FINAL */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto max-w-5xl text-center text-[8px] leading-relaxed text-muted-foreground sm:text-[9px]"
          >
            Estimativa baseada nos valores mensais de referência utilizados no
            comparativo. Os valores podem variar conforme plano, câmbio,
            impostos, limites e consumo de créditos.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default ROISection;

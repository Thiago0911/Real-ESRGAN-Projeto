import { motion } from "framer-motion";
import {
CalendarDays,
DollarSign,
TrendingUp,
Zap,
} from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

/* ───────────────── CUSTOS DE REFERÊNCIA ───────────────── */

/*
Os valores abaixo representam apenas os custos
recorrentes de licença utilizados no comparativo.

Não incluem:

* energia;
* manutenção;
* infraestrutura;
* suporte interno;
* horas de desenvolvimento.
  */

const PIXEL_FORGE_MONTHLY_LICENSE_COST = 0;
const PIXLR_MONTHLY_LICENSE_COST = 55;
const CLAID_MONTHLY_LICENSE_COST = 275;

/* ───────────────── ECONOMIA MENSAL ───────────────── */

const MIN_MONTHLY_SAVINGS =
PIXLR_MONTHLY_LICENSE_COST -
PIXEL_FORGE_MONTHLY_LICENSE_COST;

const MAX_MONTHLY_SAVINGS =
CLAID_MONTHLY_LICENSE_COST -
PIXEL_FORGE_MONTHLY_LICENSE_COST;

/* ───────────────── ECONOMIA ANUAL ───────────────── */

const MIN_ANNUAL_SAVINGS =
MIN_MONTHLY_SAVINGS * 12;

const MAX_ANNUAL_SAVINGS =
MAX_MONTHLY_SAVINGS * 12;

/* ───────────────── ECONOMIA EM 3 ANOS ───────────────── */

const MIN_THREE_YEAR_SAVINGS =
MIN_ANNUAL_SAVINGS * 3;

const MAX_THREE_YEAR_SAVINGS =
MAX_ANNUAL_SAVINGS * 3;

/* ───────────────── CUSTOS ANUAIS ───────────────── */

const PIXEL_FORGE_ANNUAL_LICENSE_COST =
PIXEL_FORGE_MONTHLY_LICENSE_COST * 12;

const PIXLR_ANNUAL_LICENSE_COST =
PIXLR_MONTHLY_LICENSE_COST * 12;

const CLAID_ANNUAL_LICENSE_COST =
CLAID_MONTHLY_LICENSE_COST * 12;

/* ───────────────── FORMATAÇÃO ───────────────── */

function formatCurrency(value: number) {
return value.toLocaleString("pt-BR", {
style: "currency",
currency: "BRL",
maximumFractionDigits: 0,
});
}

function formatCurrencyRange(
minimum: number,
maximum: number
) {
return `${formatCurrency(
    minimum
  )} a ${formatCurrency(maximum)}`;
}

/* ───────────────── KPIS ───────────────── */

const kpis = [
{
icon: Zap,
label: "Licença recorrente",
value: formatCurrency(
PIXEL_FORGE_MONTHLY_LICENSE_COST
),
unit: "por mês",
sub: "Sem assinatura, API ou cobrança por imagem",
detail: "Utiliza infraestrutura interna",
color: "#1D9E75",
bg: "rgba(29,158,117,0.10)",
},
{
icon: DollarSign,
label: "Economia mensal potencial",
value: formatCurrencyRange(
MIN_MONTHLY_SAVINGS,
MAX_MONTHLY_SAVINGS
),
unit: "por mês",
sub: "Conforme a alternativa comparada",
detail: "Custo recorrente externo evitado",
color: "#7F77DD",
bg: "rgba(127,119,221,0.10)",
},
{
icon: CalendarDays,
label: "Economia anual potencial",
value: formatCurrencyRange(
MIN_ANNUAL_SAVINGS,
MAX_ANNUAL_SAVINGS
),
unit: "por ano",
sub: "Economia exclusivamente em licenças",
detail: "Sem incluir ganho de produtividade",
color: "#378ADD",
bg: "rgba(55,138,221,0.10)",
},
{
icon: TrendingUp,
label: "Economia em três anos",
value: formatCurrencyRange(
MIN_THREE_YEAR_SAVINGS,
MAX_THREE_YEAR_SAVINGS
),
unit: "acumulados",
sub: "Mantidos os valores de referência",
detail: "Retorno financeiro recorrente",
color: "#BA7517",
bg: "rgba(186,117,23,0.10)",
},
];

/* ───────────────── BARRAS DE COMPARAÇÃO ───────────────── */

const bars = [
{
name: "Pixel Forge",
monthlyCost:
PIXEL_FORGE_MONTHLY_LICENSE_COST,
annualCost:
PIXEL_FORGE_ANNUAL_LICENSE_COST,
color: "#1D9E75",
},
{
name: "Pixlr Premium",
monthlyCost:
PIXLR_MONTHLY_LICENSE_COST,
annualCost:
PIXLR_ANNUAL_LICENSE_COST,
color: "#7F77DD",
},
{
name: "Claid Pro",
monthlyCost:
CLAID_MONTHLY_LICENSE_COST,
annualCost:
CLAID_ANNUAL_LICENSE_COST,
color: "#378ADD",
},
];

const BAR_MAX = Math.max(
...bars.map(
(bar) => bar.monthlyCost
)
);

/* ───────────────── COMPONENTE ───────────────── */

const ROISection = () => {
return ( <section
   id="roi"
   className="relative flex min-h-screen items-center overflow-hidden py-8 sm:py-10"
 > <SectionBackground
     showOrb
     imageOpacity={0.2}
     gridOpacity={0.12}
   />


  <div className="container relative z-10 mx-auto space-y-5 px-6">
    {/* CABEÇALHO */}
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.6,
      }}
      className="mx-auto max-w-4xl text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        ROI para o negócio
      </p>

      <h2 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
        Economia recorrente e{" "}
        <span className="text-gradient-forge">
          retorno operacional
        </span>
      </h2>

      <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Além de ampliar a produtividade, o Pixel
        Forge elimina custos recorrentes de licença,
        créditos e APIs externas para o tratamento
        das imagens.
      </p>

      <p className="mx-auto mt-2 max-w-3xl text-xs text-muted-foreground">
        A análise considera somente a economia
        direta em licenças. Os ganhos de
        produtividade foram apresentados
        separadamente.
      </p>
    </motion.div>

    {/* KPIS */}
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.5,
        delay: 0.1,
      }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="flex flex-col gap-1 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm"
        >
          <div className="mb-1 flex items-center gap-2">
            <span
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: kpi.bg,
              }}
            >
              <kpi.icon
                size={14}
                style={{
                  color: kpi.color,
                }}
              />
            </span>

            <p className="text-[10px] font-medium uppercase leading-tight tracking-wide text-muted-foreground">
              {kpi.label}
            </p>
          </div>

          <div className="flex flex-wrap items-baseline gap-1.5">
            <p className="text-xl font-semibold leading-none text-foreground sm:text-2xl">
              {kpi.value}
            </p>

            <span className="text-[10px] text-muted-foreground">
              {kpi.unit}
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground">
            {kpi.sub}
          </p>

          <p
            className="mt-1 text-[10px] font-medium"
            style={{
              color: kpi.color,
            }}
          >
            {kpi.detail}
          </p>
        </div>
      ))}
    </motion.div>

    {/* COMPARATIVO DE CUSTOS */}
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.5,
        delay: 0.2,
      }}
      className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm"
    >
      <div className="mb-5 flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Custo recorrente mensal de licenças
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Comparação entre assinaturas externas e
            o custo recorrente de licença do Pixel
            Forge.
          </p>
        </div>

        <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-right">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Economia mensal potencial
          </p>

          <p className="text-sm font-semibold text-primary">
            {formatCurrencyRange(
              MIN_MONTHLY_SAVINGS,
              MAX_MONTHLY_SAVINGS
            )}
          </p>
        </div>
      </div>

      {/* BARRAS */}
      <div className="space-y-4">
        {bars.map((bar, index) => {
          const percentage =
            bar.monthlyCost === 0
              ? 0
              : Math.max(
                  10,
                  Math.round(
                    (
                      bar.monthlyCost /
                      BAR_MAX
                    ) * 100
                  )
                );

          return (
            <motion.div
              key={bar.name}
              initial={{
                opacity: 0,
                x: -16,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay:
                  0.25 +
                  index * 0.08,
              }}
              className="grid grid-cols-[135px_1fr_150px] items-center gap-3"
            >
              <div>
                <p className="text-sm text-foreground">
                  {bar.name}
                </p>

                <p className="text-[10px] text-muted-foreground">
                  {bar.annualCost === 0
                    ? "Sem licença anual recorrente"
                    : `${formatCurrency(
                        bar.annualCost
                      )} por ano`}
                </p>
              </div>

              <div className="h-8 overflow-hidden rounded-lg bg-border/30">
                {bar.monthlyCost === 0 ? (
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    whileInView={{
                      width: "8px",
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                      delay:
                        0.3 +
                        index * 0.08,
                    }}
                    className="h-full rounded-lg"
                    style={{
                      background:
                        bar.color,
                    }}
                  />
                ) : (
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    whileInView={{
                      width: `${percentage}%`,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.8,
                      delay:
                        0.3 +
                        index * 0.08,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-lg"
                    style={{
                      background:
                        bar.color,
                      opacity: 0.78,
                    }}
                  />
                )}
              </div>

              <p
                className="text-right text-sm font-semibold"
                style={{
                  color: bar.color,
                }}
              >
                {bar.monthlyCost === 0
                  ? "Sem licença recorrente"
                  : `${formatCurrency(
                      bar.monthlyCost
                    )}/mês`}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* RESULTADO ANUAL */}
      <div className="mt-6 grid grid-cols-1 items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-4 md:grid-cols-[1fr_auto]">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="h-4 w-4 text-primary" />
          </span>

          <div>
            <p className="text-sm font-medium text-foreground">
              Economia anual direta em licenças
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Valor recorrente que deixa de ser
              destinado às mensalidades das
              ferramentas externas avaliadas.
            </p>
          </div>
        </div>

        <p className="whitespace-nowrap text-xl font-bold text-gradient-forge">
          {formatCurrencyRange(
            MIN_ANNUAL_SAVINGS,
            MAX_ANNUAL_SAVINGS
          )}{" "}
          / ano
        </p>
      </div>

      {/* VALOR OPERACIONAL */}
      <div className="mt-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </span>

          <div>
            <p className="text-sm font-medium text-foreground">
              O retorno não se limita à licença
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              A economia financeira se soma ao
              aumento de capacidade, ao
              processamento noturno, à redução de
              tarefas repetitivas e à criação de
              uma tecnologia própria para a PMZ.
            </p>
          </div>
        </div>
      </div>
    </motion.div>

    {/* OBSERVAÇÃO */}
    <motion.p
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.6,
        delay: 0.4,
      }}
      className="mx-auto max-w-4xl text-center text-[10px] leading-relaxed text-muted-foreground"
    >
      Estimativa baseada nos valores mensais de
      referência utilizados no comparativo. Os
      valores podem variar conforme plano, câmbio,
      impostos, limites e consumo de créditos. A
      economia apresentada considera somente
      licenças e APIs externas. O Pixel Forge
      utiliza infraestrutura, energia, manutenção
      e suporte internos.
    </motion.p>
  </div>
</section>


);
};

export default ROISection;

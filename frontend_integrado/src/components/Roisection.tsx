import { motion } from "framer-motion";
import {
CalendarDays,
DollarSign,
TrendingUp,
Zap,
} from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

/* ───────────────── CUSTOS DE LICENÇA ───────────────── */

const PIXEL_FORGE_MONTHLY_COST = 0;
const PIXLR_MONTHLY_COST = 55;
const CLAID_MONTHLY_COST = 275;

const PIXEL_FORGE_ANNUAL_COST =
PIXEL_FORGE_MONTHLY_COST * 12;

const PIXLR_ANNUAL_COST =
PIXLR_MONTHLY_COST * 12;

const CLAID_ANNUAL_COST =
CLAID_MONTHLY_COST * 12;

const MIN_MONTHLY_SAVINGS =
PIXLR_MONTHLY_COST -
PIXEL_FORGE_MONTHLY_COST;

const MAX_MONTHLY_SAVINGS =
CLAID_MONTHLY_COST -
PIXEL_FORGE_MONTHLY_COST;

const MIN_ANNUAL_SAVINGS =
PIXLR_ANNUAL_COST -
PIXEL_FORGE_ANNUAL_COST;

const MAX_ANNUAL_SAVINGS =
CLAID_ANNUAL_COST -
PIXEL_FORGE_ANNUAL_COST;

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
const formattedMaximum = formatCurrency(
maximum
)
.replace("R$", "")
.trim();

return `${formatCurrency(
    minimum
  )}–${formattedMaximum}`;
}

/* ───────────────── KPIs ───────────────── */

const kpis = [
{
icon: Zap,
label: "Pixel Forge",
value: formatCurrency(
PIXEL_FORGE_MONTHLY_COST
),
unit: "por mês",
sub: "Sem mensalidade de licença ou API",
detail:
"Utiliza a infraestrutura interna",
color: "#1D9E75",
bg: "rgba(29,158,117,0.10)",
},
{
icon: DollarSign,
label: "Licença Pixlr",
value: formatCurrency(
PIXLR_MONTHLY_COST
),
unit: "por mês",
sub: `${formatCurrency(
      PIXLR_ANNUAL_COST
    )} por ano`,
detail:
"Mensalidade evitada com o Pixel Forge",
color: "#7F77DD",
bg: "rgba(127,119,221,0.10)",
},
{
icon: DollarSign,
label: "Licença Claid",
value: formatCurrency(
CLAID_MONTHLY_COST
),
unit: "por mês",
sub: `${formatCurrency(
      CLAID_ANNUAL_COST
    )} por ano`,
detail:
"Mensalidade evitada com o Pixel Forge",
color: "#378ADD",
bg: "rgba(55,138,221,0.10)",
},
{
icon: TrendingUp,
label: "Economia direta",
value: formatCurrencyRange(
MIN_ANNUAL_SAVINGS,
MAX_ANNUAL_SAVINGS
),
unit: "por ano",
sub: "Conforme a ferramenta comparada",
detail:
"Economia exclusivamente em licenças",
color: "#BA7517",
bg: "rgba(186,117,23,0.10)",
},
];

/* ───────────────── BARRAS MENSAIS ───────────────── */

const bars = [
{
name: "Pixel Forge",
monthlyCost:
PIXEL_FORGE_MONTHLY_COST,
annualCost:
PIXEL_FORGE_ANNUAL_COST,
color: "#1D9E75",
},
{
name: "Pixlr Premium",
monthlyCost: PIXLR_MONTHLY_COST,
annualCost: PIXLR_ANNUAL_COST,
color: "#7F77DD",
},
{
name: "Claid Pro",
monthlyCost: CLAID_MONTHLY_COST,
annualCost: CLAID_ANNUAL_COST,
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
   className="relative h-screen flex items-center overflow-hidden"
 > <SectionBackground
     showOrb
     imageOpacity={0.2}
     gridOpacity={0.12}
   />


  <div className="container relative z-10 mx-auto px-6 py-7 space-y-6">
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
      className="text-center"
    >
      <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
        Economia direta em{" "}
        <span className="text-gradient-forge">
          licenças
        </span>
      </h2>

      <p className="mt-3 text-base text-muted-foreground max-w-2xl mx-auto">
        O Pixel Forge elimina a
        necessidade de mensalidades
        ou créditos externos para o
        processamento das imagens.
      </p>
    </motion.div>

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
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
    >
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
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

            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium leading-tight">
              {kpi.label}
            </p>
          </div>

          <div className="flex items-baseline gap-1.5 flex-wrap">
            <p className="text-xl sm:text-2xl font-semibold text-foreground leading-none">
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
            className="text-[10px] font-medium mt-1"
            style={{
              color: kpi.color,
            }}
          >
            {kpi.detail}
          </p>
        </div>
      ))}
    </motion.div>

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
      className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5"
    >
      <div className="flex items-start justify-between gap-6 mb-5">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Custo mensal das
            ferramentas comparadas
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            Comparação direta entre a
            mensalidade do Pixel
            Forge e as alternativas
            avaliadas.
          </p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-right shrink-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Economia mensal
          </p>

          <p className="text-sm font-semibold text-primary">
            {formatCurrencyRange(
              MIN_MONTHLY_SAVINGS,
              MAX_MONTHLY_SAVINGS
            )}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {bars.map((bar, index) => {
          const percentage =
            bar.monthlyCost === 0
              ? 3
              : Math.max(
                  10,
                  Math.round(
                    (bar.monthlyCost /
                      BAR_MAX) *
                      100
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
              className="grid grid-cols-[135px_1fr_115px] items-center gap-3"
            >
              <div>
                <p className="text-sm text-foreground">
                  {bar.name}
                </p>

                <p className="text-[10px] text-muted-foreground">
                  {formatCurrency(
                    bar.annualCost
                  )}{" "}
                  por ano
                </p>
              </div>

              <div className="h-8 rounded-lg bg-border/30 overflow-hidden">
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
                    opacity:
                      bar.monthlyCost ===
                      0
                        ? 1
                        : 0.75,
                  }}
                />
              </div>

              <p
                className="text-sm font-semibold text-right"
                style={{
                  color: bar.color,
                }}
              >
                {formatCurrency(
                  bar.monthlyCost
                )}
                /mês
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 shrink-0">
            <CalendarDays className="h-4 w-4 text-primary" />
          </span>

          <div>
            <p className="text-sm font-medium text-foreground">
              Economia anual direta
              em licenças
            </p>

            <p className="text-[11px] text-muted-foreground mt-1">
              Valor que deixa de ser
              gasto com mensalidades
              de ferramentas externas.
            </p>
          </div>
        </div>

        <p className="text-xl font-bold text-gradient-forge whitespace-nowrap">
          {formatCurrencyRange(
            MIN_ANNUAL_SAVINGS,
            MAX_ANNUAL_SAVINGS
          )}{" "}
          / ano
        </p>
      </div>
    </motion.div>

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
      className="text-[10px] text-center text-muted-foreground max-w-4xl mx-auto"
    >
      Comparação baseada nos valores
      mensais de referência de{" "}
      {formatCurrency(
        PIXLR_MONTHLY_COST
      )}{" "}
      para o Pixlr e{" "}
      {formatCurrency(
        CLAID_MONTHLY_COST
      )}{" "}
      para o Claid. A economia
      apresentada considera somente
      mensalidades de licença e não
      inclui infraestrutura, energia,
      manutenção ou suporte interno
      do Pixel Forge.
    </motion.p>
  </div>
</section>


);
};

export default ROISection;

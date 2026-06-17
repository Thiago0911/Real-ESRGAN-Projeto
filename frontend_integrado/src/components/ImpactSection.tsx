import { motion } from "framer-motion";
import {
BarChart3,
Flame,
Gauge,
Rocket,
ShieldCheck,
ShoppingCart,
Sparkles,
Timer,
Workflow,
} from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

/* ───────────────── INDICADORES ───────────────── */

const MANUAL_TEAM_CAPACITY = 640;
const ASSISTED_TEAM_CAPACITY = 2560;

const REFERENCE_VOLUME = 3500;
const TIME_REDUCTION_PERCENT = 75;

const CAPACITY_MULTIPLIER =
ASSISTED_TEAM_CAPACITY /
MANUAL_TEAM_CAPACITY;

const MANUAL_REFERENCE_TIME =
REFERENCE_VOLUME /
MANUAL_TEAM_CAPACITY;

const ASSISTED_REFERENCE_TIME =
REFERENCE_VOLUME /
ASSISTED_TEAM_CAPACITY;

function formatNumber(
value: number,
maximumFractionDigits = 0
) {
return value.toLocaleString("pt-BR", {
maximumFractionDigits,
});
}

/* ───────────────── IMPACTOS ───────────────── */

const cards = [
{
icon: Gauge,
metric: `${formatNumber(
      CAPACITY_MULTIPLIER,
      1
    )}×`,
title: "Mais capacidade operacional",
desc: `${formatNumber(
      MANUAL_TEAM_CAPACITY
    )} imagens manuais por dia → ${formatNumber(
      ASSISTED_TEAM_CAPACITY
    )} imagens por ciclo operacional`,
color: "#378ADD",
bg: "rgba(55,138,221,0.10)",
},
{
icon: Timer,
metric: `-${TIME_REDUCTION_PERCENT}%`,
title: "Menor prazo estimado",
desc: `${formatNumber(
      MANUAL_REFERENCE_TIME,
      1
    )} dias → ${formatNumber(
      ASSISTED_REFERENCE_TIME,
      1
    )} ciclos para ${formatNumber(
      REFERENCE_VOLUME
    )} imagens`,
color: "#7F77DD",
bg: "rgba(127,119,221,0.10)",
},
{
icon: ShieldCheck,
metric: "IA local",
title: "Controle e independência",
desc: "Processamento interno, sem dependência de APIs, créditos ou envio das imagens para serviços externos",
color: "#BA7517",
bg: "rgba(186,117,23,0.10)",
},
{
icon: ShoppingCart,
metric: "Cliente",
title: "Melhor jornada de compra",
desc: "Imagens mais nítidas, padronizadas e confiáveis para apoiar a decisão de compra",
color: "#1D9E75",
bg: "rgba(29,158,117,0.10)",
},
];

/* ───────────────── PRÓXIMOS PASSOS ───────────────── */

const nextSteps = [
{
icon: Rocket,
title: "Executar piloto controlado",
description:
"Aplicar o Pixel Forge em um lote real do catálogo PMZ.",
},
{
icon: BarChart3,
title: "Medir os resultados",
description:
"Validar tempo, capacidade, qualidade e taxa de aprovação das imagens.",
},
{
icon: Workflow,
title: "Escalar a operação",
description:
"Expandir gradualmente o uso e avaliar integrações com catálogo e marketing.",
},
];

/* ───────────────── COMPONENTE ───────────────── */

const ImpactSection = () => {
return ( <div className="relative flex min-h-screen flex-col overflow-hidden py-8 sm:py-12"> <SectionBackground
     showOrb={false}
     imageOpacity={0.2}
     gridOpacity={0.1}
   />


  <section
    id="impacto"
    className="relative z-10 flex flex-1 items-center py-6 sm:py-8"
  >
    <div className="container mx-auto px-4 sm:px-6">
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
        className="mx-auto mb-6 max-w-4xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Encerramento
        </p>

        <h2 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
          Por que o Pixel Forge{" "}
          <span className="text-gradient-forge">
            merece destaque?
          </span>
        </h2>

        <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Porque transforma inteligência artificial
          em capacidade operacional própria,
          conectando inovação, produtividade,
          controle e valor para o cliente PMZ.
        </p>
      </motion.div>

      {/* CARDS DE IMPACTO */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item, index) => (
          <motion.div
            key={item.title}
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
              duration: 0.5,
              delay: index * 0.08,
            }}
            className="relative rounded-2xl border border-border bg-card/60 p-5 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/30"
          >
            <span
              className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: item.bg,
                color: item.color,
              }}
            >
              <item.icon className="h-5 w-5" />
            </span>

            <p
              className="mt-3 text-2xl font-bold"
              style={{
                color: item.color,
              }}
            >
              {item.metric}
            </p>

            <h3 className="mt-1.5 text-sm font-semibold text-foreground">
              {item.title}
            </h3>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* PRÓXIMOS PASSOS */}
      <motion.div
        initial={{
          opacity: 0,
          y: 18,
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
          delay: 0.25,
        }}
        className="mt-5 rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm"
      >
        <div className="mb-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Próximos passos
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Evoluir o protótipo funcional para uma
            capacidade validada na operação.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {nextSteps.map(
            (step, index) => (
              <motion.div
                key={step.title}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay:
                    0.3 +
                    index * 0.08,
                }}
                className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/30 px-4 py-3"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {step.title}
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* MENSAGEM FINAL */}
      <motion.div
        initial={{
          opacity: 0,
          y: 18,
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
          delay: 0.4,
        }}
        className="mt-5 rounded-2xl border border-primary/25 bg-primary/5 px-6 py-5 text-center"
      >
        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Nossa mensagem final
          </p>
        </div>

        <p className="mx-auto max-w-5xl text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
          O Pixel Forge merece destaque porque não
          é apenas uma ferramenta de tratamento de
          imagens. Ele transforma IA em{" "}
          <span className="text-gradient-forge">
            produtividade real, capacidade
            tecnológica própria e melhoria contínua
            para o catálogo e para a jornada de
            compra PMZ.
          </span>
        </p>

        <p className="mx-auto mt-3 max-w-4xl text-xs leading-relaxed text-muted-foreground">
          Mais escala sem exigir mais velocidade da
          equipe, mais controle sem dependência
          externa e mais qualidade visual para o
          cliente.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          <Flame className="h-3.5 w-3.5" />
          Protótipo funcional pronto para piloto
        </div>
      </motion.div>
    </div>
  </section>

  {/* RODAPÉ */}
  <footer className="relative z-10 border-t border-border/20 py-3">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-forge-gradient">
            <Flame className="h-3.5 w-3.5 text-primary-foreground" />
          </div>

          <span className="font-display text-sm font-bold tracking-tight">
            PIXEL{" "}
            <span className="text-gradient-forge">
              FORGE
            </span>
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          Projeto interno PMZ · Hackathon 2026
        </p>
      </div>
    </div>
  </footer>
</div>


);
};

export default ImpactSection;

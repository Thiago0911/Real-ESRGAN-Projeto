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
  ASSISTED_TEAM_CAPACITY / MANUAL_TEAM_CAPACITY;

const MANUAL_REFERENCE_TIME =
  REFERENCE_VOLUME / MANUAL_TEAM_CAPACITY;

const ASSISTED_REFERENCE_TIME =
  REFERENCE_VOLUME / ASSISTED_TEAM_CAPACITY;

function formatNumber(value: number, maximumFractionDigits = 0) {
  return value.toLocaleString("pt-BR", {
    maximumFractionDigits,
  });
}

/* ───────────────── IMPACTOS ───────────────── */

const cards = [
  {
    icon: Gauge,
    metric: `${formatNumber(CAPACITY_MULTIPLIER, 1)}×`,
    title: "Mais capacidade operacional",
    desc: `${formatNumber(
      MANUAL_TEAM_CAPACITY,
    )} manuais/dia → ${formatNumber(
      ASSISTED_TEAM_CAPACITY,
    )} por ciclo`,
    color: "#378ADD",
    bg: "rgba(55,138,221,0.10)",
  },
  {
    icon: Timer,
    metric: `-${TIME_REDUCTION_PERCENT}%`,
    title: "Menor prazo estimado",
    desc: `${formatNumber(
      MANUAL_REFERENCE_TIME,
      1,
    )} dias → ${formatNumber(
      ASSISTED_REFERENCE_TIME,
      1,
    )} ciclos`,
    color: "#7F77DD",
    bg: "rgba(127,119,221,0.10)",
  },
  {
    icon: ShieldCheck,
    metric: "IA local",
    title: "Controle e independência",
    desc: "Sem APIs, créditos ou envio externo das imagens.",
    color: "#BA7517",
    bg: "rgba(186,117,23,0.10)",
  },
  {
    icon: ShoppingCart,
    metric: "Mais confiança",
    title: "Melhor jornada de compra",
    desc: "Imagens mais nítidas, padronizadas e confiáveis.",
    color: "#1D9E75",
    bg: "rgba(29,158,117,0.10)",
  },
];

/* ───────────────── PRÓXIMOS PASSOS ───────────────── */

const nextSteps = [
  {
    icon: Rocket,
    title: "Executar piloto controlado",
    description: "Aplicar o Pixel Forge em um lote real do catálogo PMZ.",
  },
  {
    icon: BarChart3,
    title: "Medir os resultados",
    description:
      "Validar tempo, capacidade, qualidade e taxa de aprovação.",
  },
  {
    icon: Workflow,
    title: "Escalar a operação",
    description:
      "Expandir o uso e avaliar integrações com catálogo e marketing.",
  },
];

/* ───────────────── COMPONENTE ───────────────── */

const ImpactSection = () => {
  return (
    <section
      id="impacto"
      className="relative min-h-screen min-h-[100svh] w-full overflow-x-hidden"
    >
      <SectionBackground
        showOrb={false}
        imageOpacity={0.2}
        gridOpacity={0.1}
      />

      <div className="container relative z-10 mx-auto flex min-h-screen min-h-[100svh] w-full max-w-7xl flex-col px-4 sm:px-6">
        <main className="flex flex-1 items-center py-4 sm:py-5 lg:py-4">
          <div className="w-full min-w-0 space-y-3 sm:space-y-4">
            {/* CABEÇALHO COMPACTO */}
            <motion.header
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-4xl text-center"
            >
              <h2 className="mt-1.5 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                Pixel Forge:{" "}
                <span className="text-gradient-forge">
                  Inovação pronta para gerar impacto
                </span>
              </h2>

              <p className="mx-auto mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Porque transforma inteligência artificial em capacidade
                operacional própria, conectando produtividade, controle e valor
                para o cliente PMZ.
              </p>
            </motion.header>

            {/* INDICADORES EM FAIXA ÚNICA */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-4"
            >
              {cards.map((item) => (
                <article
                  key={item.title}
                  className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-card/60 p-3 backdrop-blur-sm"
                >
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: item.bg,
                      color: item.color,
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <p
                        className="text-lg font-bold leading-none sm:text-xl"
                        style={{ color: item.color }}
                      >
                        {item.metric}
                      </p>

                      <h3 className="text-[11px] font-semibold leading-tight text-foreground">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-1 break-words text-[10px] leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </article>
              ))}
            </motion.div>

            {/* CONTEÚDO PRINCIPAL EM DUAS COLUNAS */}
            <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
              {/* MENSAGEM FINAL */}
              <motion.section
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="flex min-w-0 flex-col justify-center rounded-2xl border border-primary/25 bg-primary/5 px-4 py-4 sm:px-5"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-primary" />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-xs">
                    Nossa mensagem final
                  </p>
                </div>

                <p className="mt-2 text-base font-semibold leading-relaxed text-foreground sm:text-lg">
                  O Pixel Forge transforma inteligência artificial em capacidade operacional própria,{" "}
                  <span className="text-gradient-forge">
                    qualidade para o catálogo e valor real para o negócio.
                  </span>
                </p>

                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                  Mais escala para a operação. Mais qualidade para o cliente. Mais resultado para a PMZ.
                </p>

                <div className="mt-3 inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary">
                  <Flame className="h-3.5 w-3.5 shrink-0" />
                  <span className="break-words">
                    Protótipo funcional pronto para piloto
                  </span>
                </div>
              </motion.section>

              {/* PRÓXIMOS PASSOS */}
              <motion.aside
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="min-w-0 rounded-2xl border border-border bg-card/55 p-4 backdrop-blur-sm"
              >
                <div className="mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-xs">
                    Próximos passos
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    Do protótipo funcional para a operação real.
                  </p>
                </div>

                <div className="space-y-2">
                  {nextSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.35,
                        delay: 0.24 + index * 0.06,
                      }}
                      className="flex min-w-0 items-start gap-3 rounded-xl border border-border/70 bg-background/30 px-3 py-2.5"
                    >
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <step.icon className="h-4 w-4" />
                      </span>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-foreground">
                          {step.title}
                        </p>

                        <p className="mt-0.5 break-words text-[10px] leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.aside>
            </div>
          </div>
        </main>

        {/* RODAPÉ COMPACTO */}
        <footer className="border-t border-border/20 py-2.5">
          <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-forge-gradient">
                <Flame className="h-3 w-3 text-primary-foreground" />
              </div>

              <span className="font-display text-xs font-bold tracking-tight">
                PIXEL <span className="text-gradient-forge">FORGE</span>
              </span>
            </div>

            <p className="text-[10px] text-muted-foreground sm:text-xs">
              Grupo PMZ · Hackathon 2026
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default ImpactSection;

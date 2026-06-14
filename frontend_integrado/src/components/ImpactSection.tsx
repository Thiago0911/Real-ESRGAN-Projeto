import { motion } from "framer-motion";
import {
ArrowRight,
Flame,
Gauge,
ShoppingCart,
Sparkles,
Timer,
} from "lucide-react";
import { INTERNAL_APP_URL } from "@/lib/links";
import SectionBackground from "@/components/ui/SectionBackground";

const MANUAL_TEAM_CAPACITY = 640;
const ASSISTED_TEAM_CAPACITY = 2560;
const TIME_REDUCTION_PERCENT = 75;

const CAPACITY_MULTIPLIER =
ASSISTED_TEAM_CAPACITY / MANUAL_TEAM_CAPACITY;

function formatNumber(value: number) {
return value.toLocaleString("pt-BR");
}

const cards = [
{
icon: Gauge,
metric: `${CAPACITY_MULTIPLIER}×`,
title: "Mais capacidade",
desc: `${formatNumber(MANUAL_TEAM_CAPACITY)} → ${formatNumber(
      ASSISTED_TEAM_CAPACITY
    )} imagens por ciclo`,
color: "#378ADD",
bg: "rgba(55,138,221,0.10)",
},
{
icon: Timer,
metric: `-${TIME_REDUCTION_PERCENT}%`,
title: "Menos esforço repetitivo",
desc: "Mais tempo para análise, revisão e evolução do catálogo",
color: "#7F77DD",
bg: "rgba(127,119,221,0.10)",
},
{
icon: Sparkles,
metric: "Pós-go-live",
title: "Melhoria contínua",
desc: "Evolução da qualidade visual para e-commerce e marketing",
color: "#BA7517",
bg: "rgba(186,117,23,0.10)",
},
{
icon: ShoppingCart,
metric: "Cliente",
title: "Melhor jornada de compra",
desc: "Mais clareza, consistência e confiança na decisão de compra",
color: "#1D9E75",
bg: "rgba(29,158,117,0.10)",
},
];

const ImpactSection = () => {
const handleCTA = () => {
window.location.href = INTERNAL_APP_URL;
};

return ( <div className="relative flex h-screen flex-col overflow-hidden"> <SectionBackground
     showOrb={false}
     imageOpacity={0.2}
     gridOpacity={0.1}
   />


  <section
    id="impacto"
    className="relative z-10 flex flex-1 items-center"
  >
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-9 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Impacto para a PMZ
        </p>

        <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
          O que a PMZ{" "}
          <span className="text-gradient-forge">
            ganha?
          </span>
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
          Mais escala no pós-go-live, evolução contínua do catálogo e uma
          jornada de compra cada vez melhor.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
            }}
            className="relative rounded-2xl border border-border bg-card/60 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/30"
          >
            <span
              className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: item.bg,
                color: item.color,
              }}
            >
              <item.icon className="h-5 w-5" />
            </span>

            <p
              className="mt-4 text-2xl font-bold"
              style={{ color: item.color }}
            >
              {item.metric}
            </p>

            <h3 className="mt-2 text-base font-semibold">
              {item.title}
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          delay: 0.3,
        }}
        className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5 text-center"
      >
        <p className="text-xl font-semibold text-foreground">
          O Pixel Forge cria uma base de{" "}
          <span className="text-gradient-forge">
            melhoria contínua para o e-commerce, o marketing e a jornada de
            compra PMZ.
          </span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: 0.4,
        }}
        className="mt-8 flex flex-col items-center"
      >
        <p className="mb-3 text-sm text-muted-foreground">
          Agora, veja o Pixel Forge funcionando na prática.
        </p>

        <button
          type="button"
          onClick={handleCTA}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-forge-gradient px-8 text-base font-semibold text-primary-foreground glow-forge transition-all hover:scale-[1.02] hover:brightness-110"
        >
          Iniciar demonstração
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    </div>
  </section>

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

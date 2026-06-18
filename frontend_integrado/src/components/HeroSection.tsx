import { motion } from "framer-motion";
import {
  Cpu,
  Images,
  Sparkles,
  ZoomIn,
} from "lucide-react";

import heroBg from "@/assets/hero-bg.jpg";
import Typewriter from "@/components/ui/typewriter";

const highlights = [
  {
    icon: ZoomIn,
    value: "Resolução 4x",
    label: "Mais nitidez",
  },
  {
    icon: Images,
    value: "Processamento em lote",
    label: "Mais produtividade",
  },
  {
    icon: Cpu,
    value: "100% local",
    label: "Segurança e controle",
  },
];

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-8 sm:px-6 lg:py-10">
      {/* Background */}
      <div className="absolute inset-0 w-full">
        <img
          src={heroBg}
          alt="Pixel Forge background"
          className="absolute inset-0 block h-full w-full object-fill opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[110px] sm:h-[520px] sm:w-[520px]"
      />

      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto flex max-w-5xl flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium text-primary sm:text-sm"
          >
            <Sparkles className="h-4 w-4 shrink-0" />

            <span>
              IA local para acelerar e padronizar o catálogo PMZ
            </span>
          </motion.div>

          {/* Nome do projeto */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-primary sm:text-base"
          >
           {/* Pixel Forge */}
          </motion.p>

          {/* Título */}
          <h1 className="w-full max-w-5xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="block">
              Qualidade visual em escala
            </span>

            {/* Altura mínima evita que a tela pule */}
            <span className="mt-2 flex min-h-[2.35em] items-start justify-center sm:min-h-[1.25em]">
              <Typewriter
                words={[
                  "Catálogo no padrão PMZ",
                  "Processamento local com IA",
                  "Mais capacidade operacional",
                ]}
                className="text-gradient-forge block max-w-full text-center"
                cursorClassName="animate-pulse"
                typingSpeedMs={65}
                deletingSpeedMs={30}
                pauseMs={1800}
              />
            </span>
          </h1>

          {/* Descrição */}
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
            Uma solução que aumenta a resolução, remove fundos e processa
            imagens em lote, reduzindo tarefas manuais e acelerando a evolução
            da qualidade visual do catálogo.
          </p>

          {/* Diferenciais */}
          <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-7 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {highlights.map(({ icon: Icon, value, label }) => (
            <div
              key={value}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 p-4 text-left backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="whitespace-nowrap font-display text-sm font-bold leading-tight text-gradient-forge lg:text-base xl:text-lg">
                  {value}
                </div>

                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

          {/* Equipe */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-6 text-xs text-muted-foreground sm:text-sm"
          >
            <span className="font-medium text-foreground">
            </span>{" "}
            Theed Wilk • E-commerce
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
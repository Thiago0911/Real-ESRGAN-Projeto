import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import Typewriter from "@/components/ui/typewriter";
import { INTERNAL_APP_URL } from "@/lib/links";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Pixel Forge background"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary"
          >
            <Sparkles className="h-4 w-4" />
            IA local para acelerar e padronizar o catálogo PMZ
          </motion.div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">Qualidade visual em escala</span>
            <Typewriter
              words={["Catálogo no padrão PMZ", "Processamento local com IA", "Mais capacidade operacional"]}
              className="text-gradient-forge block whitespace-nowrap md:whitespace-normal"
              cursorClassName="animate-pulse"
              typingSpeedMs={70}
              deletingSpeedMs={40}
              pauseMs={900}
            />
          </h1>

          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Uma solução de IA local que aumenta a resolução, remove fundos e processa imagens em lote,
            reduzindo tarefas manuais e acelerando a evolução contínua da qualidade visual do catálogo.
          </p>

          {/*
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={INTERNAL_APP_URL}>
              <button className="inline-flex items-center justify-center h-14 px-10 rounded-xl text-lg font-semibold bg-forge-gradient text-primary-foreground glow-forge hover:brightness-110 transition-all gap-2">
                Ver Mais
                <ArrowRight className="h-5 w-5" />
              </button>
            </a>

            <a href="#impacto">
              <button className="inline-flex items-center justify-center h-14 px-10 rounded-xl text-lg font-medium border border-border bg-secondary/50 text-secondary-foreground hover:bg-secondary transition-all gap-2">
                <Zap className="h-5 w-5" />
                Ver impacto
              </button>
            </a>
          </div>
          */}

          {/* Diferenciais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {[
              { value: "Resolução 4x", label: "Mais nitidez para destaque do produto." },
              { value: "Processamento em lote", label: "Mais escala operacional." },
              { value: "100% local", label: "Mais privacidade, controle e segurança para a operação." },
           // { value: "Remoção de Fundo", label: "Remova fundos automaticamente com recorte preciso de bordas." },
           // { value: "Privacidade e controle", label: "As imagens não saem da máquina — mais segurança para dados internos." },
           // { value: "Mais conversão", label: "Imagens melhores geram confiança" },
           // { value: "Padrão PMZ", label: "Consistência visual no e-commerce" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-card/40 p-4">
                <div className="text-xl font-bold font-display text-gradient-forge">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
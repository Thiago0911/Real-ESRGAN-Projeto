import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

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
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary"
          >
            <Sparkles className="h-4 w-4" />
            Potencializado por IA de última geração
          </motion.div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Transforme pixels em{" "}
            <span className="text-gradient-forge">obras-primas</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Aumente a resolução, remova fundos e otimize suas imagens com 
            inteligência artificial. Qualidade profissional em poucos cliques.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <button className="inline-flex items-center justify-center h-14 px-10 rounded-xl text-lg font-semibold bg-forge-gradient text-primary-foreground glow-forge hover:brightness-110 transition-all gap-2">
                Começar Gratuitamente
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <a href="#demo">
              <button className="inline-flex items-center justify-center h-14 px-10 rounded-xl text-lg font-medium border border-border bg-secondary/50 text-secondary-foreground hover:bg-secondary transition-all gap-2">
                <Zap className="h-5 w-5" />
                Ver Demo
              </button>
            </a>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: "10M+", label: "Imagens processadas" },
              { value: "8x", label: "Upscaling máximo" },
              { value: "<3s", label: "Tempo médio" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold font-display text-gradient-forge">{stat.value}</div>
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

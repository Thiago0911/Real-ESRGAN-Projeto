import { motion } from "framer-motion";
import { ImageUp, Scissors, Layers, Download, Sparkles, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: ImageUp,
    title: "Upscaling com IA",
    description: "Aumente a resolução 4x mantendo a nitidez e detalhes perfeitos.",
  },
  {
    icon: Scissors,
    title: "Remoção de Fundo",
    description: "Remova fundos automaticamente com recorte preciso de bordas e cabelo.",
  },
  {
    icon: Layers,
    title: "Processamento em Lote",
    description: "Processe centenas de imagens de uma vez com presets customizáveis.",
  },
  {
    icon: Download,
    title: "Exportação Inteligente",
    description: "Exporte otimizado para e-commerce, redes sociais ou impressão.",
  },
  {
    icon: Sparkles,
    title: "Enhancement Automático",
    description: "Melhore cores, contraste e nitidez automaticamente com IA.",
  },
  {
    icon: ShieldCheck,
    title: "Privacidade e controle",
    description: "As imagens não saem da máquina — mais segurança para dados internos.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative h-screen flex items-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="container relative mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Ferramentas de <span className="text-gradient-forge">nível profissional</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Tudo que você precisa para transformar suas imagens, alimentado por modelos de IA de ponta.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold font-display">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
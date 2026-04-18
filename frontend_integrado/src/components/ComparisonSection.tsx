import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";

const tools = [
  {
    name: "Pixel Forge",
    tag: "Seu time já tem",
    price: "Grátis",
    priceDetail: "interno PMZ",
    highlight: true,
    features: [
      { label: "Upscaling com IA (2×–8×)", available: true },
      { label: "Remoção de fundo automática", available: true },
      { label: "Processamento em lote", available: true },
      { label: "Enhancement automático", available: true },
      { label: "Exportação otimizada p/ e-commerce", available: true },
      { label: "Imagens ficam na máquina (privacidade)", available: true },
      { label: "Padrão visual PMZ embutido", available: true },
      { label: "Overnight batch (500 imgs/máquina)", available: true },
    ],
  },
  {
    name: "Canva Pro",
    tag: null,
    price: "R$ 54",
    priceDetail: "por usuário / mês",
    highlight: false,
    features: [
      { label: "Upscaling com IA (2×–8×)", available: false },
      { label: "Remoção de fundo automática", available: true },
      { label: "Processamento em lote", available: false },
      { label: "Enhancement automático", available: false },
      { label: "Exportação otimizada p/ e-commerce", available: false },
      { label: "Imagens ficam na máquina (privacidade)", available: false },
      { label: "Padrão visual PMZ embutido", available: false },
      { label: "Overnight batch (500 imgs/máquina)", available: false },
    ],
  },
  {
    name: "Claid.ai",
    tag: null,
    price: "US$ 49",
    priceDetail: "500 créditos / mês",
    highlight: false,
    features: [
      { label: "Upscaling com IA (2×–8×)", available: true },
      { label: "Remoção de fundo automática", available: true },
      { label: "Processamento em lote", available: true },
      { label: "Enhancement automático", available: true },
      { label: "Exportação otimizada p/ e-commerce", available: true },
      { label: "Imagens ficam na máquina (privacidade)", available: false },
      { label: "Padrão visual PMZ embutido", available: false },
      { label: "Overnight batch (500 imgs/máquina)", available: false },
    ],
  },
  {
    name: "Pixelcut / Picwish",
    tag: null,
    price: "R$ 39",
    priceDetail: "por usuário / mês",
    highlight: false,
    features: [
      { label: "Upscaling com IA (2×–8×)", available: true },
      { label: "Remoção de fundo automática", available: true },
      { label: "Processamento em lote", available: false },
      { label: "Enhancement automático", available: false },
      { label: "Exportação otimizada p/ e-commerce", available: false },
      { label: "Imagens ficam na máquina (privacidade)", available: false },
      { label: "Padrão visual PMZ embutido", available: false },
      { label: "Overnight batch (500 imgs/máquina)", available: false },
    ],
  },
];

const ComparisonSection = () => {
  return (
    <section id="comparativo" className="py-24 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Por que <span className="text-gradient-forge">Pixel Forge</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Compare com as ferramentas pagas do mercado e veja o que o time PMZ já tem de graça.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 ${
                tool.highlight
                  ? "border-primary/50 bg-primary/5 shadow-[0_0_40px_-10px] shadow-primary/20"
                  : "border-border bg-card"
              }`}
            >
              {/* Badge */}
              {tool.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forge-gradient px-3 py-1 text-xs font-semibold text-primary-foreground whitespace-nowrap">
                    <Sparkles className="h-3 w-3" />
                    {tool.tag}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-6 mt-2">
                <h3
                  className={`text-lg font-bold font-display ${
                    tool.highlight ? "text-gradient-forge" : ""
                  }`}
                >
                  {tool.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span
                    className={`text-3xl font-bold ${
                      tool.highlight ? "text-gradient-forge" : "text-foreground"
                    }`}
                  >
                    {tool.price}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{tool.priceDetail}</p>
              </div>

              {/* Divider */}
              <div className="border-t border-border mb-5" />

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {tool.features.map((feature) => (
                  <li key={feature.label} className="flex items-start gap-2.5">
                    {feature.available ? (
                      <Check
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          tool.highlight ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    ) : (
                      <X className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/40" />
                    )}
                    <span
                      className={`text-xs leading-relaxed ${
                        feature.available
                          ? "text-foreground"
                          : "text-muted-foreground/50 line-through decoration-muted-foreground/30"
                      }`}
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {tool.highlight && (
                <a href="#" className="mt-8 block">
                  <button className="w-full inline-flex items-center justify-center h-11 rounded-xl text-sm font-semibold bg-forge-gradient text-primary-foreground glow-forge hover:brightness-110 transition-all gap-2">
                    Usar agora
                  </button>
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center text-xs text-muted-foreground"
        >
          * Preços de mercado estimados para 4 usuários. Claid.ai cobra por crédito — lotes grandes aumentam o custo.
          Pixel Forge roda local, sem mensalidade e sem limite de uso.
        </motion.p>
      </div>
    </section>
  );
};

export default ComparisonSection;
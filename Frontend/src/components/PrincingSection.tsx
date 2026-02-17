import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Para experimentar a plataforma",
    features: [
      "10 imagens por mês",
      "Upscaling 2x",
      "Remoção de fundo básica",
      "Exportação JPG/PNG",
    ],
    cta: "Começar Grátis",
    featured: false,
  },
  {
    name: "Pro",
    price: "R$ 49",
    period: "/mês",
    description: "Para criadores e pequenas equipes",
    features: [
      "500 imagens por mês",
      "Upscaling até 4x",
      "Remoção de fundo avançada",
      "Processamento em lote",
      "Exportação WebP + presets",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    featured: true,
  },
  {
    name: "Business",
    price: "R$ 199",
    period: "/mês",
    description: "Para times e operações de escala",
    features: [
      "5.000 imagens por mês",
      "Upscaling até 8x",
      "Todos os recursos Pro",
      "API REST completa",
      "Workspaces e permissões",
      "SLA garantido",
      "Suporte dedicado",
    ],
    cta: "Falar com Vendas",
    featured: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative">
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
            Planos que <span className="text-gradient-forge">escalam</span> com você
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Comece gratuitamente. Upgrade quando precisar de mais poder.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.featured
                  ? "border-primary/50 bg-card glow-forge"
                  : "border-border bg-card"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-forge-gradient px-4 py-1 text-xs font-semibold text-primary-foreground">
                  MAIS POPULAR
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold font-display">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold font-display">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-secondary-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 inline-flex items-center justify-center h-12 rounded-xl text-sm font-semibold transition-all w-full ${
                  plan.featured
                    ? "bg-forge-gradient text-primary-foreground glow-forge hover:brightness-110"
                    : "border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

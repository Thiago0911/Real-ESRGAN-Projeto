import { motion } from "framer-motion";
import { TrendingUp, Timer, ShieldCheck, Sparkles, Flame } from "lucide-react";
import { INTERNAL_APP_URL } from "@/lib/links";

const cards = [
  {
    icon: TrendingUp,
    title: "Mais conversão",
    desc: "Imagens melhores aumentam confiança e reduzem abandono na compra.",
  },
  {
    icon: Sparkles,
    title: "Catálogo padronizado",
    desc: "Qualidade visual consistente em todas as fotos do e-commerce.",
  },
  {
    icon: Timer,
    title: "Menos retrabalho",
    desc: "Automatiza ajustes e libera o time para tarefas mais estratégicas.",
  },
  {
    icon: ShieldCheck,
    title: "Jornada melhor",
    desc: "Experiência mais clara e profissional, alinhada à marca PMZ.",
  },
];

const ImpactSection = () => {
  const handleCTA = () => {
    window.location.href = INTERNAL_APP_URL;
  };

  return (
    <div className="relative h-full flex flex-col justify-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <section id="impacto" className="relative container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Impacto do <span className="text-gradient-forge">projeto</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Integração com IA para padronizar e melhorar imagens do e-commerce PMZ,
            elevando a jornada de compra — com potencial de aumentar conversão/faturamento
            e reduzir horas operacionais do time de analistas.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold font-display">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center">
          <button
            onClick={handleCTA}
            className="inline-flex items-center justify-center h-14 px-10 rounded-xl text-lg font-semibold bg-forge-gradient text-primary-foreground glow-forge hover:brightness-110 transition-all"
          >
            Testar agora
          </button>
        </div>
      </section>

      {/* Footer sobreposto no rodapé da seção */}
      <footer className="absolute bottom-0 left-0 right-0 border-t border-border/20 bg-transparent py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-forge-gradient">
                <Flame className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold tracking-tight text-sm">
                PIXEL <span className="text-gradient-forge">FORGE</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 Pixel Forge. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ImpactSection;
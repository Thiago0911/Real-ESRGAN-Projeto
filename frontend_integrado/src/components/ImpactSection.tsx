import { motion } from "framer-motion";
import { TrendingUp, Timer, ShieldCheck, Sparkles } from "lucide-react";
import { INTERNAL_APP_URL } from "@/lib/links";

const ImpactSection = () => {
  return (
    <section id="impacto" className="py-24 relative">
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
            Impacto do <span className="text-gradient-forge">projeto</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Integração com IA para padronizar e melhorar imagens do e-commerce PMZ,
            elevando a jornada de compra — com potencial de aumentar conversão/faturamento
            e reduzir horas operacionais do time de analistas.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
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
          ].map((item, i) => (
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

        {/* CTA opcional no mesmo estilo */}
        <div className="mt-12 flex items-center justify-center">
          <a
            href={INTERNAL_APP_URL}
            className="inline-flex items-center justify-center h-14 px-10 rounded-xl text-lg font-semibold bg-forge-gradient text-primary-foreground glow-forge hover:brightness-110 transition-all"
          >
            Testar agora
          </a>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
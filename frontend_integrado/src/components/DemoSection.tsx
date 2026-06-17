import { motion } from "framer-motion";
import BeforeAfterSlider from "./BeforeAfterSlider";
import SectionBackground from "@/components/ui/SectionBackground";

import autoPartBefore from "@/assets/auto-part-before.jpg";
import autoPartAfter from "@/assets/auto-part-after.jpg";

import bgRemoveBefore from "@/assets/bg-remove-before.jpg";
import bgRemoveAfter from "@/assets/bg-remove-after.jpg";

const demos = [
  {
    icon: "🔧",
    title: "Aumento de resolução",
    beforeImage: autoPartBefore,
    afterImage: autoPartAfter,
    beforeLabel: "Antes",
    afterLabel: "Depois",
    caption: "Resolução ampliada em 4×, com mais nitidez e definição dos detalhes.",
    fit: "contain" as const,
  },
  {
    icon: "✂️",
    title: "Remoção de Fundo",
    beforeImage: bgRemoveBefore,
    afterImage: bgRemoveAfter,
    beforeLabel: "Original",
    afterLabel: "Sem fundo",
    caption: "Recorte automático para padronização das imagens do catálogo.",
    fit: "cover" as const,
  },
];

const DemoSection = () => {
  return (
    <section id="demo" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background — mesmo padrão da HeroSection */}
      <SectionBackground showOrb={false} imageOpacity={0.25} gridOpacity={0.15} />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Da imagem original ao <span className="text-gradient-forge">padrão de catálogo</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Arraste o controle para comparar a imagem original com o resultado processado pelo Pixel Forge.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
          {demos.map((demo, i) => (
            <motion.div
              key={demo.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex flex-col gap-4"
            >
              <h3 className="text-base font-semibold text-center text-foreground/80 tracking-tight">
                {demo.icon} {demo.title}
              </h3>

              <BeforeAfterSlider
                beforeImage={demo.beforeImage}
                afterImage={demo.afterImage}
                beforeLabel={demo.beforeLabel}
                afterLabel={demo.afterLabel}
                fit={demo.fit}
                foregroundImage={(demo as any).foregroundImage}
              />

              <p className="text-sm text-muted-foreground text-center">
                {demo.caption}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
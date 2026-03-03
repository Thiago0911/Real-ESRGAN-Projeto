import { motion } from "framer-motion";
import BeforeAfterSlider from "./BeforeAfterSlider";

import autoPartBefore from "@/assets/auto-part-before.jpg";
import autoPartAfter from "@/assets/auto-part-after.jpg";

import bgRemoveBefore from "@/assets/bg-remove-before.jpg";
import bgRemoveAfter from "@/assets/bg-remove-after.jpg";
// import productCut from "@/assets/product-foreground.png"; // PNG transparente do objeto

const demos = [
  {
    icon: "🔧",
    title: "Enhancement de Peça Automotiva",
    beforeImage: autoPartBefore,
    afterImage: autoPartAfter,
    beforeLabel: "Antes",
    afterLabel: "Depois",
    caption: "Upscaling 4x com recuperação de nitidez",
    fit: "contain" as const,            // ✅ sem “zoom”
  },
  {
    icon: "✂️",
    title: "Remoção de Fundo",
    beforeImage: bgRemoveBefore,        // ✅ fundo original
    afterImage: bgRemoveAfter,          // ✅ cenário “depois” (branco/xadrez)
   // foregroundImage: productCut,         // ✅ objeto fixo
    beforeLabel: "Original",
    afterLabel: "Sem fundo",
    caption: "Recorte automático com precisão de bordas",
    fit: "cover" as const,
  },
];

const DemoSection = () => {
  return (
    <section id="demo" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Veja a <span className="text-gradient-forge">diferença</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Arraste a seta para comparar o antes e depois — resultados reais com IA.
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
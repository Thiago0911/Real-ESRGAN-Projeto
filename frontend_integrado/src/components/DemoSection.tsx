import { motion } from "framer-motion";
import BeforeAfterSlider from "./BeforeAfterSlider";
import autoPartBefore from "@/assets/auto-part-before.jpg";
import autoPartAfter from "@/assets/auto-part-after.jpg";
import bgRemoveBefore from "@/assets/bg-remove-before.jpg";
import bgRemoveAfter from "@/assets/bg-remove-after.jpg";

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
          {/* Enhancement example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold font-display mb-4 text-center">
              🔧 Enhancement de Peça Automotiva
            </h3>
            <BeforeAfterSlider
              beforeImage={autoPartBefore}
              afterImage={autoPartAfter}
              beforeLabel="ANTES"
              afterLabel="DEPOIS"
            />
            <p className="text-sm text-muted-foreground text-center mt-3">
              Upscaling 4x com recuperação de nitidez
            </p>
          </motion.div>

          {/* Background removal example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="text-lg font-semibold font-display mb-4 text-center">
              ✂️ Remoção de Fundo
            </h3>
            <BeforeAfterSlider
              beforeImage={bgRemoveBefore}
              afterImage={bgRemoveAfter}
              beforeLabel="ORIGINAL"
              afterLabel="SEM FUNDO"
            />
            <p className="text-sm text-muted-foreground text-center mt-3">
              Recorte automático com precisão de bordas
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;

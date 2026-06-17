import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Foto original",
    description:
      "A imagem de baixa qualidade entra no pipeline — pode ter ruído, borrado ou pixelado.",
    variant: "default" as const,
  },
  {
    step: "02",
    title: "Degradação sintética",
    description:
      "O modelo foi treinado simulando fotos ruins do mundo real: borrão, ruído e compressão JPEG.",
    variant: "default" as const,
  },
  {
    step: "03",
    title: "Rede Geradora — 23× RRDB",
    description:
      "Blocos residuais densamente conectados aprendem a restaurar detalhes perdidos. Uma conexão residual global garante que nenhuma informação se perca.",
    variant: "primary" as const,
  },
  {
    step: "04",
    title: "Ampliação ×4",
    description:
      "Os pixels são reorganizados em alta resolução usando PixelShuffle — sem perder nenhum detalhe recuperado.",
    variant: "success" as const,
  },
  {
    step: "05",
    title: "Imagem restaurada",
    description:
      "Saída 4× maior, nítida e com textura realista — pronta para o catálogo de e-commerce.",
    variant: "amber" as const,
  },
];

const variantStyles = {
  default: "border-border bg-card/60",
  primary: "border-primary/40 bg-primary/8 ring-1 ring-primary/20",
  success: "border-[hsl(160,65%,35%)/40%] bg-[hsl(160,65%,35%)/8%]",
  amber: "border-[hsl(38,82%,45%)/40%] bg-[hsl(38,82%,45%)/8%]",
};

const stepNumStyles = {
  default: "text-muted-foreground/40",
  primary: "text-primary/60",
  success: "text-[hsl(160,55%,55%)]/60",
  amber: "text-[hsl(38,90%,60%)]/60",
};

const titleStyles = {
  default: "text-foreground",
  primary: "text-gradient-forge",
  success: "text-[hsl(160,55%,55%)]",
  amber: "text-[hsl(38,90%,65%)]",
};

const EsrganSection = () => {
  return (
    <section id="arquitetura" className="relative min-h-screen flex items-center py-12 sm:py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Como o <span className="text-gradient-forge">Real-ESRGAN</span> funciona
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Uma rede neural que aprendeu a reconstruir detalhes que a câmera não capturou.
          </p>
        </motion.div>

        <div className="relative max-w-lg mx-auto">
          {/* vertical connector */}
          <div className="absolute left-[19px] top-10 bottom-10 w-px bg-border" aria-hidden />

          <ol className="space-y-3">
            {steps.map((step, i) => (
              <motion.li
                key={step.step}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`relative flex items-start gap-4 rounded-2xl border p-5 transition-all duration-300 hover:border-primary/30 ${variantStyles[step.variant]}`}
              >
                {/* step bubble on the connector line */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border border-border">
                  <span className={`text-[11px] font-mono font-medium ${stepNumStyles[step.variant]}`}>
                    {step.step}
                  </span>
                </div>

                <div className="flex-1 pt-0.5">
                  <p className={`text-sm font-semibold font-display ${titleStyles[step.variant]}`}>
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 text-center text-xs text-muted-foreground/50"
          >
            Real-ESRGAN · Wang et al. 2021
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default EsrganSection;
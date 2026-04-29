import { motion } from "framer-motion";
import SectionBackground from "@/components/ui/SectionBackground";

// ─── Stack data ─────────────────────────────────────────────────────────────
const layers = [
  {
    id: "frontend",
    label: "Frontend",
    color: "#378ADD",
    glow: "rgba(55,138,221,0.18)",
    border: "rgba(55,138,221,0.35)",
    items: [
      {
        name: "React",
        icon: "⚛️",
        desc: "UI declarativa com componentes reutilizáveis",
        badge: "v18",
      },
      {
        name: "Vite",
        icon: "⚡",
        desc: "Build ultrarrápido com HMR nativo",
        badge: "v5",
      },
      {
        name: "systeminformation",
        icon: "🖥️",
        desc: "Coleta dados de hardware local em tempo real",
        badge: "js",
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    color: "#1D9E75",
    glow: "rgba(29,158,117,0.18)",
    border: "rgba(29,158,117,0.35)",
    items: [
      {
        name: "Flask",
        icon: "🌶️",
        desc: "API REST leve para orquestrar os pipelines de IA",
        badge: "Python",
      },
      {
        name: "Pandas",
        icon: "🐼",
        desc: "Manipulação e análise de metadados das imagens",
        badge: "Python",
      },
      {
        name: "PyTorch",
        icon: "🔥",
        desc: "Runtime para inferência dos modelos de IA",
        badge: "Python",
      },
      {
        name: "OpenCV",
        icon: "👁️",
        desc: "Pré e pós-processamento de imagens em pipeline",
        badge: "Python",
      },
      {
        name: "Pillow",
        icon: "🖼️",
        desc: "Manipulação de arquivos de imagem e conversão",
        badge: "Python",
      },
    ],
  },
  {
    id: "ia",
    label: "IA Open Source",
    color: "#7F77DD",
    glow: "rgba(127,119,221,0.18)",
    border: "rgba(127,119,221,0.35)",
    items: [
      {
        name: "Real-ESRGAN",
        icon: "🔬",
        desc: "Upscaling 4× com recuperação de texturas e nitidez",
        badge: "open source",
      },
      {
        name: "Image Artisan",
        icon: "✨",
        desc: "Remoção de fundo e enhancement automático",
        badge: "open source",
      },
    ],
  },
];

const TechStackSection = () => {
  return (
    <section
      id="stack"
      className="relative h-screen flex items-center overflow-hidden"
    >
      <SectionBackground showOrb={true} imageOpacity={0.2} gridOpacity={0.12} />

      <div className="container relative z-10 mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Stack do <span className="text-gradient-forge">projeto</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
            Tecnologias escolhidas para rodar localmente, sem dependência de APIs externas
            e com custo zero de infraestrutura.
          </p>
        </motion.div>

        {/* Camadas */}
        <div className="space-y-4">
          {layers.map((layer, li) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: li * 0.12 }}
            >
              {/* Label da camada */}
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{
                    color: layer.color,
                    borderColor: layer.border,
                    background: layer.glow,
                  }}
                >
                  {layer.label}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: `linear-gradient(to right, ${layer.border}, transparent)` }}
                />
              </div>

              {/* Cards da camada */}
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${layer.items.length}, minmax(0, 1fr))`,
                }}
              >
                {layer.items.map((tech, ti) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: li * 0.12 + ti * 0.07 }}
                    className="group relative rounded-xl border bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200"
                    style={{ borderColor: layer.border }}
                  >
                    {/* Glow hover */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: layer.glow }}
                    />

                    <div className="relative flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl leading-none">{tech.icon}</span>
                        <span className="font-semibold text-sm text-foreground">
                          {tech.name}
                        </span>
                      </div>
                      <span
                        className="text-[9px] font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                        style={{
                          color: layer.color,
                          background: layer.glow,
                          border: `1px solid ${layer.border}`,
                        }}
                      >
                        {tech.badge}
                      </span>
                    </div>

                    <p className="relative text-[11px] text-muted-foreground leading-relaxed">
                      {tech.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rodapé da stack */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-2"
        >
          {[
            { label: "100% local", desc: "sem cloud, sem API paga" },
            { label: "Open source", desc: "modelos de IA gratuitos" },
            { label: "Cross-platform", desc: "Windows · Linux · Mac" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="text-muted-foreground">— {item.desc}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default TechStackSection;
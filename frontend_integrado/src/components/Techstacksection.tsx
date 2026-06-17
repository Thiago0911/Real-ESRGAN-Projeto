import { motion } from "framer-motion";
import SectionBackground from "@/components/ui/SectionBackground";

// ─── Stack data ─────────────────────────────────────────────────────────────
const layers = [
  {
    id: "frontend",
    label: "Interface / Frontend",
    color: "#378ADD",
    glow: "rgba(55,138,221,0.18)",
    border: "rgba(55,138,221,0.35)",
    items: [
      {
        name: "React",
        icon: "⚛️",
        desc: "Constrói as telas e os componentes usados pelo usuário.",
        badge: "interface",
      },
      {
        name: "TypeScript",
        icon: "🔷",
        desc: "Adiciona segurança ao código, reduzindo erros e facilitando a manutenção.",
        badge: "tipagem",
      },
      {
        name: "Vite",
        icon: "⚡",
        desc: "Organiza e prepara a aplicação para uma execução rápida.",
        badge: "build",
      },
      {
        name: "Chart.js",
        icon: "📊",
        desc: "Apresenta métricas e comparativos de produtividade de forma visual.",
        badge: "gráficos",
      },
    ],
  },
  {
    id: "backend",
    label: "Backend e orquestração",
    color: "#1D9E75",
    glow: "rgba(29,158,117,0.18)",
    border: "rgba(29,158,117,0.35)",
    items: [
      {
        name: "Node.js + Express",
        icon: "🟢",
        desc: "Recebe as solicitações e coordena todo o fluxo de processamento.",
        badge: "API local",
      },
      {
        name: "WebSocket",
        icon: "🔄",
        desc: "Envia progresso, logs e conclusão das tarefas em tempo real.",
        badge: "tempo real",
      },
      {
        name: "Multer + Sharp",
        icon: "🗂️",
        desc: "Recebem, organizam, convertem e preparam os arquivos de imagem.",
        badge: "arquivos",
      },
      {
        name: "systeminformation",
        icon: "🖥️",
        desc: "Monitora informações da máquina, como memória, processador e armazenamento.",
        badge: "hardware",
      },
    ],
  },
  {
    id: "ia",
    label: "IA e processamento",
    color: "#7F77DD",
    glow: "rgba(127,119,221,0.18)",
    border: "rgba(127,119,221,0.35)",
    items: [
      {
        name: "Real-ESRGAN",
        icon: "🔬",
        desc: "Aumenta a resolução das imagens em até 4×, recuperando nitidez e detalhes.",
        badge: "upscaling",
      },
      {
        name: "InSPyReNet",
        icon: "✂️",
        desc: "Identifica o produto e remove automaticamente o fundo da imagem.",
        badge: "recorte",
      },
      {
        name: "Python + PyTorch",
        icon: "🐍",
        desc: "Executam o modelo responsável pelo processamento inteligente das imagens.",
        badge: "runtime IA",
      },
      {
        name: "Kornia",
        icon: "👁️",
        desc: "Apoia operações de visão computacional durante o tratamento das imagens.",
        badge: "visão",
      },
    ],
  },
];

const TechStackSection = () => {
  return (
    <section
      id="stack"
      className="relative min-h-screen flex items-center overflow-hidden"
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
            Tecnologias por trás do <span className="text-gradient-forge">Pixel Forge</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl mx-auto">
            Uma arquitetura local que conecta interface, backend e modelos
            de inteligência artificial em um único fluxo de processamento.
          </p>

          <p className="mt-1 text-xs text-muted-foreground max-w-2xl mx-auto">
            Sem cobrança por imagem e sem envio dos arquivos para serviços externos.
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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
              {
                label: "Processamento local",
                desc: "as imagens permanecem na máquina",
              },
              {
                label: "Sem API paga",
                desc: "nenhuma cobrança por imagem processada",
              },
              {
                label: "Open source",
                desc: "motores de IA gratuitos e evolutivos",
              },
              {
                label: "Ambiente atual",
                desc: "Windows com aceleração Vulkan",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />

                <span className="font-medium text-foreground">
                  {item.label}
                </span>

                <span className="text-muted-foreground">
                  — {item.desc}
                </span>
              </div>
            ))}
        </motion.div>

      </div>
    </section>
  );
};

export default TechStackSection;
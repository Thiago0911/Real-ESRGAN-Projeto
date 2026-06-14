import { motion } from "framer-motion";
import SectionBackground from "@/components/ui/SectionBackground";

const colorMap = {
  blue: {
    badge: "text-[#378ADD] border-[rgba(55,138,221,0.35)] bg-[rgba(55,138,221,0.15)]",
    card: "border-[rgba(55,138,221,0.35)] bg-[rgba(55,138,221,0.06)]",
    number: "text-[rgba(55,138,221,0.2)]",
  },
  green: {
    badge: "text-[#1D9E75] border-[rgba(29,158,117,0.35)] bg-[rgba(29,158,117,0.15)]",
    card: "border-[rgba(29,158,117,0.35)] bg-[rgba(29,158,117,0.06)]",
    number: "text-[rgba(29,158,117,0.18)]",
  },
};

const StepCard = ({ step, badge, badgeColor, title, desc, delay, iaBadge }) => {
  const c = colorMap[badgeColor];
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className={`relative rounded-xl border bg-card/60 backdrop-blur-sm px-3 py-2.5 flex flex-col gap-0.5 ${c.card}`}
    >
      <span className={`absolute right-3 top-1.5 text-3xl font-bold leading-none select-none ${c.number}`}>
        {step}
      </span>
      <span className={`self-start text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${c.badge}`}>
        {badge}
      </span>
      <p className="font-semibold text-xs text-foreground mt-0.5 pr-6">{title}</p>
      <p className="text-[10px] text-muted-foreground leading-relaxed">{desc}</p>
      {iaBadge && (
        <span className="self-start mt-0.5 text-[9px] font-medium px-2 py-0.5 rounded-full border text-[#7F77DD] border-[rgba(127,119,221,0.35)] bg-[rgba(127,119,221,0.1)]">
          Motores: Real-ESRGAN · InSPyReNet
        </span>
      )}
    </motion.div>
  );
};

const steps = [
  { step: 1, badge: "Interface",     badgeColor: "blue",  title: "Seleção de imagens",     desc: "O usuário escolhe uma ou várias imagens, inclusive de pastas diferentes.",       delay: 0    },
  { step: 2, badge: "Sistema",       badgeColor: "blue",  title: "Recebimento e preparação", desc: "O backend recebe os arquivos e organiza o diretório de entrada da execução.",    delay: 0.08 },
  { step: 3, badge: "Orquestração",  badgeColor: "green", title: "Criação da fila de tarefas", desc: "Cada imagem recebe um identificador e entra na fila de processamento.",           delay: 0.16 },
  { step: 4, badge: "IA local",      badgeColor: "green", title: "Execução do tratamento", desc: "Os motores de IA executam o aumento de resolução ou a remoção de fundo.",     delay: 0.24, iaBadge: true },
  { step: 5, badge: "Sistema",       badgeColor: "blue",  title: "Progresso e comparação",   desc: "A aplicação atualiza o progresso e apresenta a comparação entre original e resultado.",       delay: 0.32 },
  { step: 6, badge: "Entrega",       badgeColor: "blue",  title: "Disponibilização dos arquivos",desc: "As imagens finais são gravadas em /output e ficam acessíveis pela aplicação.",    delay: 0.40 },
];

// Seta horizontal longa entre os cards de cada par
const ArrowRight = ({ color }) => {
  const stroke = color === "blue" ? "rgba(55,138,221,0.7)" : "rgba(29,158,117,0.7)";
  return (
    <div className="flex items-center justify-center shrink-0 self-center" style={{ width: 64 }}>
      <svg width="64" height="12" className="overflow-visible">
        <style>{`@keyframes dmR{to{stroke-dashoffset:-18}}`}</style>
        <line
          x1="0" y1="6" x2="58" y2="6"
          stroke={stroke} strokeWidth="1.5"
          strokeDasharray="5 4"
          style={{ animation: "dmR 1s linear infinite" }}
        />
        <polyline points="52,2 58,6 52,10" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// Seta em S: sai do topo-direito (sob card 2 ou 4),
// curva para a esquerda e termina apontando para BAIXO no centro-esquerdo (sobre card 3 ou 5)
const SCurveConnector = ({ color }) => {
  const stroke = color === "green" ? "rgba(29,158,117,0.7)" : "rgba(55,138,221,0.7)";
  // viewBox 600x56
  // Começa em x=450 (centro do card direito) y=0 (saindo de baixo do card)
  // Curva até x=150 (centro do card esquerdo) y=56 (chegando em cima do próximo card)
  // Seta aponta para baixo no final
  return (
    <div className="w-full" style={{ height: 56 }}>
      <svg viewBox="0 0 600 56" width="100%" height="56" preserveAspectRatio="none" className="overflow-visible">
        <style>{`@keyframes dmS{to{stroke-dashoffset:-18}}`}</style>
        <path
          d="M 450 0 C 450 40, 150 16, 150 56"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="5 4"
          vectorEffect="non-scaling-stroke"
          style={{ animation: "dmS 1.4s linear infinite" }}
        />
        {/* Seta apontando para baixo no final (x=150, y=56) */}
        <polyline
          points="144,48 150,56 156,48"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

const FlowSection = () => {
  const rows = [
    { left: steps[0], right: steps[1], curveColor: "green" },
    { left: steps[2], right: steps[3], curveColor: "blue"  },
    { left: steps[4], right: steps[5], curveColor: null    },
  ];

  return (
    <section id="flow" className="relative min-h-screen flex items-center overflow-hidden">
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
            Do upload ao resultado: <span className="text-gradient-forge">fluxo da aplicação</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
            As imagens são processadas na própria máquina,
            sem envio para serviços externos.
          </p>
        </motion.div>

        {/* Fluxo */}
        <div className="flex flex-col gap-0">
          {rows.map(({ left, right, curveColor }, i) => (
            <div key={i}>
              {/* Par de cards com seta horizontal entre eles */}
              <div className="flex items-center">
                <div className="flex-1">
                  <StepCard {...left} />
                </div>
                <ArrowRight color={left.badgeColor} />
                <div className="flex-1">
                  <StepCard {...right} />
                </div>
              </div>

              {/* Seta em S conectando para a próxima linha */}
              {curveColor && (
                <SCurveConnector color={curveColor} />
              )}
            </div>
          ))}
        </div>

        {/* Legenda */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-2"
        >
          {[
            { color: "bg-[rgba(55,138,221,0.5)]",  label: "Interface e interação"},
            { color: "bg-[rgba(29,158,117,0.5)]",  label: "orquestração"},
            { color: "bg-[rgba(127,119,221,0.5)]", label: "Motores de IA"},
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <span className={`h-2 w-2 rounded-full ${item.color}`} />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default FlowSection;
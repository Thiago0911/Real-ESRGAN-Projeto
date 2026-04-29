import heroBg from "@/assets/hero-bg.png";

interface SectionBackgroundProps {
  /** Opacidade da imagem de fundo (0–1). Default: 0.4 */
  imageOpacity?: number;
  /** Opacidade da grade quadriculada (0–1). Default: 0.2 */
  gridOpacity?: number;
  /** Exibe ou não o orb de brilho central. Default: true */
  showOrb?: boolean;
}

const SectionBackground = ({
  imageOpacity = 0.4,
  gridOpacity = 0.2,
  showOrb = true,
}: SectionBackgroundProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Imagem de fundo */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
        style={{ opacity: imageOpacity }}
      />

      {/* Gradiente de fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

      {/* Grade quadriculada */}
      <div
        className="absolute inset-0 bg-grid-pattern"
        style={{ opacity: gridOpacity }}
      />

      {/* Orb de brilho */}
      {showOrb && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      )}
    </div>
  );
};

export default SectionBackground;
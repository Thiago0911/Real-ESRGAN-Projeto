import { useState, useRef, useCallback } from "react";
import { GripVertical } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;

  // enhancement sem corte
  fit?: "cover" | "contain";

  // remove-bg: produto fixo por cima
  foregroundImage?: string;

  // mantém o formato que você quiser
  aspectClassName?: string;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "ANTES",
  afterLabel = "DEPOIS",
  fit = "cover",
  foregroundImage,
  aspectClassName = "aspect-square",
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  }, []);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectClassName} overflow-hidden rounded-2xl border border-border cursor-col-resize select-none bg-muted/30`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* After image (full) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className={`absolute inset-0 w-full h-full ${fitClass} object-center`}
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
        <img
          src={beforeImage}
          alt={beforeLabel}
          className={`absolute inset-0 w-full h-full ${fitClass} object-center`}
          draggable={false}
        />
      </div>

      {/* Foreground fixo (produto recortado) */}
      {foregroundImage ? (
        <img
          src={foregroundImage}
          alt="Produto"
          className="absolute inset-0 z-20 w-full h-full object-contain object-center pointer-events-none"
          draggable={false}
        />
      ) : null}

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-foreground/80 z-30"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-foreground/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
          <GripVertical className="h-5 w-5 text-background" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 z-40">
        <span className="rounded-full bg-destructive/80 px-3 py-1 text-xs font-semibold text-destructive-foreground">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute bottom-4 right-4 z-40">
        <span className="rounded-full bg-primary/80 px-3 py-1 text-xs font-semibold text-primary-foreground">
          {afterLabel}
        </span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
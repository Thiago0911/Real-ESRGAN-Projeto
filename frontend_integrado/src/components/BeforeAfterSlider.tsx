import { useState, useRef, useCallback } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  fit?: "cover" | "contain";
  foregroundImage?: string;
  aspectClassName?: string;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "ANTES",
  afterLabel = "DEPOIS",
  fit = "cover",
  foregroundImage,
  aspectClassName = "aspect-[4/3]",
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPosition(pct);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div
      ref={containerRef}
      className={`
        relative w-full overflow-hidden rounded-2xl border border-border
        cursor-col-resize select-none bg-muted/30
        ${aspectClassName}
        max-h-[60vh] sm:max-h-[70vh] lg:max-h-[80vh]
      `}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* After image — full, sem clip */}
      <img
        src={afterImage}
        alt={afterLabel}
        className={`absolute inset-0 w-full h-full ${fitClass} object-center`}
        draggable={false}
      />

      {/* Before image — clip-path */}
      <img
        src={beforeImage}
        alt={beforeLabel}
        className={`absolute inset-0 w-full h-full ${fitClass} object-center`}
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        draggable={false}
      />

      {/* Foreground fixo */}
      {foregroundImage && (
        <img
          src={foregroundImage}
          alt="Produto"
          className="absolute inset-0 z-20 w-full h-full object-contain object-center pointer-events-none"
          draggable={false}
        />
      )}

      {/* Linha do slider */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/90 z-30 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px] text-neutral-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <line x1="8" y1="12" x2="16" y2="12" />
            <polyline points="5,9 2,12 5,15" />
            <polyline points="19,9 22,12 19,15" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 z-40 pointer-events-none">
        <span className="rounded-full bg-red-600/80 px-3 py-1 text-xs font-semibold text-white tracking-wide">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute bottom-4 right-4 z-40 pointer-events-none">
        <span className="rounded-full bg-blue-600/80 px-3 py-1 text-xs font-semibold text-white tracking-wide">
          {afterLabel}
        </span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
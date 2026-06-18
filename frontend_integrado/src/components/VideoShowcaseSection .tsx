import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  CheckCircle2,
  Eye,
  Gauge,
  Maximize2,
  Pause,
  Play,
  ShieldCheck,
} from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

const VIDEO_SRC = "/videos/pixel-forge-demo.mp4";
const VIDEO_POSTER = "/videos/pixel-forge-poster.png";

const highlights = [
  {
    icon: BrainCircuit,
    title: "IA em execução",
    description:
      "Modelos processando e aprimorando as imagens localmente.",
  },
  {
    icon: Gauge,
    title: "Acompanhamento em tempo real",
    description: "Progresso, status e conclusão de cada tarefa.",
  },
  {
    icon: ShieldCheck,
    title: "Processamento local",
    description: "As imagens permanecem na infraestrutura interna.",
  },
];

const VideoShowcaseSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlayPause = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
        setHasStarted(true);
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("Não foi possível reproduzir o vídeo:", error);
    }
  };

  const handleFullscreen = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      }
    } catch (error) {
      console.error("Não foi possível abrir em tela cheia:", error);
    }
  };

  return (
    <section
      id="video-demonstracao"
      className="relative flex min-h-screen min-h-[100svh] w-full items-center overflow-x-hidden"
    >
      <SectionBackground
        showOrb={false}
        imageOpacity={0.2}
        gridOpacity={0.12}
      />

      <div className="container relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full min-w-0 space-y-5 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Demonstração prática
            </p>

            <h2 className="mt-1.5 text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:whitespace-nowrap lg:text-[2.25rem] xl:text-[2.5rem]">
              Veja a IA{" "}
              <span className="text-gradient-forge">
                trabalhando na prática
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Acompanhe o fluxo completo: envio da imagem, processamento local,
              progresso da tarefa e entrega do resultado final.
            </p>
          </motion.div>

          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card/70 p-2.5 shadow-2xl backdrop-blur-sm sm:rounded-3xl sm:p-3"
            >
              {/*
                max-h evita que o vídeo sozinho ultrapasse a viewport em telas
                largas e baixas. O object-contain mantém a imagem completa.
              */}
              <div className="relative aspect-video max-h-[58vh] w-full overflow-hidden rounded-xl bg-black sm:rounded-2xl">
                <video
                  ref={videoRef}
                  src={VIDEO_SRC}
                  poster={VIDEO_POSTER}
                  preload="metadata"
                  playsInline
                  controls={hasStarted}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="h-full w-full object-contain"
                >
                  Seu navegador não oferece suporte à reprodução de vídeos.
                </video>

                {!isPlaying && (
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    aria-label="Reproduzir demonstração"
                    className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/35 px-4 text-center transition-colors hover:bg-black/45"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-xl backdrop-blur-md transition-transform hover:scale-105 sm:h-20 sm:w-20">
                      <Play className="ml-1 h-7 w-7 fill-current sm:h-9 sm:w-9" />
                    </span>

                    <span className="mt-3 rounded-full bg-black/45 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:mt-4 sm:text-sm">
                      Iniciar demonstração
                    </span>
                  </button>
                )}

                {isPlaying && (
                  <div className="pointer-events-none absolute left-3 top-3 sm:left-4 sm:top-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      IA em execução
                    </span>
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-3 px-1 pb-1 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    Processamento com Pixel Forge
                  </p>

                  <p className="mt-0.5 break-words text-xs text-muted-foreground">
                    O vídeo somente inicia quando o botão de reprodução é
                    acionado.
                  </p>
                </div>

                <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background/70 px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary sm:flex-none"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Reproduzir
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleFullscreen}
                    aria-label="Abrir vídeo em tela cheia"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/70 text-foreground transition-colors hover:bg-secondary"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex min-w-0 flex-col rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm sm:rounded-3xl sm:p-5"
            >
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 shrink-0 text-primary" />

                <p className="text-sm font-semibold text-foreground">
                  O que observar
                </p>
              </div>

              <div className="mt-4 grid flex-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-5">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="flex min-w-0 items-start gap-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-4 w-4" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground">
                        {item.title}
                      </p>

                      <p className="mt-1 break-words text-[11px] leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 lg:mt-5">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

                  <p className="break-words text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
                    Resultado produzido pela aplicação real, utilizando a
                    infraestrutura local disponível.
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcaseSection;

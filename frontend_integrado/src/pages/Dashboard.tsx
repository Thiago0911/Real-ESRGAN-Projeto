import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Flame, ArrowLeft, X, Download, ZoomIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useUpscale } from "@/hooks/useUpscale";
import { downloadOutputZip } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type UiFile = { name: string; url: string; file: File };

const Dashboard = () => {
  const [files, setFiles] = useState<UiFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const { running, uploading, starting, uploadAndStart, log } = useUpscale();

  const logRef = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    if (!logRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    const newFiles = droppedFiles.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      file: f,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"));
    const newFiles = selected.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      file: f,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
  };

  const onProcess = async () => {
    if (running || uploading || starting) return;
    await uploadAndStart(files.map((f) => ({ file: f.file })));
  };

  const onExport = async () => {
    try {
      await downloadOutputZip();
      toast({ title: "Download iniciado", description: "Se nada baixar, verifique o backend (/api/download)." });
    } catch (err: any) {
      toast({ title: "Erro ao exportar", description: err?.message ?? "Falha no download", variant: "destructive" });
    }
  };

  const busy = running || uploading || starting;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-forge-gradient">
                <Flame className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-sm">PIXEL FORGE</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">{busy ? "Processando" : "Pronto"}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold font-display mb-2">Workspace</h1>
          <p className="text-muted-foreground text-sm mb-8">Faça upload, processe e exporte suas imagens.</p>

          {/* Upload area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${
              dragActive ? "border-primary bg-primary/5 glow-forge" : "border-border hover:border-primary/30 hover:bg-card"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input id="file-input" type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">Arraste imagens aqui ou clique para selecionar</p>
            <p className="mt-1 text-sm text-muted-foreground">JPG, PNG, WebP — até 20MB por arquivo</p>
          </div>

          {/* Uploaded files */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold font-display">
                    {files.length} {files.length === 1 ? "imagem" : "imagens"}
                  </h2>
                  <button onClick={clearAll} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Limpar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="relative group rounded-2xl border border-border bg-card p-3">
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full bg-background/80 border border-border flex items-center justify-center"
                        aria-label="Remover"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                        <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    <button
                      onClick={onProcess}
                      disabled={busy}
                      className={`flex-1 inline-flex items-center justify-center h-12 rounded-xl text-sm font-semibold bg-forge-gradient text-primary-foreground glow-forge hover:brightness-110 transition-all gap-2 ${
                        busy ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      <ZoomIn className="h-4 w-4" />
                      {running ? "Processando..." : uploading ? "Enviando..." : starting ? "Iniciando..." : `Processar ${files.length} ${files.length === 1 ? "imagem" : "imagens"}`}
                    </button>

                    <button
                      onClick={onExport}
                      className="inline-flex items-center justify-center h-12 px-5 rounded-xl text-sm font-medium border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Exportar
                    </button>
                  </motion.div>
                </div>

                {/* Log */}
                {(running || log) && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold">Log</h3>
                      <span className="text-xs text-muted-foreground">{running ? "atualizando..." : "finalizado"}</span>
                    </div>
                    <pre
                      ref={logRef}
                      className="h-64 overflow-auto rounded-xl border border-border bg-card p-4 text-xs leading-relaxed whitespace-pre-wrap"
                    >
                      {log || "Sem logs ainda..."}
                    </pre>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

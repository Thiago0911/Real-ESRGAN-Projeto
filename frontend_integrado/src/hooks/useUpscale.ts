import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLog, getStatus, startUpscale, uploadImages } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type UploadItem = { file: File };

export function useUpscale() {
  const qc = useQueryClient();

  const statusQuery = useQuery({
    queryKey: ["upscale-status"],
    queryFn: getStatus,
    refetchInterval: 1500,
  });

  const running = !!statusQuery.data?.running;

  const logQuery = useQuery({
    queryKey: ["upscale-log"],
    queryFn: getLog,
    enabled: true,
    refetchInterval: running ? 1000 : 0,
  });

  const uploadMutation = useMutation({
    mutationFn: (items: UploadItem[]) => uploadImages(items.map((i) => i.file)),
  });

  const startMutation = useMutation({
    mutationFn: startUpscale,
    onSuccess: (data) => {
      toast({ title: "Processo iniciado", description: data?.message || "Aguarde o processamento..." });
      qc.invalidateQueries({ queryKey: ["upscale-status"] });
      qc.invalidateQueries({ queryKey: ["upscale-log"] });
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: err?.message ?? "Falha ao iniciar", variant: "destructive" });
    },
  });

  async function uploadAndStart(items: UploadItem[]) {
    if (!items.length) {
      toast({ title: "Nenhuma imagem", description: "Selecione pelo menos 1 imagem.", variant: "destructive" });
      return;
    }

    try {
      toast({ title: "Enviando imagens...", description: "Preparando para processar." });
      await uploadMutation.mutateAsync(items);
      await startMutation.mutateAsync();
    } catch (err: any) {
      toast({ title: "Erro", description: err?.message ?? "Falha ao processar", variant: "destructive" });
    }
  }

  return {
    running,
    log: logQuery.data ?? "",
    statusQuery,
    logQuery,
    uploadAndStart,
    uploading: uploadMutation.isPending,
    starting: startMutation.isPending,
  };
}

export type StatusResp = { running: boolean };

export async function uploadImages(files: File[]): Promise<{ success: boolean; count: number }> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f, f.name));

  const r = await fetch("/api/upload", { method: "POST", body: form });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || "Erro ao enviar imagens");
  return data;
}

export async function startUpscale(): Promise<{ success: boolean; message?: string }> {
  const r = await fetch("/api/upscale", { method: "POST" });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || "Erro ao iniciar processamento");
  return data;
}

export async function getStatus(): Promise<StatusResp> {
  const r = await fetch("/api/status");
  if (!r.ok) throw new Error("Erro ao buscar status");
  return r.json();
}

export async function getLog(): Promise<string> {
  const r = await fetch("/api/log");
  if (!r.ok) throw new Error("Erro ao buscar log");
  return r.text();
}

export async function downloadOutputZip(): Promise<void> {
  const r = await fetch("/api/download");
  if (!r.ok) throw new Error("Erro ao baixar resultados");

  const blob = await r.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pixel-forge-output.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

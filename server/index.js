const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const si = require("systeminformation");   // ✅ NOVO
const cors = require("cors");              // ✅ NOVO

const app = express();
app.use(express.json());
app.use(cors()); // ✅ IMPORTANTE se frontend estiver em outra porta

const ROOT = path.resolve(__dirname, "..");
const ENGINE_DIR = path.join(ROOT, "engine");
const EXE = path.join(ENGINE_DIR, "realesrgan-ncnn-vulkan.exe");

const INPUT_DIR = path.join(ROOT, "Input");
const OUTPUT_DIR = path.join(ROOT, "output");
const LOG_DIR = path.join(ROOT, "logs");
const LOG_FILE = path.join(LOG_DIR, "log.txt");

function ensureDirs() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

let running = false;

/* =========================
   ✅ NOVA ROTA DE SISTEMA
========================= */
app.get("/api/system", async (req, res) => {
  try {
    const cpu = await si.cpu();
    const mem = await si.mem();
    const system = await si.system();

    res.json({
      machineId: system.uuid,
      cpuName: cpu.brand,
      cpuCores: cpu.cores,
      ramGB: Math.round(mem.total / 1024 / 1024 / 1024),
      platform: system.model,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao coletar info do sistema" });
  }
});

/* =========================
   SUA ROTA DE UPSCALE
========================= */
app.post("/api/upscale", (req, res) => {
  if (running) return res.status(409).json({ success: false, message: "Já existe um processamento em andamento." });

  ensureDirs();
  running = true;

  fs.writeFileSync(LOG_FILE, "", "utf8");

  const args = [
    "-i", INPUT_DIR,
    "-o", OUTPUT_DIR,
    "-s", "4",
    "-t", "256",
    "-n", "realesrgan-x4plus",
  ];

  const child = spawn(EXE, args, {
    cwd: ENGINE_DIR,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (d) => fs.appendFileSync(LOG_FILE, d.toString()));
  child.stderr.on("data", (d) => fs.appendFileSync(LOG_FILE, d.toString()));

  child.on("close", (code) => {
    running = false;
    if (code === 0) return res.json({ success: true, message: "Finalizado." });
    return res.status(500).json({ success: false, message: `Falhou (code ${code}). Verifique logs.` });
  });

  child.on("error", (err) => {
    running = false;
    fs.appendFileSync(LOG_FILE, `\n[ERROR] ${String(err)}\n`);
    return res.status(500).json({ success: false, message: "Erro ao iniciar o processo." });
  });
});

app.get("/api/status", (req, res) => {
  res.json({ running });
});

app.get("/api/log", (req, res) => {
  try {
    const txt = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, "utf8") : "";
    res.type("text/plain").send(txt);
  } catch {
    res.type("text/plain").send("");
  }
});

app.get('/', (req, res) => {
  res.send('API está funcionando 🚀')
})

app.listen(3001, () => console.log("API on http://localhost:3001"));
const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const si = require("systeminformation");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());

const ROOT = path.resolve(__dirname, "..");
const ENGINE_DIR = path.join(ROOT, "engine");
const EXE = path.join(ENGINE_DIR, "realesrgan-ncnn-vulkan.exe");

const INPUT_DIR = path.join(ROOT, "Input");
const OUTPUT_DIR = path.join(ROOT, "output");
const LOG_DIR = path.join(ROOT, "logs");
const LOG_FILE = path.join(LOG_DIR, "log.txt");

function ensureDirs() {
  [LOG_DIR, OUTPUT_DIR, INPUT_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

let running = false;

// ─── Multer: salva imagem direto em /Input com nome original ─────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDirs();
    cb(null, INPUT_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ─── Sistema ─────────────────────────────────────────────────────────────────
app.get("/api/system", async (req, res) => {
  try {
    const [cpu, mem, memLayout, os, disk, system] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.memLayout(),
      si.osInfo(),
      si.fsSize(),
      si.system(),
    ]);

    // Tipo de RAM (DDR3, DDR4, DDR5 etc)
    const ramType = memLayout.length > 0
      ? [...new Set(memLayout.map(m => m.type).filter(Boolean))].join(', ')
      : 'N/D';

    // Armazenamento: disco principal
    const mainDisk = disk.find(d => d.mount === 'C:' || d.mount === '/') || disk[0];
    const storageTotal = mainDisk ? Math.round(mainDisk.size / (1024 ** 3)) : null;
    const storageUsed  = mainDisk ? Math.round(mainDisk.used / (1024 ** 3)) : null;

    res.json({
      machineId:    system.uuid,
      cpuName:      `${cpu.manufacturer} ${cpu.brand}`,
      cpuCores:     cpu.physicalCores,   // núcleos físicos
      cpuThreads:   cpu.cores,           // threads lógicos
      cpuSpeed:     cpu.speed,           // GHz
      ramGB:        Math.round(mem.total / 1024 / 1024 / 1024),
      ramType,                           // DDR4, DDR5 etc
      platform:     `${os.distro} ${os.release} (${os.arch})`, // ex: Windows 11 22H2 (x64)
      storageTotal,
      storageUsed,
    });
  } catch (err) {
    console.error("[SYSTEM]", err);
    res.status(500).json({ error: "Erro ao coletar info do sistema" });
  }
});

// ─── Upload: recebe imagem e salva em /Input ──────────────────────────────────
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo recebido." });
  }
  console.log(`[UPLOAD] Salvo: ${req.file.path}`);
  res.json({ success: true, fileName: req.file.originalname });
});

// ─── Upscale: dispara o realesrgan direto (sem BAT) ──────────────────────────
app.post("/api/upscale", (req, res) => {
  if (running) {
    return res.status(409).json({ success: false, message: "Já existe um processamento em andamento." });
  }

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

// ─── Status: frontend faz polling aqui ───────────────────────────────────────
app.get("/api/status", (req, res) => {
  res.json({ running });
});

// ─── Log: conteúdo do log.txt em texto puro ──────────────────────────────────
app.get("/api/log", (req, res) => {
  try {
    const txt = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, "utf8") : "";
    res.type("text/plain").send(txt);
  } catch {
    res.type("text/plain").send("");
  }
});

// ─── Resultado: serve o arquivo processado de /output ────────────────────────
app.get("/api/resultado", (req, res) => {
  const { fileName } = req.query;

  if (!fileName) {
    return res.status(400).json({ error: "Parâmetro fileName obrigatório." });
  }

  // realesrgan pode mudar extensão para .png — testa as principais
  const baseName = path.parse(fileName).name;
  const extensoes = [".png", ".jpg", ".jpeg", ".webp"];

  let filePath = null;
  for (const ext of extensoes) {
    const tentativa = path.join(OUTPUT_DIR, baseName + ext);
    if (fs.existsSync(tentativa)) {
      filePath = tentativa;
      break;
    }
  }

  if (!filePath) {
    console.error(`[RESULTADO] Não encontrado em /output: ${baseName}`);
    return res.status(404).json({
      error: `Arquivo processado não encontrado para: ${fileName}`,
    });
  }

  console.log(`[RESULTADO] Servindo: ${filePath}`);
  res.sendFile(filePath);
});

console.log("ROOT:", ROOT);
console.log("INPUT_DIR:", INPUT_DIR);
console.log("OUTPUT_DIR:", OUTPUT_DIR);
console.log("EXE:", EXE);
console.log("EXE existe?", fs.existsSync(EXE));

app.get("/api/abrir-output", (req, res) => {
  const { spawn } = require("child_process");

  const child = spawn("explorer.exe", [OUTPUT_DIR], {
    detached: true,
    stdio: "ignore",
  });

  child.unref();
  res.json({ success: true });
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("API está funcionando 🚀");
});

app.listen(3001, () => console.log("API on http://localhost:3001"));
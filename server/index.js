const express = require("express");
const path = require("path");
const fs   = require("fs");
const { spawn } = require("child_process");
const si = require("systeminformation");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());

const ROOT = path.resolve(__dirname, "..");

// Pasta que contém os I/Os do removedor de fundo
const REMBG_DIR    = path.join(ROOT, "Removedor-de-Fundo");
const REMBG_INPUT  = path.join(REMBG_DIR, "input");
const REMBG_OUTPUT = path.join(REMBG_DIR, "output");
const REMBG_RGBA   = path.join(REMBG_DIR, "output_rgba");
const REMBG_WHITE  = path.join(REMBG_DIR, "output_white");

// Scripts Python na RAIZ do projeto
const INFERENCE = path.join(ROOT, "run", "Inference.py");
const CONFIG    = path.join(ROOT, "configs", "extra_dataset", "Plus_Ultra.yaml");
const CONVERTER = path.join(ROOT, "converter_branco.py");

// Python: .venv dentro de Removedor-de-Fundo
const PY_LOCAL = path.join(REMBG_DIR, ".venv", "Scripts", "python.exe");
const PY_FINAL = fs.existsSync(PY_LOCAL) ? PY_LOCAL : "python";

const ENGINE_DIR = path.join(ROOT, "engine");
const EXE = path.join(ENGINE_DIR, "realesrgan-ncnn-vulkan.exe");

const INPUT_DIR = path.join(ROOT, "Input");
const OUTPUT_DIR = path.join(ROOT, "output");
const LOG_DIR = path.join(ROOT, "logs");
const LOG_FILE = path.join(LOG_DIR, "log.txt");

console.log("PY_LOCAL:", PY_LOCAL);
console.log("PY_LOCAL existe?", fs.existsSync(PY_LOCAL));
console.log("INFERENCE:", INFERENCE);

function ensureDirs() {
  [LOG_DIR, OUTPUT_DIR, INPUT_DIR, REMBG_INPUT, REMBG_OUTPUT, REMBG_RGBA, REMBG_WHITE].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

let running = false;

// ─── Multer: salva imagem direto em /Input com nome original ───
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

// ─── Sistema ──────────────────────────────────────────────────────────
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

  // Conta quantos arquivos estão no input
  const inputFiles = fs.readdirSync(INPUT_DIR).filter(f =>
    ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase())
  );
  const totalImagens = inputFiles.length;
  const startTime = Date.now();

  // Salva estado inicial das métricas
  const METRICS_FILE = path.join(ROOT, "logs", "metrics.json");
  fs.writeFileSync(METRICS_FILE, JSON.stringify({
    status: "running",
    totalImagens,
    startTime,
    endTime: null,
    tempoTotalMs: null,
    mediaPorImagemMs: null,
  }), "utf8");

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
    const endTime = Date.now();
    const tempoTotalMs = endTime - startTime;
    const mediaPorImagemMs = totalImagens > 0
      ? Math.round(tempoTotalMs / totalImagens)
      : 0;

    // Salva métricas finais
    fs.writeFileSync(METRICS_FILE, JSON.stringify({
      status: code === 0 ? "done" : "error",
      totalImagens,
      startTime,
      endTime,
      tempoTotalMs,
      mediaPorImagemMs,
    }), "utf8");

    if (code === 0) return res.json({ success: true, message: "Finalizado." });
    return res.status(500).json({ success: false, message: `Falhou (code ${code}).` });
  });

  child.on("error", (err) => {
    running = false;
    fs.appendFileSync(LOG_FILE, `\n[ERROR] ${String(err)}\n`);
    return res.status(500).json({ success: false, message: "Erro ao iniciar o processo." });
  });
});

// ─── Enhance: dispara run_server.bat (Real-ESRGAN) ───────────────────────────
app.post("/api/enhance", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo recebido." });
  }

  if (running) {
    return res.status(409).json({ error: "Já existe um processamento em andamento." });
  }

  ensureDirs();
  running = true;

  const fileName   = req.file.originalname;
  const baseName   = path.parse(fileName).name;
  const outputFile = baseName + ".png";
  const outputPath = path.join(OUTPUT_DIR, outputFile);

  console.log(`[ENHANCE] Arquivo recebido: ${fileName}`);

  // Remove arquivos antigos do /Input, mantém só o recém-chegado
  for (const arq of fs.readdirSync(INPUT_DIR)) {
    if (arq !== fileName) {
      fs.unlinkSync(path.join(INPUT_DIR, arq));
      console.log(`[ENHANCE] Removido do Input: ${arq}`);
    }
  }

  // Remove output antigo do mesmo arquivo
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
    console.log(`[ENHANCE] Output antigo removido: ${outputFile}`);
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  const args = [
    "-i", path.join(INPUT_DIR, fileName),  // arquivo → arquivo
    "-o", outputPath,                       // arquivo de saída direto
    "-s", "4",
    "-t", "256",
    "-n", "realesrgan-x4plus",
  ];

  console.log(`[ENHANCE] Chamando EXE com args:`, args.join(" "));

  const proc = spawn(EXE, args, {
    cwd: ENGINE_DIR,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  proc.stdout.on("data", d => console.log("[RR-OUT]", d.toString().trim()));
  proc.stderr.on("data", d => console.log("[RR-ERR]", d.toString().trim()));

  proc.on("close", (code) => {
    running = false;
    console.log(`[ENHANCE] realesrgan finalizado com code ${code}`);

    if (code !== 0) {
      return res.status(500).json({ error: `realesrgan falhou (code ${code})` });
    }

    if (!fs.existsSync(outputPath)) {
      console.error(`[ENHANCE] Output não encontrado: ${outputPath}`);
      return res.status(500).json({ error: "Processamento concluído mas output não foi gerado." });
    }

    console.log(`[ENHANCE] Output confirmado: ${outputFile}`);
    return res.json({ success: true, fileName: outputFile });
  });

  proc.on("error", (err) => {
    running = false;
    console.error("[ENHANCE] Erro ao chamar EXE:", err);
    return res.status(500).json({ error: "Erro ao iniciar o processamento." });
  });
});

// ─── Remove Watermark: blur agressivo sobre a imagem inteira ─────────────────
app.post("/api/remove-watermark", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Nenhum arquivo recebido." });

  const inputPath  = req.file.path;
  const outputName = path.parse(req.file.originalname).name + "_nowm.png";
  const outputPath = path.join(OUTPUT_DIR, outputName);

  try {
    // Estratégia: reduz + amplia para suavizar marcas d'água semitransparentes
    const meta = await sharp(inputPath).metadata();
    const w = meta.width;
    const h = meta.height;

    await sharp(inputPath)
      .resize(Math.round(w * 0.5), Math.round(h * 0.5))   // reduz 50%
      .resize(w, h, { kernel: sharp.kernel.lanczos3 })     // volta ao tamanho
      .png()
      .toFile(outputPath);

    fs.unlinkSync(inputPath);
    res.json({ success: true, fileName: outputName });
  } catch (err) {
    console.error("[REMOVE-WATERMARK]", err);
    res.status(500).json({ error: "Falha ao processar imagem." });
  }
});

// ─── Remove Background: Inference.py via Python ───────────────────────────────
app.post("/api/remove-background", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Nenhum arquivo recebido." });

  if (running) {
    return res.status(409).json({ error: "Já existe um processamento em andamento." });
  }

  ensureDirs();
  running = true;

  const fileName = req.file.originalname;
  const baseName = path.parse(fileName).name;
  const modo     = req.body.mode || "transparent";

  console.log(`[REMOVE-BG] Arquivo: ${fileName} | Modo: ${modo}`);

  // Copia imagem pro input do removedor de fundo
  const destInput = path.join(REMBG_INPUT, fileName);
  fs.copyFileSync(req.file.path, destInput);
  fs.unlinkSync(req.file.path);

  console.log(`[REMOVE-BG] Python: ${PY_FINAL}`);

  if (modo === "transparent") {
    // ── Step único: Inference.py --type rgba ─────────────────────────────────
    let responseSent = false; // ← flag aqui no modo transparente

    // modo transparent
    const proc = spawn(PY_FINAL, [
      INFERENCE,
      "--config", CONFIG,
      "--source", REMBG_INPUT,
      "--dest",   REMBG_OUTPUT,
      "--type",   "rgba",
    ], { cwd: ROOT, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });

    proc.stdout.on("data", d => console.log("[REMBG-OUT]", d.toString().trim()));
    proc.stderr.on("data", d => console.log("[REMBG-ERR]", d.toString().trim()));

    proc.on("close", (code) => {
      running = false;
      if (responseSent) return; // ← guarda
      responseSent = true;

      if (code !== 0) {
        return res.status(500).json({ error: `Inference.py falhou (code ${code})` });
      }

      const outputFile = baseName + ".png";
      const outputPath = path.join(REMBG_OUTPUT, outputFile);

      if (!fs.existsSync(outputPath)) {
        return res.status(500).json({ error: `Output transparente não encontrado: ${outputPath}` });
      }

      const finalName = baseName + "_transparent.png";
      const finalPath = path.join(OUTPUT_DIR, finalName);
      fs.copyFileSync(outputPath, finalPath);

      console.log(`[REMOVE-BG] Transparente concluído: ${finalName}`);
      res.json({ success: true, fileName: finalName });
    });

    proc.on("error", (err) => {
      running = false;
      if (responseSent) return; // ← guarda
      responseSent = true;
      console.error("[REMOVE-BG] Erro ao chamar Inference.py:", err);
      res.status(500).json({ error: "Erro ao iniciar Inference.py" });
    });

  } else {
    // ── Step 1: Inference.py → output_rgba ───────────────────────────────────
    let responseSent = false; // ← flag aqui no modo branco (cobre step1 e step2)

    // modo white – step1
    const step1 = spawn(PY_FINAL, [
      INFERENCE,
      "--config", CONFIG,
      "--source", REMBG_INPUT,
      "--dest",   REMBG_RGBA,
      "--type",   "rgba",
    ], { cwd: ROOT, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });

    step1.stdout.on("data", d => console.log("[REMBG-STEP1-OUT]", d.toString().trim()));
    step1.stderr.on("data", d => console.log("[REMBG-STEP1-ERR]", d.toString().trim()));

    step1.on("close", (code1) => {
      if (responseSent) return; // ← guarda

      if (code1 !== 0) {
        running = false;
        responseSent = true;
        return res.status(500).json({ error: `Inference.py falhou (code ${code1})` });
      }

      // modo white – step2
      const step2 = spawn(PY_FINAL, [CONVERTER], {
        cwd: ROOT,
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      });

      step2.stdout.on("data", d => console.log("[REMBG-STEP2-OUT]", d.toString().trim()));
      step2.stderr.on("data", d => console.log("[REMBG-STEP2-ERR]", d.toString().trim()));

      step2.on("close", (code2) => {
        running = false;
        if (responseSent) return; // ← guarda
        responseSent = true;

        if (code2 !== 0) {
          return res.status(500).json({ error: `converter_branco.py falhou (code ${code2})` });
        }

        const outputFile = baseName + ".jpg";
        const outputPath = path.join(REMBG_WHITE, outputFile);

        if (!fs.existsSync(outputPath)) {
          return res.status(500).json({ error: `Output branco não encontrado: ${outputPath}` });
        }

        const finalName = baseName + "_white.jpg";
        const finalPath = path.join(OUTPUT_DIR, finalName);
        fs.copyFileSync(outputPath, finalPath);

        console.log(`[REMOVE-BG] Branco concluído: ${finalName}`);
        res.json({ success: true, fileName: finalName });
      });

      step2.on("error", (err) => {
        running = false;
        if (responseSent) return; // ← guarda
        responseSent = true;
        console.error("[REMBG-STEP2] Erro ao chamar converter_branco.py:", err);
        res.status(500).json({ error: "Erro ao iniciar converter_branco.py" });
      });
    });

    step1.on("error", (err) => {
      running = false;
      if (responseSent) return; // ← guarda
      responseSent = true;
      console.error("[REMBG-STEP1] Erro ao chamar Inference.py:", err);
      res.status(500).json({ error: "Erro ao iniciar Inference.py" });
    });
  }
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

const METRICS_FILE = path.join(ROOT, "logs", "metrics.json");

app.get("/api/metrics", (req, res) => {
  try {
    if (!fs.existsSync(METRICS_FILE)) {
      return res.json({ status: "idle" });
    }
    const data = JSON.parse(fs.readFileSync(METRICS_FILE, "utf8"));
    res.json(data);
  } catch {
    res.json({ status: "idle" });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("API está funcionando 🚀");
});

console.log("ROOT:", ROOT);
console.log("INPUT_DIR:", INPUT_DIR);
console.log("OUTPUT_DIR:", OUTPUT_DIR);
console.log("EXE:", EXE);
console.log("EXE existe?", fs.existsSync(EXE));
console.log("REMBG_DIR:", REMBG_DIR);
console.log("REMBG_DIR existe?", fs.existsSync(REMBG_DIR));

app.listen(3001, () => console.log("API on http://localhost:3001"));
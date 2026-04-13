const express = require("express");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const si = require("systeminformation");
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");
const WebSocket = require('ws'); // <-- NOVO: Importa WebSocket

const app = express();
app.use(express.json());
app.use(cors());

const ROOT = path.resolve(__dirname, "..");

// Pasta que contém os I/Os do removedor de fundo
const REMBG_DIR = path.join(ROOT, "Removedor-de-Fundo");
const REMBG_INPUT = path.join(ROOT, "Input");
const REMBG_OUTPUT = path.join(ROOT, "output");
const REMBG_RGBA = path.join(ROOT, "output_rgba");
const REMBG_WHITE = path.join(ROOT, "output_white");

// Scripts Python na RAIZ do projeto
const INFERENCE = path.join(ROOT, "run", "Inference.py");
const CONFIG = path.join(ROOT, "configs", "extra_dataset", "Plus_Ultra.yaml");
const CONVERTER = path.join(ROOT, "converter_branco.py");

// Novos arquivos .bat para remoção de fundo
const REMBG_BAT_TRANSPARENT = path.join(ROOT, "remover_fundo.bat");
const REMBG_BAT_WHITE = path.join(ROOT, "remover_fundo_branco.bat");

// Python: .venv dentro de Removedor-de-Fundo
const PY_LOCAL = path.join(ROOT, ".venv", "Scripts", "python.exe");
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

function waitForFiles(dir, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const interval = setInterval(() => {
      const files = fs.readdirSync(dir);

      if (files.length > 0) {
        clearInterval(interval);
        resolve(files);
      }

      if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject("Timeout esperando arquivos");
      }
    }, 300);
  });
}

// ✅ 👇 COLOCA O HELPER AQUI (FORA DAS ROTAS)
function handleProcessOutput({ taskId, prefix }) {
  return (data) => {
    const output = data.toString();

    output.split("\n").forEach((line) => {
      const logLine = line.trim();
      if (!logLine) return;

      console.log(prefix, logLine);

      sendWsMessage(taskId, "log", {
        logLine: `${prefix} ${logLine}`,
      });

      if (logLine.startsWith("PROGRESS:")) {
        const progress = parseInt(logLine.split(":")[1]);
        sendWsMessage(taskId, "progress", { progress });
      }

      if (logLine.startsWith("STATUS:")) {
        const status = logLine.split(":")[1];
        sendWsMessage(taskId, "status", { status });
      }
    });
  };
}

let running = false;

function waitForFiles(dir, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const interval = setInterval(() => {
      const files = fs.readdirSync(dir);

      if (files.length > 0) {
        clearInterval(interval);
        resolve(files);
      }

      if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject("Timeout esperando arquivos");
      }
    }, 100);
  });
}

// ─── WebSocket Server ─────────────────────────────────────────────────────────
const wss = new WebSocket.Server({ noServer: true });

const clients = new Map(); // taskId -> WebSocket

wss.on('connection', ws => {
  console.log('Cliente WebSocket conectado.');
  ws.on('message', message => {
    const msg = JSON.parse(message.toString());
    if (msg.type === 'register' && msg.taskId) {
      clients.set(msg.taskId, ws);
      console.log(`Cliente registrado para taskId: ${msg.taskId}`);
    }
  });
  ws.on('close', () => {
    for (let [taskId, clientWs] of clients.entries()) {
      if (clientWs === ws) {
        clients.delete(taskId);
        console.log(`Cliente para taskId ${taskId} desconectado.`);
        break;
      }
    }
    console.log('Cliente WebSocket desconectado.');
  });
  ws.on('error', error => {
    console.error('Erro no WebSocket:', error);
  });
});

function sendWsMessage(taskId, type, payload) {
  console.log("[WS DEBUG]", { taskId, type, payload }); // 👈 ADICIONE AQUI

  const ws = clients.get(taskId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ taskId, type, ...payload }));
  } else {
    console.log("[WS ERRO] Cliente não encontrado ou conexão fechada:", taskId);
  }
}

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
    const [cpu, mem, memLayout, os, fileSystemSize, system, diskLayout] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.memLayout(),
      si.osInfo(),
      si.fsSize(),
      si.system(),
      si.diskLayout(),
    ]);

    const ramType = memLayout.length > 0
      ? [...new Set(memLayout.map(m => m.type).filter(Boolean))].join(', ')
      : 'N/D';

    const mainFs = fileSystemSize.find(d => d.mount === 'C:' || d.mount === '/') || fileSystemSize[0];
    const storageTotal = mainFs ? Math.round(mainFs.size / (1024 ** 3)) : null;
    const storageUsed = mainFs ? Math.round(mainFs.used / (1024 ** 3)) : null;
    const storageFree = mainFs ? Math.round(mainFs.available / (1024 ** 3)) : null;

    let mainDiskType = 'N/D';
    let mainDiskManufacturer = 'N/D';
    if (diskLayout.length > 0) {
      const physicalDisk = diskLayout.find(d => mainFs && d.device === mainFs.fs);
      if (physicalDisk) {
        mainDiskType = physicalDisk.type || 'N/D';
        mainDiskManufacturer = physicalDisk.vendor || 'N/D';
      } else if (diskLayout[0]) {
        mainDiskType = diskLayout[0].type || 'N/D';
        mainDiskManufacturer = diskLayout[0].vendor || 'N/D';
      }
    }

    res.json({
      machineId: system.uuid,
      cpuName: `${cpu.manufacturer} ${cpu.brand}`,
      cpuCores: cpu.physicalCores,
      cpuThreads: cpu.cores,
      cpuSpeed: cpu.speed,
      ramGB: Math.round(mem.total / 1024 / 1024 / 1024),
      ramType,
      platform: `${os.distro} ${os.release} (${os.arch})`,
      storageTotal,
      storageUsed,
      storageFree,
      mainDiskType,
      mainDiskManufacturer,
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
// Este endpoint não é usado pelo frontend atualmente, mas mantido por segurança
app.post("/api/upscale", (req, res) => {
  if (running) {
    return res.status(409).json({ success: false, message: "Já existe um processamento em andamento." });
  }

  ensureDirs();
  running = true;
  fs.writeFileSync(LOG_FILE, "", "utf8");

  const inputFiles = fs.readdirSync(INPUT_DIR).filter(f =>
    ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase())
  );
  const totalImagens = inputFiles.length;
  const startTime = Date.now();

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

  const filesBefore = fs.readdirSync(INPUT_DIR);
  console.log("[DEBUG INPUT FILES]:", filesBefore);

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

function clearInputDir() {
  if (!fs.existsSync(INPUT_DIR)) return;

  fs.readdirSync(INPUT_DIR).forEach(file => {
    const filePath = path.join(INPUT_DIR, file);

    if (fs.lstatSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  });
}

// ─── Enhance: dispara run_server.bat (Real-ESRGAN) ───────────────────────────
app.post("/api/enhance",(req, res, next) => {
    console.log("[ENHANCE] Limpando input antes do upload");
    clearInputDir();
    next();
  },
  upload.array("images", 50), async (req, res) => {
  const taskId = req.headers['x-task-id']; // <-- NOVO: Pega o taskId do cabeçalho
  console.log("[ENHANCE] Requisição recebida. TaskId:", taskId, "Body:", req.body); // Debug

  if (!taskId) {
    return res.status(400).json({ error: "taskId é obrigatório (via cabeçalho X-Task-Id)." });
  }
  if (!req.files || req.files.length === 0) {
    sendWsMessage(taskId, 'error', { message: "Nenhum arquivo recebido." });
    return res.status(400).json({ error: "Nenhum arquivo recebido." });
  }

  if (running) {
    sendWsMessage(taskId, 'error', { message: "Já existe um processamento em andamento." });
    return res.status(409).json({ error: "Já existe um processamento em andamento." });
  }

  ensureDirs();
  running = true;

  const files = req.files;

  console.log(`[ENHANCE] Limpando input para novo lote`);
  sendWsMessage(taskId, 'log', { logLine: `[ENHANCE] Limpando input para novo lote` });

  // 🔥 limpa outputs antigos (IMPORTANTE em lote)
  
  const prefixes = req.files.map(f => path.parse(f.originalname).name);

  fs.readdirSync(OUTPUT_DIR).forEach(file => {
    const shouldDelete = prefixes.some(prefix => file.startsWith(prefix));
    if (shouldDelete) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  });

  console.log(`[ENHANCE] Limpando outputs antigos`);
  sendWsMessage(taskId, 'log', { logLine: `[ENHANCE] Limpando outputs antigos` });

  const args = [
    "-i", INPUT_DIR,
    "-o", OUTPUT_DIR,
    "-s", "4",
    "-t", "256",
    "-n", "realesrgan-x4plus",
  ];

  console.log(`[ENHANCE] Chamando EXE com args:`, args.join(" "));
  sendWsMessage(taskId, 'log', { logLine: `[ENHANCE] Chamando EXE com args: ${args.join(" ")}` });

  const filesBefore = fs.readdirSync(INPUT_DIR);
  console.log("[DEBUG INPUT FILES]:", filesBefore);

  const proc = spawn(EXE, args, {
    cwd: ENGINE_DIR,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  proc.stdout.on("data", d => {
    const logLine = d.toString().trim();
    console.log("[RR-OUT]", logLine);
    sendWsMessage(taskId, 'log', { logLine: `[RR-OUT] ${logLine}` });

    const progressMatch = logLine.match(/(\d{1,3}(?:[.,]\d{1,2})?)%/);
    if (progressMatch) {
      const progress = parseFloat(progressMatch[1].replace(',', '.'));
      sendWsMessage(taskId, 'progress', { progress: Math.min(progress, 99) });
    }
  });
  proc.stderr.on("data", d => {
    const logLine = d.toString().trim();
    console.log("[RR-ERR]", logLine);
    sendWsMessage(taskId, 'log', { logLine: `[RR-ERR] ${logLine}` });

    const progressMatch = logLine.match(/(\d{1,3}(?:[.,]\d{1,2})?)%/);
    if (progressMatch) {
      const progress = parseFloat(progressMatch[1].replace(',', '.'));
      sendWsMessage(taskId, 'progress', { progress: Math.min(progress, 99) });
    }
  });

  proc.on("close", async (code) => {
    running = false;
    console.log(`[ENHANCE] realesrgan finalizado com code ${code}`);
    sendWsMessage(taskId, 'log', { logLine: `[ENHANCE] realesrgan finalizado com code ${code}` });

    if (code !== 0) {
      sendWsMessage(taskId, 'error', { message: `realesrgan falhou (code ${code})` });
      return res.status(500).json({ error: `realesrgan falhou (code ${code})` });
    }

    // ✅ NOVA LÓGICA PARA LOTE
    let outputs;
    try {
      outputs = await waitForFiles(OUTPUT_DIR, 15000);
    } catch (err) {
      console.error("[ENHANCE] Timeout esperando outputs");
      sendWsMessage(taskId, 'error', {
        message: "Timeout aguardando geração dos arquivos."
      });
      return res.status(500).json({
        error: "Timeout aguardando output."
      });
    }

    // filtra só imagens
    outputs = outputs.filter(f =>
      [".png", ".jpg", ".jpeg", ".webp"].includes(path.extname(f).toLowerCase())
    );

    if (!outputs || outputs.length === 0) {
      console.error("[ENHANCE] Nenhum arquivo foi gerado no output.");
      sendWsMessage(taskId, 'error', {
        message: "Processamento concluído mas nenhum output foi gerado."
      });
      return res.status(500).json({
        error: "Nenhum output foi gerado."
      });
    }

    console.log(`[ENHANCE] Outputs gerados:`, outputs);
    sendWsMessage(taskId, 'log', {
      logLine: `[ENHANCE] ${outputs.length} arquivo(s) gerado(s)`
    });

    // ✅ ENVIA TODOS OS ARQUIVOS
    sendWsMessage(taskId, 'complete', { files: outputs });

    return res.json({
      success: true,
      files: outputs
    });
  });

  proc.on("error", (err) => {
    running = false;
    console.error("[ENHANCE] Erro ao chamar EXE:", err);
    sendWsMessage(taskId, 'error', { message: "Erro ao iniciar o processamento." });
    return res.status(500).json({ error: "Erro ao iniciar o processamento." });
  });
});

// ─── Remove Watermark: blur agressivo sobre a imagem inteira ─────────────────
app.post("/api/remove-watermark", upload.single("image"), async (req, res) => {
  const taskId = req.headers['x-task-id'];
  console.log("[REMOVE-WM] Requisição recebida. TaskId:", taskId, "Body:", req.body);

  if (!taskId) {
    return res.status(400).json({ error: "taskId é obrigatório (via cabeçalho X-Task-Id)." });
  }
  if (!req.file) {
    sendWsMessage(taskId, 'error', { message: "Nenhum arquivo recebido." });
    return res.status(400).json({ error: "Nenhum arquivo recebido." });
  }

  const inputPath = file.path;
  const outputName = path.parse(file.originalname).name + "_nowm.png";
  const outputPath = path.join(OUTPUT_DIR, outputName);

  sendWsMessage(taskId, 'log', { logLine: `[REMOVE-WM] Iniciando remoção de marca d'água para ${file.originalname}` });
  sendWsMessage(taskId, 'progress', { progress: 5 });

  try {
    const meta = await sharp(inputPath).metadata();
    const w = meta.width;
    const h = meta.height;

    sendWsMessage(taskId, 'progress', { progress: 20 });

    await sharp(inputPath)
      .resize(Math.round(w * 0.5), Math.round(h * 0.5))
      .resize(w, h, { kernel: sharp.kernel.lanczos3 })
      .png()
      .toFile(outputPath);

    sendWsMessage(taskId, 'progress', { progress: 80 });

    fs.unlinkSync(inputPath);
    sendWsMessage(taskId, 'log', { logLine: `[REMOVE-WM] Arquivo temporário removido: ${inputPath}` });
    sendWsMessage(taskId, 'complete', { fileName: outputName });
    res.json({ success: true, fileName: outputName });
  } catch (err) {
    console.error("[REMOVE-WATERMARK]", err);
    sendWsMessage(taskId, 'error', { message: "Falha ao processar imagem." });
    res.status(500).json({ error: "Falha ao processar imagem." });
  }
});

// ─── Remove Background: via BAT ───────────────────────────────────────────────
app.post("/api/remove-background", upload.array("images", 50), async (req, res) => {
  const taskId = req.headers["x-task-id"];
  const modo = req.headers["x-bg-mode"] || "transparent";

  if (!taskId) return res.status(400).json({ error: "taskId é obrigatório." });
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Nenhum arquivo recebido." });
  }
  if (running) {
    return res.status(409).json({ error: "Já existe um processamento em andamento." });
  }

  ensureDirs();
  running = true;

  const results = [];

  const finalOutputFolder =
    modo === "transparent" ? REMBG_OUTPUT : REMBG_WHITE;

  const expectedExt =
    modo === "transparent" ? ".png" : ".jpg";

  const batToExecute =
    modo === "transparent" ? REMBG_BAT_TRANSPARENT : REMBG_BAT_WHITE;

  // ✅ LIMPA APENAS UMA VEZ
  try {
    for (const f of fs.readdirSync(finalOutputFolder)) {
      if (f.toLowerCase().endsWith(expectedExt)) {
        fs.unlinkSync(path.join(finalOutputFolder, f));
      }
    }
  } catch {}

  for (const file of req.files) {
    const originalName = path.basename(file.originalname);
    const baseName = path.parse(originalName).name;

    const destInput = path.join(INPUT_DIR, originalName);

    if (file.path !== destInput) {
      fs.copyFileSync(file.path, destInput);
    }

    sendWsMessage(taskId, "log", {
      logLine: `[REMOVE-BG] Processando: ${originalName}`
    });

    await new Promise((resolve, reject) => {
      const proc = spawn("cmd.exe", [
        "/c",
        batToExecute,
        destInput
      ], {
        cwd: ROOT,
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      });

      proc.stdout.on("data", handleProcessOutput({
        taskId,
        prefix: "[REMOVE-BG]"
      }));

      proc.stderr.on("data", handleProcessOutput({
        taskId,
        prefix: "[REMOVE-BG-ERR]"
      }));

      proc.on("close", (code) => {
        if (code !== 0) return reject(`Erro no BAT (${originalName})`);
        resolve();
      });

      proc.on("error", reject);
    });

    // 🔎 pega o output gerado MAIS RECENTE
    const candidates = fs.readdirSync(finalOutputFolder)
      .filter(f => f.toLowerCase().endsWith(expectedExt))
      .map(f => ({
        name: f,
        time: fs.statSync(path.join(finalOutputFolder, f)).mtimeMs
      }))
      .sort((a, b) => b.time - a.time);

    if (candidates.length === 0) continue;

    const match = candidates.find(f => f.name.startsWith(baseName));

    if (!match) {
      console.warn(`[REMOVE-BG] Nenhum arquivo correspondente para ${baseName}`);
      continue;
    }

    const latest = match.name;
    
    const finalName = baseName + expectedExt;
    const finalPath = path.join(OUTPUT_DIR, finalName);

    fs.copyFileSync(
      path.join(finalOutputFolder, latest),
      finalPath
    );

    results.push(finalName);

    sendWsMessage(taskId, "log", {
      logLine: `[REMOVE-BG] Gerado: ${finalName}`
    });
  }

  running = false;

  sendWsMessage(taskId, "complete", {
    files: results
  });

  return res.json({
    success: true,
    files: results
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

  const filePath = path.join(OUTPUT_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    console.error("[RESULTADO] Não encontrado:", filePath);
    return res.status(404).json({
      error: `Arquivo não encontrado: ${fileName}`,
    });
  }

  if (!filePath) {
    console.error(`[RESULTADO] Não encontrado em /output: ${fileName}`);
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

  const filesBefore = fs.readdirSync(INPUT_DIR);
  console.log("[DEBUG INPUT FILES]:", filesBefore);

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

const server = app.listen(3001, () => console.log("API on http://localhost:3001"));

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});
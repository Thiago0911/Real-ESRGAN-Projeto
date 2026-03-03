import fs from "fs";
import path from "path";

const root = process.cwd();

const artisanDist = path.join(root, "image-artisan", "dist");
const landingDist = path.join(root, "dist");
const target = path.join(landingDist, "app");

function rmDirSafe(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error("❌ Não achei o dist do image-artisan:", src);
    process.exit(1);
  }
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

rmDirSafe(target);
copyDir(artisanDist, target);

console.log("✅ Copiado image-artisan/dist para dist/app");
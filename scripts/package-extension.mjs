import { existsSync } from "node:fs";
import { cp, mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import manifest from "../manifest.json" with { type: "json" };

const root = process.cwd();
const dist = resolve(root, "dist");
const packageDir = resolve(dist, `legacy-workspace-favicons-${manifest.version}`);
const zipPath = resolve(dist, `legacy-workspace-favicons-${manifest.version}.zip`);

await rm(dist, { recursive: true, force: true });
await mkdir(packageDir, { recursive: true });

for (const entry of [
  "manifest.json",
  "content.js",
  "icons",
  "README.md",
  "CHANGELOG.md",
  "LICENSE",
  "PRIVACY.md",
  "SECURITY.md",
  "ASSETS.md"
]) {
  const source = resolve(root, entry);
  if (existsSync(source)) {
    await cp(source, resolve(packageDir, entry), { recursive: true });
  }
}

const zip = spawnSync("zip", ["-qr", zipPath, "."], {
  cwd: packageDir,
  stdio: "inherit"
});

if (zip.status !== 0) {
  throw new Error("zip command failed");
}

console.log(`Packaged ${zipPath}`);

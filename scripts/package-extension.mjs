import { existsSync } from "node:fs";
import { cp, mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import manifest from "../manifest.json" with { type: "json" };

const root = process.cwd();
const dist = resolve(root, "dist");
const packageDir = resolve(dist, `classic-workspace-tabs-${manifest.version}`);
const zipPath = resolve(dist, `classic-workspace-tabs-${manifest.version}.zip`);
const privateIconsFlagIndex = process.argv.indexOf("--private-icons");
const privateIconsArg =
  privateIconsFlagIndex === -1 ? null : process.argv[privateIconsFlagIndex + 1];
const privateIconDir =
  privateIconsFlagIndex === -1 ? null : resolve(root, privateIconsArg || "");
const productIconPaths = manifest.web_accessible_resources
  .flatMap((block) => block.resources || [])
  .filter((resource) => resource.startsWith("icons/") && resource.endsWith(".svg"));

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

if (privateIconDir) {
  if (!privateIconsArg || privateIconsArg.startsWith("--")) {
    throw new Error("missing path after --private-icons");
  }

  if (!existsSync(privateIconDir)) {
    throw new Error(`private icon directory does not exist: ${privateIconDir}`);
  }

  for (const iconPath of productIconPaths) {
    const iconName = iconPath.replace("icons/", "");
    const source = resolve(privateIconDir, iconName);

    if (!existsSync(source)) {
      throw new Error(`missing private icon: ${source}`);
    }

    await cp(source, resolve(packageDir, iconPath));
  }

  console.log(`Overlayed private icons from ${privateIconDir}`);
}

const zip = spawnSync("zip", ["-qr", zipPath, "."], {
  cwd: packageDir,
  stdio: "inherit"
});

if (zip.status !== 0) {
  throw new Error("zip command failed");
}

console.log(`Packaged ${zipPath}`);

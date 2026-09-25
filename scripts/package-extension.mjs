import { existsSync } from "node:fs";
import { cp, mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import sharp from "sharp";
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
const productNames = [
  "gmail", "calendar", "drive", "docs", "sheets", "slides", "forms",
  "meet", "chat", "keep", "contacts", "tasks", "voice", "admin"
];
const runtimeResources = manifest.web_accessible_resources
  .flatMap((block) => block.resources || []);

if (privateIconDir) {
  if (!privateIconsArg || privateIconsArg.startsWith("--")) {
    throw new Error("missing path after --private-icons");
  }
  if (!existsSync(privateIconDir)) {
    throw new Error(`private icon directory does not exist: ${privateIconDir}`);
  }
  for (const name of productNames) {
    const source = resolve(privateIconDir, `${name}.svg`);
    if (!existsSync(source)) throw new Error(`missing private icon: ${source}`);
  }
}

await mkdir(dist, { recursive: true });
await rm(packageDir, { recursive: true, force: true });
await rm(zipPath, { force: true });
await mkdir(resolve(packageDir, "icons"), { recursive: true });

for (const entry of [
  "manifest.json", "content.js", "_locales", "README.md", "CHANGELOG.md",
  "LICENSE", "PRIVACY.md", "SECURITY.md", "ASSETS.md"
]) {
  const source = resolve(root, entry);
  if (existsSync(source)) await cp(source, resolve(packageDir, entry), { recursive: true });
}

for (const iconPath of Object.values(manifest.icons)) {
  await cp(resolve(root, iconPath), resolve(packageDir, iconPath));
}

for (const resource of runtimeResources) {
  if (resource === "icons/calendar-days/*.png") {
    await cp(resolve(root, "icons", "calendar-days"), resolve(packageDir, "icons", "calendar-days"), { recursive: true });
    continue;
  }
  if (resource.includes("*")) throw new Error(`unsupported resource wildcard: ${resource}`);

  const privateSource = privateIconDir
    ? resolve(privateIconDir, resource.replace(/^icons\//, "").replace(/\.(png|svg)$/, ".svg"))
    : null;
  const destination = resolve(packageDir, resource);

  if (!privateSource) {
    await cp(resolve(root, resource), destination);
  } else if (resource.endsWith(".png")) {
    await sharp(privateSource, { density: 256 }).resize(128, 128).png().toFile(destination);
  } else {
    await cp(privateSource, destination);
  }
}

if (privateIconDir) {
  const calendarIcons = spawnSync(
    process.execPath,
    [
      resolve(root, "scripts", "generate-calendar-icons.mjs"),
      "--root", packageDir,
      "--private-svg", resolve(privateIconDir, "calendar.svg")
    ],
    { cwd: root, stdio: "inherit" }
  );
  if (calendarIcons.status !== 0) throw new Error("Private Calendar icon generation failed");
  console.log(`Overlayed private icons from ${privateIconDir}`);
}

const zip = spawnSync("zip", ["-qr", zipPath, "."], {
  cwd: packageDir,
  stdio: "inherit"
});
if (zip.status !== 0) throw new Error("zip command failed");
console.log(`Packaged ${zipPath}`);

import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const sourceDir = resolve(root, "site");
const outputDir = resolve(root, "site-dist");
const iconOutputDir = resolve(outputDir, "assets", "icons");

await rm(outputDir, { recursive: true, force: true });
await cp(sourceDir, outputDir, { recursive: true });
await mkdir(iconOutputDir, { recursive: true });

for (const icon of [
  "gmail.svg",
  "calendar.svg",
  "drive.svg",
  "docs.svg",
  "sheets.svg",
  "slides.svg",
  "meet.svg",
  "chat.svg"
]) {
  await cp(resolve(root, "icons", icon), resolve(iconOutputDir, icon));
}

await cp(
  resolve(root, "icons", "calendar-days"),
  resolve(iconOutputDir, "calendar-days"),
  { recursive: true }
);

console.log(`Built landing page in ${outputDir}.`);

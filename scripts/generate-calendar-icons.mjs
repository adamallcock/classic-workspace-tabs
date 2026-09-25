import { cp, mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const rootFlagIndex = process.argv.indexOf("--root");
const rootArg = rootFlagIndex === -1 ? null : process.argv[rootFlagIndex + 1];
const privateSvgFlagIndex = process.argv.indexOf("--private-svg");
const privateSvgArg = privateSvgFlagIndex === -1 ? null : process.argv[privateSvgFlagIndex + 1];

if (rootFlagIndex !== -1 && (!rootArg || rootArg.startsWith("--"))) {
  throw new Error("missing path after --root");
}
if (privateSvgFlagIndex !== -1 && (!privateSvgArg || privateSvgArg.startsWith("--"))) {
  throw new Error("missing path after --private-svg");
}

const root = rootArg ? resolve(process.cwd(), rootArg) : process.cwd();
const outputDir = resolve(root, "icons", "calendar-days");
const sourceDir = resolve(process.cwd(), "source-assets", "calendar-days");
const privateSvg = privateSvgArg ? await readFile(resolve(process.cwd(), privateSvgArg)) : null;

await mkdir(outputDir, { recursive: true });

function dateOverlay(day) {
  const label = String(day);
  const fontSize = label.length === 1 ? 44 : 39;

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect x="33" y="38" width="56" height="47" fill="#ffffff"/>
      <text
        x="61"
        y="78"
        fill="#1a73e8"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${fontSize}"
        font-weight="700"
        text-anchor="middle"
      >${label}</text>
    </svg>
  `);
}

for (let day = 1; day <= 31; day += 1) {
  const fileName = `${String(day).padStart(2, "0")}.png`;
  const output = resolve(outputDir, fileName);

  if (!privateSvg) {
    await cp(resolve(sourceDir, fileName), output);
    continue;
  }

  await sharp(privateSvg, { density: 256 })
    .resize(128, 128)
    .composite([{ input: dateOverlay(day), blend: "over" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
}

console.log(`Generated 31 Calendar date icons in ${outputDir}.`);

import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const iconDir = resolve(root, "icons");
await mkdir(iconDir, { recursive: true });

function svg(size) {
  const fontSize = Math.max(6, Math.round(size * 0.3));
  const radius = Math.max(3, Math.round(size * 0.14));
  const tabHeight = Math.round(size * 0.62);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" rx="${radius}" fill="#1f2937"/>
      <rect x="${Math.round(size * 0.16)}" y="${Math.round(size * 0.22)}" width="${Math.round(size * 0.68)}" height="${tabHeight}" rx="${Math.round(size * 0.08)}" fill="#f9fafb"/>
      <rect x="${Math.round(size * 0.16)}" y="${Math.round(size * 0.22)}" width="${Math.round(size * 0.24)}" height="${Math.round(size * 0.18)}" rx="${Math.round(size * 0.04)}" fill="#2563eb"/>
      <rect x="${Math.round(size * 0.44)}" y="${Math.round(size * 0.22)}" width="${Math.round(size * 0.18)}" height="${Math.round(size * 0.18)}" rx="${Math.round(size * 0.04)}" fill="#dc2626"/>
      <rect x="${Math.round(size * 0.66)}" y="${Math.round(size * 0.22)}" width="${Math.round(size * 0.18)}" height="${Math.round(size * 0.18)}" rx="${Math.round(size * 0.04)}" fill="#16a34a"/>
      <text x="50%" y="${Math.round(size * 0.72)}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="#111827">LWF</text>
    </svg>
  `;
}

for (const size of [16, 32, 48, 128]) {
  await sharp(Buffer.from(svg(size))).png().toFile(resolve(iconDir, `extension-${size}.png`));
}

console.log("Generated extension PNG icons.");


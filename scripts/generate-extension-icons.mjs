import { cp, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const iconDir = resolve(root, "icons");
const sourceIcon = resolve(root, "store-assets", "store-icon-128.png");
await mkdir(iconDir, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  const destination = resolve(iconDir, `extension-${size}.png`);

  if (size === 128) {
    await cp(sourceIcon, destination);
    continue;
  }

  await sharp(sourceIcon)
    .resize(size, size, { fit: "cover" })
    .png()
    .toFile(destination);
}

console.log("Generated extension PNG icons.");

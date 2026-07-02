import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("generates extension icons from the Chrome Web Store icon asset", async () => {
  const tempRoot = await mkdtemp(resolve(tmpdir(), "classic-workspace-tabs-icons-"));

  try {
    await cp(
      resolve(root, "store-assets", "store-icon-128.png"),
      resolve(tempRoot, "store-assets", "store-icon-128.png")
    );

    execFileSync(process.execPath, [resolve(root, "scripts", "generate-extension-icons.mjs")], {
      cwd: tempRoot,
      stdio: "pipe"
    });

    const [sourceIcon, generatedIcon] = await Promise.all([
      readFile(resolve(tempRoot, "store-assets", "store-icon-128.png")),
      readFile(resolve(tempRoot, "icons", "extension-128.png"))
    ]);

    assert.deepEqual(generatedIcon, sourceIcon);

    for (const size of [16, 32, 48, 128]) {
      const metadata = await sharp(resolve(tempRoot, "icons", `extension-${size}.png`)).metadata();
      assert.equal(metadata.width, size);
      assert.equal(metadata.height, size);
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

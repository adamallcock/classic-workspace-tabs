import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("generates one 128px PNG Calendar icon for every possible day", async () => {
  const tempRoot = await mkdtemp(resolve(tmpdir(), "classic-workspace-tabs-calendar-"));

  try {
    await mkdir(resolve(tempRoot, "icons"), { recursive: true });
    await cp(resolve(root, "icons", "calendar.svg"), resolve(tempRoot, "icons", "calendar.svg"));

    execFileSync(
      process.execPath,
      [resolve(root, "scripts", "generate-calendar-icons.mjs"), "--root", tempRoot],
      { cwd: root, stdio: "pipe" }
    );

    const outputDir = resolve(tempRoot, "icons", "calendar-days");
    const files = (await readdir(outputDir)).sort();

    assert.equal(files.length, 31);
    assert.equal(files[0], "01.png");
    assert.equal(files.at(-1), "31.png");

    const metadata = await sharp(resolve(outputDir, "16.png")).metadata();
    assert.equal(metadata.width, 128);
    assert.equal(metadata.height, 128);
    assert.equal(metadata.format, "png");

    const [dayOne, dayThirtyOne] = await Promise.all([
      readFile(resolve(outputDir, "01.png")),
      readFile(resolve(outputDir, "31.png"))
    ]);
    assert.notDeepEqual(dayOne, dayThirtyOne);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

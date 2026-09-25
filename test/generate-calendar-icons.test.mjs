import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("copies the 31 bundled, original Calendar date icons without changing their bytes", async () => {
  const tempRoot = await mkdtemp(resolve(tmpdir(), "classic-workspace-tabs-calendar-"));

  try {
    await mkdir(resolve(tempRoot, "icons"), { recursive: true });
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

    const distinctDays = new Set();
    for (const fileName of files) {
      const output = await readFile(resolve(outputDir, fileName));
      const source = await readFile(resolve(root, "source-assets", "calendar-days", fileName));
      const metadata = await sharp(output).metadata();
      assert.equal(metadata.width, 32, fileName);
      assert.equal(metadata.height, 32, fileName);
      assert.equal(metadata.format, "png", fileName);
      assert.deepEqual(output, source, fileName);
      distinctDays.add(output.toString("base64"));
    }
    assert.equal(distinctDays.size, 31);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("renders a private Calendar SVG into 31 distinct date icons", async () => {
  const tempRoot = await mkdtemp(resolve(tmpdir(), "classic-workspace-tabs-private-calendar-"));

  try {
    const svgPath = resolve(tempRoot, "calendar.svg");
    await writeFile(svgPath, '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="blue"/></svg>');
    execFileSync(
      process.execPath,
      [resolve(root, "scripts", "generate-calendar-icons.mjs"), "--root", tempRoot, "--private-svg", svgPath],
      { cwd: root, stdio: "pipe" }
    );
    const outputDir = resolve(tempRoot, "icons", "calendar-days");
    assert.equal((await readdir(outputDir)).length, 31);
    assert.notDeepEqual(
      await readFile(resolve(outputDir, "01.png")),
      await readFile(resolve(outputDir, "31.png"))
    );
    const metadata = await sharp(resolve(outputDir, "01.png")).metadata();
    assert.equal(metadata.width, 128);
    assert.equal(metadata.height, 128);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

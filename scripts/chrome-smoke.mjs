import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:https";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";

const projectRoot = process.cwd();
const extensionRoot = process.argv[2] ? resolve(projectRoot, process.argv[2]) : projectRoot;
const userDataDir = await mkdtemp(resolve(tmpdir(), "lwf-chrome-profile-"));
const certDir = await mkdtemp(resolve(tmpdir(), "lwf-cert-"));
const keyPath = resolve(certDir, "key.pem");
const certPath = resolve(certDir, "cert.pem");

const openssl = spawnSync(
  "openssl",
  [
    "req",
    "-x509",
    "-newkey",
    "rsa:2048",
    "-nodes",
    "-sha256",
    "-days",
    "1",
    "-subj",
    "/CN=mail.google.com",
    "-addext",
    "subjectAltName=DNS:mail.google.com,DNS:docs.google.com,DNS:www.google.com",
    "-keyout",
    keyPath,
    "-out",
    certPath
  ],
  { stdio: "ignore" }
);

if (openssl.status !== 0) {
  throw new Error("Could not generate local HTTPS certificate with openssl");
}

const server = createServer(
  {
    key: await readFile(keyPath),
    cert: await readFile(certPath)
  },
  (request, response) => {
    response.setHeader("content-type", "text/html; charset=utf-8");
    response.end(`<!doctype html>
      <html>
        <head>
          <title>${request.headers.host}</title>
          <link rel="icon" href="/favicon.ico">
          <link rel="stylesheet" href="/style.css">
        </head>
        <body><main>local smoke fixture</main></body>
      </html>`);
  }
);

await new Promise((resolveServer) => server.listen(0, "127.0.0.1", resolveServer));
const { port } = server.address();
let context;

try {
  context = await chromium.launchPersistentContext(userDataDir, {
    channel: "chromium",
    headless: true,
    args: [
      `--disable-extensions-except=${extensionRoot}`,
      `--load-extension=${extensionRoot}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--ignore-certificate-errors",
      `--host-resolver-rules=MAP mail.google.com 127.0.0.1:${port}, MAP docs.google.com 127.0.0.1:${port}, MAP www.google.com 127.0.0.1:${port}`
    ]
  });

  const page = await context.newPage();

  await page.goto("https://mail.google.com/mail/u/0/", {
    waitUntil: "domcontentloaded"
  });
  try {
    await page.waitForFunction(
      () => Boolean(document.head.querySelector('link[data-legacy-workspace-favicon="true"]')),
      null,
      { timeout: 10000 }
    );
  } catch (error) {
    const diagnostics = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      readyState: document.readyState,
      head: document.head.innerHTML,
      linkCount: document.head.querySelectorAll("link").length,
      markerCount: document.head.querySelectorAll('link[data-legacy-workspace-favicon="true"]').length
    }));
    console.error(JSON.stringify(diagnostics, null, 2));
    const extensionsPage = await context.newPage();
    await extensionsPage.goto("chrome://extensions", { waitUntil: "domcontentloaded" });
    await extensionsPage.waitForTimeout(1000);
    const extensionDiagnostics = await extensionsPage.evaluate(() => {
      const manager = document.querySelector("extensions-manager");
      const managerRoot = manager && manager.shadowRoot;
      const itemList = managerRoot && managerRoot.querySelector("extensions-item-list");
      const itemRoot = itemList && itemList.shadowRoot;
      const items = itemRoot ? Array.from(itemRoot.querySelectorAll("extensions-item")) : [];

      return items.map((item) => {
        const root = item.shadowRoot;
        return {
          name: root && root.querySelector("#name") && root.querySelector("#name").textContent.trim(),
          id: item.getAttribute("id"),
          enabled: item.hasAttribute("enabled"),
          errors: root && root.textContent.includes("Errors")
        };
      });
    });
    console.error(JSON.stringify({ extensions: extensionDiagnostics }, null, 2));
    throw error;
  }

  const gmail = await page.evaluate(async () => {
    const link = document.head.querySelector('link[data-legacy-workspace-favicon="true"]');
    const response = await fetch(link.href);
    return {
      app: link.dataset.legacyWorkspaceApp,
      href: link.href,
      fetchOk: response.ok
    };
  });

  if (gmail.app !== "Gmail" || !gmail.href.endsWith("/icons/gmail.svg") || !gmail.fetchOk) {
    throw new Error(`Gmail smoke failed: ${JSON.stringify(gmail)}`);
  }

  await page.goto("https://docs.google.com/spreadsheets/d/local/edit", {
    waitUntil: "domcontentloaded"
  });
  await page.waitForFunction(
    () => Boolean(document.head.querySelector('link[data-legacy-workspace-favicon="true"]')),
    null,
    { timeout: 10000 }
  );

  const sheets = await page.evaluate(() => {
    const link = document.head.querySelector('link[data-legacy-workspace-favicon="true"]');
    return {
      app: link.dataset.legacyWorkspaceApp,
      href: link.href
    };
  });

  if (sheets.app !== "Google Sheets" || !sheets.href.endsWith("/icons/sheets.svg")) {
    throw new Error(`Sheets smoke failed: ${JSON.stringify(sheets)}`);
  }

  await page.goto("https://www.google.com/search?q=favicon", {
    waitUntil: "domcontentloaded"
  });
  await page.waitForTimeout(500);

  const unsupportedMarkerCount = await page.locator('link[data-legacy-workspace-favicon="true"]').count();
  if (unsupportedMarkerCount !== 0) {
    throw new Error("Unsupported Google Search page was modified");
  }

  console.log(`Chrome smoke test passed for ${extensionRoot}.`);
} finally {
  if (context) await context.close();
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(userDataDir, { recursive: true, force: true });
  await rm(certDir, { recursive: true, force: true });
}

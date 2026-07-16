import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { JSDOM } from "jsdom";
import sharp from "sharp";

const root = process.cwd();
const siteRoot = resolve(root, "site-dist");
const errors = [];
const pages = [
  { path: "index.html", locale: "en" },
  { path: "es/index.html", locale: "es" },
  { path: "de/index.html", locale: "de" }
];

function fail(message) {
  errors.push(message);
}

function assertFile(path, label = path) {
  if (!existsSync(resolve(siteRoot, path))) fail(`missing ${label}: ${path}`);
}

for (const required of [".nojekyll", "app.js", "styles.css", "robots.txt", "sitemap.xml"]) {
  assertFile(required);
}

for (const { path, locale } of pages) {
  const absolutePath = resolve(siteRoot, path);
  assertFile(path, `${locale} page`);
  if (!existsSync(absolutePath)) continue;

  const html = readFileSync(absolutePath, "utf8");
  const dom = new JSDOM(html);
  const { document } = dom.window;

  if (document.documentElement.lang !== locale) {
    fail(`${path} must use lang="${locale}"`);
  }

  if (!document.title) fail(`${path} must have a title`);
  if (!document.querySelector('meta[name="description"]')?.content) {
    fail(`${path} must have a meta description`);
  }
  if (!document.querySelector('link[rel="canonical"]')?.href) {
    fail(`${path} must have a canonical URL`);
  }

  const hreflangs = new Set(
    Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map(
      (link) => link.hreflang
    )
  );
  for (const expected of ["en", "es", "de", "x-default"]) {
    if (!hreflangs.has(expected)) fail(`${path} is missing hreflang ${expected}`);
  }

  if (document.querySelector('meta[name="twitter:card"]')?.content !== "summary_large_image") {
    fail(`${path} must use twitter:card=summary_large_image`);
  }

  const storeLinks = Array.from(
    document.querySelectorAll('a[href*="chromewebstore.google.com"]')
  );

  if (storeLinks.length < 3) fail(`${path} should include three store calls to action`);

  for (const link of storeLinks) {
    const url = new URL(link.href);
    for (const parameter of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
      if (!url.searchParams.get(parameter)) {
        fail(`${path} store link is missing ${parameter}`);
      }
    }
  }

  if (/googletagmanager|google-analytics|gtag\s*\(/i.test(html)) {
    fail(`${path} must not include site analytics`);
  }

  for (const image of document.querySelectorAll("img[src]")) {
    const source = image.getAttribute("src");
    if (/^(?:https?:)?\/\//.test(source)) continue;

    const imagePath = resolve(dirname(absolutePath), source);
    if (!existsSync(imagePath)) fail(`${path} references missing image: ${source}`);
  }
}

const appScript = readFileSync(resolve(siteRoot, "app.js"), "utf8");
if (/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/.test(appScript)) {
  fail("site app.js must remain network-free and storage-free");
}

const robots = readFileSync(resolve(siteRoot, "robots.txt"), "utf8");
if (!/User-agent:\s*\*/.test(robots) || !/Allow:\s*\//.test(robots)) {
  fail("robots.txt must allow crawling");
}
if (!/Sitemap:\s*https:\/\/adamallcock\.github\.io\/classic-workspace-tabs\/sitemap\.xml/.test(robots)) {
  fail("robots.txt must advertise the production sitemap");
}

const sitemap = readFileSync(resolve(siteRoot, "sitemap.xml"), "utf8");
for (const url of [
  "https://adamallcock.github.io/classic-workspace-tabs/",
  "https://adamallcock.github.io/classic-workspace-tabs/es/",
  "https://adamallcock.github.io/classic-workspace-tabs/de/"
]) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`sitemap is missing ${url}`);
}

const socialCardPath = resolve(siteRoot, "assets", "social-card.png");
assertFile("assets/social-card.png", "social preview image");

if (existsSync(socialCardPath)) {
  const metadata = await sharp(socialCardPath).metadata();
  if (metadata.width !== 1200 || metadata.height !== 630) {
    fail("social preview image must be exactly 1200x630");
  }
  if (metadata.format !== "png" && metadata.format !== "jpeg") {
    fail("social preview image must be PNG or JPEG");
  }
}

if (errors.length > 0) {
  console.error("Landing page validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Landing page validation passed.");

import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { JSDOM } from "jsdom";

const require = createRequire(import.meta.url);
const core = require("../content.js");

const runtime = {
  getURL(path) {
    return `chrome-extension://legacy-workspace-favicons/${path}`;
  }
};

function createDom(url, headHtml = "") {
  return new JSDOM(
    `<!doctype html><html><head>${headHtml}</head><body><main>private page content</main></body></html>`,
    { url }
  );
}

function iconLinks(document) {
  return Array.from(document.head.querySelectorAll("link")).filter((link) =>
    core.isIconLink(link)
  );
}

test("matches each supported Google Workspace URL to the expected icon", () => {
  const cases = [
    ["https://mail.google.com/mail/u/0/#inbox", "gmail.svg"],
    ["https://calendar.google.com/calendar/u/0/r", "calendar.svg"],
    ["https://drive.google.com/drive/my-drive", "drive.svg"],
    ["https://docs.google.com/document/d/abc/edit", "docs.svg"],
    ["https://docs.google.com/spreadsheets/d/abc/edit", "sheets.svg"],
    ["https://docs.google.com/presentation/d/abc/edit", "slides.svg"],
    ["https://docs.google.com/forms/d/abc/edit", "forms.svg"],
    ["https://meet.google.com/abc-defg-hij", "meet.svg"],
    ["https://chat.google.com/room/abc", "chat.svg"],
    ["https://keep.google.com/u/0/", "keep.svg"],
    ["https://contacts.google.com/person/abc", "contacts.svg"],
    ["https://tasks.google.com/embed/list/~default", "tasks.svg"],
    ["https://voice.google.com/u/0/messages", "voice.svg"],
    ["https://admin.google.com/ac/home", "admin.svg"]
  ];

  for (const [url, expectedIcon] of cases) {
    const rule = core.getMatchingRule(url);
    assert.ok(rule, `${url} should match a rule`);
    assert.equal(rule.icon, expectedIcon);
  }
});

test("does not match unsupported Google and non-Google URLs", () => {
  const urls = [
    "https://www.google.com/search?q=favicon",
    "https://maps.google.com/",
    "https://youtube.com/",
    "https://docs.google.com/drawings/d/abc/edit",
    "https://example.com/"
  ];

  for (const url of urls) {
    assert.equal(core.getMatchingRule(url), null, `${url} should not match`);
  }
});

test("identifies only tab favicon link elements", () => {
  const dom = createDom("https://mail.google.com/", `
    <link rel="icon" href="/favicon.ico">
    <link rel="shortcut icon" href="/shortcut.ico">
    <link rel="ICON alternate" href="/alternate.ico">
    <link rel="apple-touch-icon" href="/touch.png">
    <link rel="stylesheet" href="/style.css">
  `);

  const links = Array.from(dom.window.document.head.querySelectorAll("link"));
  const matchedHrefs = links.filter(core.isIconLink).map((link) => link.getAttribute("href"));

  assert.deepEqual(matchedHrefs, ["/favicon.ico", "/shortcut.ico", "/alternate.ico"]);
});

test("replaces competing favicons with one extension-managed favicon", () => {
  const dom = createDom("https://mail.google.com/mail/u/0/", `
    <link rel="icon" href="/favicon.ico">
    <link rel="shortcut icon" href="/shortcut.ico">
    <link rel="stylesheet" href="/style.css">
    <link rel="canonical" href="https://mail.google.com/">
  `);

  const result = core.applyLegacyFavicon({
    document: dom.window.document,
    location: dom.window.location,
    chromeRuntime: runtime
  });

  assert.equal(result.applied, true);
  assert.equal(result.rule.name, "Gmail");

  const favicons = iconLinks(dom.window.document);
  assert.equal(favicons.length, 1);
  assert.equal(favicons[0].dataset.legacyWorkspaceFavicon, "true");
  assert.equal(favicons[0].dataset.legacyWorkspaceApp, "Gmail");
  assert.equal(favicons[0].href, "chrome-extension://legacy-workspace-favicons/icons/gmail.svg");

  assert.ok(dom.window.document.head.querySelector('link[rel="stylesheet"]'));
  assert.ok(dom.window.document.head.querySelector('link[rel="canonical"]'));
});

test("leaves unsupported pages unchanged", () => {
  const dom = createDom("https://www.google.com/search?q=favicon", `
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="/style.css">
  `);

  const before = dom.window.document.head.innerHTML;
  const result = core.applyLegacyFavicon({
    document: dom.window.document,
    location: dom.window.location,
    chromeRuntime: runtime
  });

  assert.equal(result.applied, false);
  assert.equal(result.reason, "no-matching-rule");
  assert.equal(dom.window.document.head.innerHTML, before);
});

test("reapplying the same favicon does not create duplicates", () => {
  const dom = createDom("https://drive.google.com/drive/my-drive", `
    <link rel="icon" href="/favicon.ico">
  `);
  const env = {
    document: dom.window.document,
    location: dom.window.location,
    chromeRuntime: runtime
  };

  core.applyLegacyFavicon(env);
  core.applyLegacyFavicon(env);
  core.applyLegacyFavicon(env);

  const favicons = iconLinks(dom.window.document);
  assert.equal(favicons.length, 1);
  assert.equal(favicons[0].href, "chrome-extension://legacy-workspace-favicons/icons/drive.svg");
});

test("mutation observer restores the extension favicon when a page adds a competing favicon", async () => {
  const dom = createDom("https://docs.google.com/spreadsheets/d/abc/edit", `
    <link rel="icon" href="/favicon.ico">
  `);

  const env = {
    document: dom.window.document,
    location: dom.window.location,
    chrome: { runtime },
    MutationObserver: dom.window.MutationObserver,
    requestAnimationFrame(callback) {
      callback();
      return 1;
    }
  };

  const controller = core.runContentScript(env);
  const competing = dom.window.document.createElement("link");
  competing.rel = "icon";
  competing.href = "/new-google-favicon.ico";
  dom.window.document.head.appendChild(competing);

  await new Promise((resolve) => setTimeout(resolve, 0));

  const favicons = iconLinks(dom.window.document);
  assert.equal(favicons.length, 1);
  assert.equal(favicons[0].href, "chrome-extension://legacy-workspace-favicons/icons/sheets.svg");

  controller.disconnect();
});


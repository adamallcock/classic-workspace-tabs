import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const manifestPath = resolve(root, "manifest.json");
const contentPath = resolve(root, "content.js");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const content = readFileSync(contentPath, "utf8");
const errors = [];

function fail(message) {
  errors.push(message);
}

function assertAbsent(object, key, label = key) {
  if (Object.hasOwn(object, key)) fail(`${label} must be absent`);
}

function validateMatch(pattern, context) {
  if (pattern.includes("<all_urls>")) fail(`${context} must not include <all_urls>`);
  if (pattern.includes("*.google.com")) fail(`${context} must not use wildcard Google hosts`);
  if (!pattern.startsWith("https://")) fail(`${context} must use https`);
}

if (manifest.manifest_version !== 3) fail("manifest_version must be 3");
if (manifest.name !== "Classic Workspace Tabs") fail("name mismatch");
if (manifest.version !== "0.1.0") fail("version mismatch");
if (!Array.isArray(manifest.permissions) || manifest.permissions.length !== 0) {
  fail("permissions must be exactly []");
}

for (const key of [
  "host_permissions",
  "background",
  "action",
  "options_page",
  "chrome_url_overrides",
  "externally_connectable",
  "declarative_net_request",
  "oauth2"
]) {
  assertAbsent(manifest, key);
}

const prohibitedPermissions = new Set([
  "tabs",
  "history",
  "cookies",
  "bookmarks",
  "identity",
  "storage",
  "scripting",
  "activeTab"
]);

for (const permission of manifest.permissions || []) {
  if (prohibitedPermissions.has(permission)) fail(`prohibited permission present: ${permission}`);
}

if (!Array.isArray(manifest.content_scripts) || manifest.content_scripts.length !== 1) {
  fail("manifest must declare exactly one content script block");
} else {
  const [contentScript] = manifest.content_scripts;
  if (contentScript.run_at !== "document_idle") fail("content script must run at document_idle");
  if (JSON.stringify(contentScript.js) !== JSON.stringify(["content.js"])) {
    fail("content script must load only content.js");
  }
  for (const match of contentScript.matches || []) {
    validateMatch(match, `content script match ${match}`);
  }
}

const manifestIconPaths = Object.values(manifest.icons || {});
for (const iconPath of manifestIconPaths) {
  if (!iconPath.endsWith(".png")) fail(`manifest icon must be PNG: ${iconPath}`);
  if (!existsSync(resolve(root, iconPath))) fail(`missing manifest icon: ${iconPath}`);
}

for (const resourceBlock of manifest.web_accessible_resources || []) {
  for (const resource of resourceBlock.resources || []) {
    if (!existsSync(resolve(root, resource))) fail(`missing web accessible resource: ${resource}`);
  }
  for (const match of resourceBlock.matches || []) {
    validateMatch(match, `web accessible resource match ${match}`);
    if (!match.endsWith("/*")) {
      fail(`web accessible resource match must end with /* because Chrome only uses origins: ${match}`);
    }
  }
}

const prohibitedContentPatterns = [
  [/\bfetch\s*\(/, "fetch"],
  [/\bXMLHttpRequest\b/, "XMLHttpRequest"],
  [/\bWebSocket\b/, "WebSocket"],
  [/\bsendBeacon\b/, "sendBeacon"],
  [/\blocalStorage\b/, "localStorage"],
  [/\bsessionStorage\b/, "sessionStorage"],
  [/\bindexedDB\b/, "indexedDB"],
  [/\bchrome\.storage\b/, "chrome.storage"],
  [/\bchrome\.tabs\b/, "chrome.tabs"],
  [/\bchrome\.history\b/, "chrome.history"],
  [/\bchrome\.bookmarks\b/, "chrome.bookmarks"],
  [/\bchrome\.cookies\b/, "chrome.cookies"],
  [/\bchrome\.identity\b/, "chrome.identity"],
  [/\bdocument\.body\b/, "document.body"],
  [/\.innerText\b/, "innerText"],
  [/\.textContent\b/, "textContent"]
];

for (const [pattern, label] of prohibitedContentPatterns) {
  if (pattern.test(content)) fail(`content.js must not use ${label}`);
}

if (!content.includes(".head")) fail("content.js should explicitly target the document head");
if (!content.includes("chrome.runtime")) fail("content.js should use chrome.runtime.getURL for bundled icons");

if (errors.length > 0) {
  console.error("Extension validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Extension validation passed.");

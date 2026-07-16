import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const manifestPath = resolve(root, "manifest.json");
const packageJsonPath = resolve(root, "package.json");
const packageLockPath = resolve(root, "package-lock.json");
const contentPath = resolve(root, "content.js");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const packageLock = JSON.parse(readFileSync(packageLockPath, "utf8"));
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

function validateResource(resource) {
  if (!resource.includes("*")) {
    if (!existsSync(resolve(root, resource))) fail(`missing web accessible resource: ${resource}`);
    return;
  }

  const [prefix, suffix] = resource.split("*");
  const slashIndex = prefix.lastIndexOf("/");
  const directoryPath = slashIndex === -1 ? "." : prefix.slice(0, slashIndex);
  const filePrefix = slashIndex === -1 ? prefix : prefix.slice(slashIndex + 1);
  const directory = resolve(root, directoryPath);

  if (!existsSync(directory)) {
    fail(`missing web accessible resource directory: ${dirname(resource)}`);
    return;
  }

  const matches = readdirSync(directory).filter(
    (entry) => entry.startsWith(filePrefix) && entry.endsWith(suffix)
  );

  if (matches.length === 0) fail(`web accessible resource wildcard matched no files: ${resource}`);
}

if (manifest.manifest_version !== 3) fail("manifest_version must be 3");
if (manifest.name !== "__MSG_extensionName__") fail("name must use the localized extensionName message");
if (manifest.short_name !== "__MSG_extensionShortName__") {
  fail("short_name must use the localized extensionShortName message");
}
if (manifest.description !== "__MSG_extensionDescription__") {
  fail("description must use the localized extensionDescription message");
}
if (manifest.default_locale !== "en") fail("default_locale must be en");
if (manifest.homepage_url !== "https://adamallcock.github.io/classic-workspace-tabs/") {
  fail("homepage_url must point to the production landing page");
}
if (manifest.version !== packageJson.version) fail("manifest version must match package.json");
if (manifest.version !== packageLock.version) fail("manifest version must match package-lock.json");
if (manifest.version !== packageLock.packages?.[""]?.version) {
  fail("manifest version must match package-lock root package version");
}
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
    validateResource(resource);
  }
  for (const match of resourceBlock.matches || []) {
    validateMatch(match, `web accessible resource match ${match}`);
    if (!match.endsWith("/*")) {
      fail(`web accessible resource match must end with /* because Chrome only uses origins: ${match}`);
    }
  }
}

for (const locale of ["en", "es", "de"]) {
  const localePath = resolve(root, "_locales", locale, "messages.json");

  if (!existsSync(localePath)) {
    fail(`missing locale messages: ${locale}`);
    continue;
  }

  const messages = JSON.parse(readFileSync(localePath, "utf8"));
  if (!messages.extensionName?.message) fail(`${locale} extensionName message is required`);
  if (!messages.extensionShortName?.message) fail(`${locale} extensionShortName message is required`);
  if ([...messages.extensionShortName?.message || ""].length > 12) {
    fail(`${locale} extensionShortName must be 12 characters or fewer`);
  }
  if (!messages.extensionDescription?.message) {
    fail(`${locale} extensionDescription message is required`);
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

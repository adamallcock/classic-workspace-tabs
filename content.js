(() => {
  "use strict";

  const EXTENSION_FAVICON_MARKER = "legacy-workspace-favicon";

  const DEFAULT_RULES = Object.freeze([
    Object.freeze({
      name: "Gmail",
      icon: "gmail.svg",
      matches: ({ hostname }) => hostname === "mail.google.com"
    }),
    Object.freeze({
      name: "Google Calendar",
      icon: "calendar.svg",
      matches: ({ hostname }) => hostname === "calendar.google.com"
    }),
    Object.freeze({
      name: "Google Drive",
      icon: "drive.svg",
      matches: ({ hostname }) => hostname === "drive.google.com"
    }),
    Object.freeze({
      name: "Google Docs",
      icon: "docs.svg",
      matches: ({ hostname, pathname }) =>
        hostname === "docs.google.com" && pathname.startsWith("/document/")
    }),
    Object.freeze({
      name: "Google Sheets",
      icon: "sheets.svg",
      matches: ({ hostname, pathname }) =>
        hostname === "docs.google.com" && pathname.startsWith("/spreadsheets/")
    }),
    Object.freeze({
      name: "Google Slides",
      icon: "slides.svg",
      matches: ({ hostname, pathname }) =>
        hostname === "docs.google.com" && pathname.startsWith("/presentation/")
    }),
    Object.freeze({
      name: "Google Forms",
      icon: "forms.svg",
      matches: ({ hostname, pathname }) =>
        hostname === "docs.google.com" && pathname.startsWith("/forms/")
    }),
    Object.freeze({
      name: "Google Meet",
      icon: "meet.svg",
      matches: ({ hostname }) => hostname === "meet.google.com"
    }),
    Object.freeze({
      name: "Google Chat",
      icon: "chat.svg",
      matches: ({ hostname }) => hostname === "chat.google.com"
    }),
    Object.freeze({
      name: "Google Keep",
      icon: "keep.svg",
      matches: ({ hostname }) => hostname === "keep.google.com"
    }),
    Object.freeze({
      name: "Google Contacts",
      icon: "contacts.svg",
      matches: ({ hostname }) => hostname === "contacts.google.com"
    }),
    Object.freeze({
      name: "Google Tasks",
      icon: "tasks.svg",
      matches: ({ hostname }) => hostname === "tasks.google.com"
    }),
    Object.freeze({
      name: "Google Voice",
      icon: "voice.svg",
      matches: ({ hostname }) => hostname === "voice.google.com"
    }),
    Object.freeze({
      name: "Google Admin",
      icon: "admin.svg",
      matches: ({ hostname }) => hostname === "admin.google.com"
    })
  ]);

  function toUrl(urlLike) {
    if (urlLike instanceof URL) return urlLike;
    if (typeof urlLike === "string") return new URL(urlLike);
    if (urlLike && typeof urlLike.href === "string") return new URL(urlLike.href);

    return new URL(String(urlLike));
  }

  function getMatchingRule(urlLike, rules = DEFAULT_RULES) {
    const url = toUrl(urlLike);

    for (const rule of rules) {
      try {
        if (rule.matches(url)) return rule;
      } catch {
        continue;
      }
    }

    return null;
  }

  function getRuntime(env) {
    if (env.chromeRuntime) return env.chromeRuntime;
    if (env.chrome && env.chrome.runtime) return env.chrome.runtime;
    if (typeof chrome !== "undefined" && chrome.runtime) return chrome.runtime;
    return null;
  }

  function getIconHref(runtime, iconFileName) {
    return runtime.getURL(`icons/${iconFileName}`);
  }

  function isIconLink(element) {
    const view = element && element.ownerDocument && element.ownerDocument.defaultView;

    if (!view || !(element instanceof view.HTMLLinkElement)) return false;

    const relTokens = (element.getAttribute("rel") || "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return relTokens.includes("icon");
  }

  function currentExtensionIcon(root) {
    return root.querySelector(`link[data-${EXTENSION_FAVICON_MARKER}="true"]`);
  }

  function removeCompetingFavicons(root, expectedHref) {
    const links = Array.from(root.querySelectorAll("link"));

    for (const link of links) {
      if (!isIconLink(link)) continue;

      const isOurIcon = link.dataset.legacyWorkspaceFavicon === "true";

      if (isOurIcon && link.href === expectedHref) {
        continue;
      }

      link.remove();
    }
  }

  let applying = false;

  function applyLegacyFavicon(env = globalThis) {
    if (applying) return { applied: false, reason: "already-applying" };

    const doc = env.document;
    const head = doc && doc.head;
    const runtime = getRuntime(env);

    if (!head) return { applied: false, reason: "missing-head" };
    if (!runtime) return { applied: false, reason: "missing-runtime" };

    const rule = getMatchingRule(env.location);
    if (!rule) return { applied: false, reason: "no-matching-rule" };

    const expectedHref = getIconHref(runtime, rule.icon);
    const existing = currentExtensionIcon(head);

    if (existing && existing.href === expectedHref) {
      removeCompetingFavicons(head, expectedHref);
      return { applied: true, rule, href: expectedHref, changed: false };
    }

    applying = true;

    try {
      removeCompetingFavicons(head, expectedHref);

      const link = doc.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = expectedHref;
      link.dataset.legacyWorkspaceFavicon = "true";
      link.dataset.legacyWorkspaceApp = rule.name;

      head.appendChild(link);

      return { applied: true, rule, href: expectedHref, changed: true };
    } finally {
      applying = false;
    }
  }

  function scheduleApply(env) {
    const raf = env.requestAnimationFrame || (env.window && env.window.requestAnimationFrame);

    if (typeof raf === "function") {
      raf(() => applyLegacyFavicon(env));
      return;
    }

    setTimeout(() => applyLegacyFavicon(env), 0);
  }

  function runContentScript(env = globalThis) {
    const doc = env.document;
    const MutationObserverImpl =
      env.MutationObserver || (env.window && env.window.MutationObserver);

    applyLegacyFavicon(env);

    if (!doc || !doc.head || !MutationObserverImpl) {
      return { disconnect() {} };
    }

    const observer = new MutationObserverImpl(() => scheduleApply(env));
    observer.observe(doc.head, {
      childList: true,
      subtree: false
    });

    return observer;
  }

  const api = {
    EXTENSION_FAVICON_MARKER,
    DEFAULT_RULES,
    applyLegacyFavicon,
    currentExtensionIcon,
    getIconHref,
    getMatchingRule,
    isIconLink,
    removeCompetingFavicons,
    runContentScript
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
    return;
  }

  runContentScript(globalThis);
})();


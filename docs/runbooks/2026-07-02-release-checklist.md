---
title: Release Checklist
date: 2026-07-02
type: runbook
status: active
---

# Release Checklist

Use this checklist for packaged releases and Chrome Web Store updates.

## Preflight

- Inspect `git status --short --branch` and keep unrelated local changes out of the release commit.
- Confirm `manifest.json`, `package.json`, and `package-lock.json` all use the same version.
- Confirm `CHANGELOG.md` describes the version being packaged.
- Confirm `README.md`, `STORE_LISTING.md`, `PRIVACY.md`, `SECURITY.md`, and `ASSETS.md` still match the permission model and supported apps.
- Confirm English, Spanish, and German messages exist under `_locales/` and stay within Chrome's metadata limits.
- Confirm all 31 generated Calendar date icons are present under `icons/calendar-days/`.
- Confirm `store-assets/` screenshots and marketing assets do not show private email, calendar events, chats, account names, profile photos, organization names, or browser history.
- Confirm private replacement icons, Chrome Web Store credentials, reviewer notes, account state, and local browser profiles are not tracked.

## Local Verification

Run the release gates from the repository root:

```bash
npm run validate
npm test
npm run package
```

When local Chromium and `openssl` are available, smoke-test the working tree:

```bash
npm run smoke:chrome
```

Optionally smoke-test the packaged directory too:

```bash
npm run smoke:chrome -- dist/classic-workspace-tabs-<version>
```

## Store Update

- Upload the zip created by `npm run package`.
- Paste or compare store copy against `STORE_LISTING.md`.
- Add or update the English, Spanish, and German detailed descriptions using the dashboard language selector.
- Confirm the Chrome Web Store privacy declaration still says no user data is collected.
- Confirm the landing-page URL is set as the extension homepage and its Web Store link retains the acquisition UTM parameters.
- Confirm the listing version, README badge, and README listing link match the public Chrome Web Store state after review completes.
- If the live store version lags the repo version during review, leave an explicit note in the release issue or changelog draft rather than changing source versions.

## Rollback Notes

- The extension has no backend, storage, migrations, or server-side rollout state.
- If a release is rejected or pulled, keep the last accepted package available and update public docs only after the Chrome Web Store state is confirmed live.

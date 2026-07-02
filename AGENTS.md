# Classic Workspace Tabs Agent Instructions

## Public Repo Boundary

- This is a public, privacy-first Chrome extension. Keep this file safe for
  public contributors: no private account details, unpublished store strategy,
  local credentials, or private asset paths.
- Preserve the narrow product boundary: no popup, settings, analytics, server,
  remote code, broad host permissions, page-body inspection, arbitrary website
  rules, or account system.

## Extension Safety

- The extension should only touch favicon `<link>` elements in
  `document.head` on explicit Google Workspace URL patterns.
- Treat `manifest.json` permissions and host matches as a security surface.
  Any expansion must be justified in docs, tests, and validation output.
- Do not add telemetry, remote fetches, bundled tracking scripts, or background
  collection paths.

## Local Commands

```bash
npm test
npm run validate
npm run generate:icons
npm run package
npm run smoke:chrome
```

- Use `npm run package:private` only for local packaging with private icon
  overlays. Do not commit private icon inputs or private package artifacts.
- Run `npm run validate` and `npm test` before claiming extension behavior is
  ready for review.
- Run `npm run package` before release packaging claims. Use
  `npm run smoke:chrome` for local browser smoke coverage when Chromium and
  `openssl` are available.

## Assets And Store Surface

- Generated extension icons should come from `scripts/generate-extension-icons.mjs`.
- Keep `store-assets/`, screenshots, README badges, and Chrome Web Store text
  aligned with the actual permission model and supported apps.
- Do not include Chrome Web Store credentials, reviewer notes containing
  private account state, or local browser profile data in the repo.
- Use `docs/runbooks/2026-07-02-release-checklist.md` as the release and store
  submission checklist.
- Keep private launch, outreach, and account-state research out of this public
  repo unless Adam explicitly approves publishing it.

## Documentation Placement

- Public durable docs can live in tracked root Markdown files or under `docs/`.
- Keep private notes in ignored locations such as `notes/` or `research/`.
- When docs describe store status, package paths, supported apps, or permission
  claims, verify them against `manifest.json`, `package.json`, scripts, and the
  live Chrome Web Store listing before updating public copy.

## Definition Of Done

- Code, manifest, docs, and store-facing assets tell the same privacy story.
- Validation and tests pass, or the blocker is recorded with the exact command.
- Public-facing changes remain understandable to a first-time contributor.

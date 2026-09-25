---
title: Pre-2026 favicon fidelity patch
date: 2026-09-24
type: plan
status: pending-review
---

# Goal

Prepare a source candidate for version 0.2.1 that restores the actual small pre-2026 tab favicon shapes on the supported Google Workspace pages. Keep the extension's existing URL scope, local-only assets, zero permissions, and Calendar's local-date behavior.

The 0.2.1 source is merged and the Chrome Web Store update has been submitted for review. The [release checklist](../runbooks/2026-07-02-release-checklist.md) governs publication checks after Google approves it.

## Asset decisions

| App | Decision | Reference |
| --- | --- | --- |
| Docs | Replace full document logo with compact blue favicon. | https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico |
| Sheets | Replace spreadsheet logo with white-plus favicon. | https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico |
| Slides | Replace presentation logo with white-frame favicon. | https://ssl.gstatic.com/docs/presentations/images/favicon-2023q4.ico |
| Forms | Replace form logo with compact checklist favicon. | https://ssl.gstatic.com/docs/spreadsheets/forms/favicon_qp2.png |
| Keep | Replace note logo with square bulb favicon. | https://ssl.gstatic.com/keep/keep_2020q4v2.ico |
| Chat | Replace two-bubble logo with the favicon selected by a [2025 Google Chat page](https://web.archive.org/web/20250301015855/https://chat.google.com/). | https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_chat_r5.ico |
| Calendar | Replace generated calendar art with the 31 original date-specific favicon designs. Keep the existing local-day selection and midnight refresh. | https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_17.ico ; [March 2025 browser report](https://bugzilla.mozilla.org/show_bug.cgi?id=1954053) |
| Gmail, Drive, Meet, Voice | Retain existing designs; their shapes match the older Google-hosted files inspected. | [Gmail](https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico), [Drive](https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png), [Meet 2025 page](https://web.archive.org/web/20251205185819/https://meet.google.com/landing), [Voice](https://www.gstatic.com/voice-fe/icons/voice_favicon.png) |
| Contacts, Tasks, Admin | Retain provisionally. Exact 2025 tab favicons have not been verified; do not substitute an older or current product logo by guesswork. | Open evidence gap |

The archive suggested in the review supplies only Docs, Sheets, Slides, Forms, Keep, and unsupported Sites. Google-hosted files corroborate the five relevant shapes. Its metadata does not itself establish redistribution rights: https://archive.org/details/google-workspace-favicons.

## Asset and packaging design

1. Bundle the replacement favicons as local PNGs. Extract native-size ICO frames where available; retain the source's pixels and transparency, without redrawing or enlarging a low-resolution frame. Record source URL, retrieval date, dimensions, and SHA-256 for each asset in `ASSETS.md`. Keep original source binaries outside the runtime package if they are retained in the repository.
2. Bundle 31 Calendar PNGs with two-digit runtime names (`01.png` to `31.png`). Use Google's unpadded day-number source URLs (`calendar_1.ico` to `calendar_31.ico`). Store local, checked-in source PNGs for deterministic regeneration; the generator must not fetch Google at build or runtime. Verify that all 31 days have distinct, readable numbers at 16px and 32px.
3. Update `content.js` to name the six changed product PNGs and set their MIME type to `image/png`. Keep the existing Calendar filename selection and midnight timer. Update only the corresponding `manifest.json` web-accessible resource filenames; leave all host matches and permissions unchanged.
4. Preserve `package:private`'s documented input contract of one SVG per app. For a private package, copy SVGs for unchanged runtime SVG assets, render private SVGs to PNG for the six changed runtime PNG assets, and regenerate Calendar day PNGs from the private `calendar.svg`. The ordinary package uses the checked-in historical Calendar day set. The two packaging paths must not overwrite source-tree assets.
5. Remove superseded bundled product SVGs when the new PNGs are in place, and copy only required runtime assets into the package. Keep the extension/store icon distinct from product favicons.

## Affected surfaces

- Update `scripts/generate-calendar-icons.mjs`, `scripts/package-extension.mjs`, `scripts/validate-extension.mjs`, and the asset filename mappings in `content.js` and `manifest.json`.
- Update `test/content.test.mjs` and `test/generate-calendar-icons.test.mjs` for exact filenames, 31 historical date assets, day rollover, and private-overlay behavior. Test that packaged PNGs decode and that the package references no missing or superseded files.
- Update `scripts/build-site.mjs`, the three localized `site/*/index.html` pages, and any store screenshots or promo art showing the old full-page logos. The site preview and store images should display the same favicon shapes as the extension.
- Update `ASSETS.md`, `icons/README.md`, `README.md`, `CHANGELOG.md`, and `STORE_LISTING.md` wherever they describe the asset format, source, or fidelity claim. Keep source-revision, packaged-extension, and live-store statements separate.

## Acceptance checks

1. Confirm the project's existing distribution-rights basis covers each new favicon file and its public repository and Chrome Web Store packaging. Google's [product-icon guidance](https://about.google/brand-resource-center/products-and-services/) is relevant; a Google-hosted download URL alone is not a licence. Do not merge the new binaries into the public source until this is settled.
2. Compare each replacement against the recorded Google-hosted source at 16px and 32px on light and dark tab backgrounds. The Docs, Sheets, Slides, Forms, Keep, Chat, and Calendar differences should be visible in before/after screenshots.
3. Run `npm run validate`, `npm test`, `npm run package`, and `npm run smoke:chrome` on both the working tree and packaged directory where applicable. Run `npm run site:build` and `npm run site:validate`, then inspect the rendered landing page and marketing assets.
4. Check the ordinary and private packages contain no remote icon references, missing assets, changed permission/host scope, or unapproved source binaries. Confirm Calendar changes at local midnight, including month and year boundaries.

## Open evidence and release boundary

Contacts, Tasks, and Admin need a dated 2025 page-source capture or equivalently reliable record of the favicon selected by the app. The Tasks file found at `ssl.gstatic.com/tasks/00d84c8baaaf6dd434993369f1441e47/favicon.ico` depicts an older design and is not evidence for 2025. If those three remain unverified, describe 0.2.1 as correcting the seven confirmed mismatches rather than claiming exact-original fidelity for all 14 apps.

Qualifying a local 0.2.1 source/package does not update the installed extension, Chrome Web Store listing, or public site. Those are separate release steps under the checklist.

## Implementation check (2026-09-24)

- The six static favicon PNGs and 31 Calendar date PNGs are in the local 0.2.1 source candidate. The Calendar generator copies the offline source set; private packaging still accepts the 14 SVG inputs and renders its own date set.
- `npm run validate`, `npm test`, `npm run package`, both source and packaged `npm run smoke:chrome`, `npm run site:build`, and `npm run site:validate` passed locally. The source and packaged Chrome tests needed an unsandboxed Chromium launch because Chromium aborted before page load inside the filesystem sandbox.
- The ZIP contains the declared resources and no superseded SVGs, private inputs, or source archive. Store imagery and the site social preview show the compact favicon designs.
- The maintainer confirmed on 2026-09-25 that project distribution rights cover the replacement files in the public repository and Chrome Web Store package.

## Store submission (2026-09-25)

- The 0.2.1 source and updated store artwork were merged through [PR #2](https://github.com/adamallcock/classic-workspace-tabs/pull/2). The landing page deployed with the corrected artwork.
- The Chrome Web Store accepted the 0.2.1 ZIP and the replacement global screenshot, small promo tile, and marquee promo tile. English, German, and Spanish detailed descriptions match `STORE_LISTING.md`; the existing public/free/all-regions distribution and no-data privacy disclosures were retained.
- The developer dashboard confirmed "Your extension was submitted for review" and then showed the 0.2.1 draft as pending review. Automatic publication after approval was selected. Version 0.2.0 remains the published package until Google completes review; verify the public listing before claiming 0.2.1 is live.

# Changelog

## 0.2.0 - 2026-07-16

- Renamed the extension to describe its purpose directly in Chrome Web Store search.
- Added a Calendar favicon that displays the current local day and refreshes after midnight.
- Added English, Spanish, and German manifest localization.
- Added paste-ready Spanish and German Chrome Web Store descriptions.
- Added a multilingual static landing page and GitHub Pages deployment workflow.
- Kept the extension permission-free, network-free, and limited to favicon links in `document.head`.

## 0.1.1 - 2026-06-10

- Changed the packaged extension icons to match the Chrome Web Store listing icon.
- Updated extension icon generation to derive manifest icons from `store-assets/store-icon-128.png`.
- Added a regression test for the extension icon generator.

## 0.1.0 - 2026-05-31

- Added the initial Manifest V3 extension.
- Renamed the project to Classic Workspace Tabs.
- Added explicit Google Workspace URL matches.
- Added bundled classic Google Workspace-style product favicon assets with confirmed project distribution rights.
- Added replacement icon packaging support.
- Added static privacy, permission, and package validation.
- Added automated content-script tests.
- Added local Chrome smoke-test tooling.

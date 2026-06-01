# Classic Workspace Tabs

A tiny Chrome extension that restores distinct tab icons for supported Google Workspace apps.

It is intentionally narrow:

- no popup
- no settings
- no analytics
- no server
- no remote code
- no account system
- no broad host permissions
- no page-body inspection
- no arbitrary website rules

The content script runs only on explicit Google Workspace URLs and only replaces favicon `<link>` elements in `document.head`.

## Supported Apps

- Gmail
- Google Calendar
- Google Drive
- Google Docs
- Google Sheets
- Google Slides
- Google Forms
- Google Meet
- Google Chat
- Google Keep
- Google Contacts
- Google Tasks
- Google Voice
- Google Admin

## Privacy

Classic Workspace Tabs does not collect, store, transmit, sell, or analyze any user data. It has no server, no analytics, no tracking, no remote code, and no account system. The extension only replaces the tab favicon on supported Google Workspace pages using icon files bundled inside the extension.

See [PRIVACY.md](PRIVACY.md).

## Icon Assets

This repository ships bundled classic Google Workspace-style product favicons with confirmed rights for this project, so the extension is ready to load locally or package for distribution. You can also put replacement SVG files in a gitignored `private-icons/` folder and run `npm run package:private`. That overlays the replacement icons into `dist/classic-workspace-tabs-0.1.0/` without changing tracked source files.

See [ASSETS.md](ASSETS.md).

## Local Install

1. Run `npm install`.
2. Run `npm run validate`.
3. Run `npm test`.
4. Open `chrome://extensions` in Chrome.
5. Enable Developer Mode.
6. Click "Load unpacked."
7. Select this project folder.

## Development

```bash
npm install
npm run validate
npm test
npm run package
```

`npm run package` creates a local release zip under `dist/`. The `dist/` folder is ignored and should not be committed.

For a package with replacement icon files:

```bash
mkdir -p private-icons
# Add gmail.svg, calendar.svg, drive.svg, docs.svg, sheets.svg, slides.svg,
# forms.svg, meet.svg, chat.svg, keep.svg, contacts.svg, tasks.svg,
# voice.svg, and admin.svg to private-icons/.
npm run package:private
```

Load `dist/classic-workspace-tabs-0.1.0/` as the unpacked extension.

## Permission Model

`manifest.json` uses:

- `permissions: []`
- no `host_permissions`
- no background service worker
- no popup or options page
- explicit content script matches only

## Trademark

This project is not affiliated with, endorsed by, or sponsored by Google. Google Workspace product names and logos are trademarks of Google LLC.

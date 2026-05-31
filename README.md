# Legacy Workspace Favicons

A tiny Chrome extension that restores distinct tab favicons for supported Google Workspace apps.

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

Legacy Workspace Favicons does not collect, store, transmit, sell, or analyze any user data. It has no server, no analytics, no tracking, no remote code, and no account system. The extension only replaces the tab favicon on supported Google Workspace pages using icon files bundled inside the extension.

See [PRIVACY.md](PRIVACY.md).

## Icon Assets

This repository currently ships placeholder product favicons, not Google-owned icon artwork. Do not publish a build containing Google Workspace icon assets unless the right to redistribute those assets has been confirmed.

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

## Permission Model

`manifest.json` uses:

- `permissions: []`
- no `host_permissions`
- no background service worker
- no popup or options page
- explicit content script matches only

## Trademark

This project is not affiliated with, endorsed by, or sponsored by Google. Google Workspace product names and logos are trademarks of Google LLC.


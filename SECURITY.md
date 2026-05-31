# Security

## Supported Versions

Only the current `main` branch is maintained.

## Reporting Security Issues

If this repository is hosted on GitHub, use GitHub private vulnerability reporting if it is enabled. Otherwise, open an issue with a high-level description and avoid posting exploit details or sensitive information publicly.

## Security Boundaries

The extension is designed to stay small and auditable:

- no extension permissions
- no host permissions
- no background service worker
- no remote code
- no network requests from the content script
- no storage APIs
- no page-body reads
- no browser history, cookie, bookmark, identity, or tab APIs

Changes that add permissions, storage, networking, a background worker, or arbitrary site customization should be treated as security-sensitive and reviewed carefully before release.


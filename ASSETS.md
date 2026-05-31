# Icon Assets

This repository currently includes generated placeholder product favicons. They are not Google Workspace icon artwork.

The extension is designed so private/local users can replace placeholders with icon assets they are allowed to use. Do not publish a public build containing Google-owned Workspace icon assets unless the right to redistribute those assets has been confirmed.

The extension icon files, `icons/extension-*.png`, are generated generic icons for this project and do not use Google's logo.

## Remote Icon URLs

Do not load favicons from Wikipedia, Wikimedia Commons, Google-hosted URLs, CDNs, or other third-party hosts.

Remote icon URLs would weaken the extension's core privacy claim by causing supported Google Workspace pages to request assets from an outside host. They also make the extension dependent on external URL stability, hosting policy, cache behavior, and network availability.

Bundled local assets keep the extension simple, auditable, and network-free.

Google Workspace product names and logos are trademarks of Google LLC. This project is not affiliated with, endorsed by, or sponsored by Google.

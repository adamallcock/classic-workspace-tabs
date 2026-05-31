# Icon Assets

This repository includes generated placeholder product favicons. They are not Google Workspace icon artwork.

The extension is designed so private/local users can build with their own icon assets without committing those assets to git.

For local-only packages, create a gitignored `private-icons/` directory with these filenames:

- `gmail.svg`
- `calendar.svg`
- `drive.svg`
- `docs.svg`
- `sheets.svg`
- `slides.svg`
- `forms.svg`
- `meet.svg`
- `chat.svg`
- `keep.svg`
- `contacts.svg`
- `tasks.svg`
- `voice.svg`
- `admin.svg`

Then run:

```bash
npm run package:private
```

The private icons are copied into the generated `dist/classic-workspace-tabs-0.1.0/` package only. They are not copied into tracked source files.

Do not publish a public build containing Google-owned Workspace icon assets unless the right to redistribute those assets has been confirmed.

The extension icon files, `icons/extension-*.png`, are generated generic icons for this project and do not use Google's logo.

## Remote Icon URLs

Do not load favicons from Wikipedia, Wikimedia Commons, Google-hosted URLs, CDNs, or other third-party hosts.

Remote icon URLs would weaken the extension's core privacy claim by causing supported Google Workspace pages to request assets from an outside host. They also make the extension dependent on external URL stability, hosting policy, cache behavior, and network availability.

Bundled local assets keep the extension simple, auditable, and network-free.

Google Workspace product names and logos are trademarks of Google LLC. This project is not affiliated with, endorsed by, or sponsored by Google.

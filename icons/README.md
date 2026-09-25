# Runtime Icon Assets

The extension uses local SVGs for Gmail, Drive, Meet, Contacts, Tasks, Voice, and Admin; PNGs for Docs, Sheets, Slides, Forms, Chat, and Keep; and 31 local PNGs for Calendar dates. The PNGs use the Google-hosted favicon shapes recorded in [ASSETS.md](../ASSETS.md). The extension icon files are generated from `store-assets/store-icon-128.png`.

Run `npm run generate:calendar-icons` to copy the offline Calendar source set into this directory. `npm run package:private` overlays private SVG inputs into the generated package as described in [ASSETS.md](../ASSETS.md).

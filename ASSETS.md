# Icon Assets

This repository bundles favicon files locally. The content script never downloads icons at runtime. The maintainer previously confirmed project distribution rights for the original SVG assets listed below. Redistribution of the new Google-hosted favicon replacements for version 0.2.1 is awaiting maintainer confirmation before publication.

## Favicon replacements in 0.2.1

The following PNGs were extracted from the native 32 px ICO frame, except Forms, whose source is a 16 px PNG. They were retrieved on 2026-09-24. SHA-256 values identify the checked-in PNGs, not the original ICO containers.

| Bundled PNG | Google-hosted source | Native size | SHA-256 |
| --- | --- | --- | --- |
| `icons/docs.png` | [Docs](https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico) | 32×32 | `192a61774bb9e38ac9b2903283b15f2b01baf3134cfbda2469a75144744ff5fb` |
| `icons/sheets.png` | [Sheets](https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico) | 32×32 | `b5198e6090a34f20281a0dde773ca55f28e2a8a3a9a38cbb8b6a902c6ad4c200` |
| `icons/slides.png` | [Slides](https://ssl.gstatic.com/docs/presentations/images/favicon-2023q4.ico) | 32×32 | `7f83d47c40ecba06e88dc632912befcb364a8b8a0ac07fefb1db62a4b4663cc8` |
| `icons/forms.png` | [Forms](https://ssl.gstatic.com/docs/spreadsheets/forms/favicon_qp2.png) | 16×16 | `5d8d214db1f392c0111629dd559aa8049040280c26615149af406cb581c9abaa` |
| `icons/keep.png` | [Keep](https://ssl.gstatic.com/keep/keep_2020q4v2.ico) | 32×32 | `cbfcae0a7a2ef89ddf381a759f33a145253a1fa95b77f5a870095fb2911816b5` |
| `icons/chat.png` | [Chat](https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_chat_r5.ico) | 32×32 | `83f79865d84ced01cd5a659ac2d71cb6dafc2203aef287e51fbf91d3cc78b1c1` |

The 31 Calendar date images under `source-assets/calendar-days/` came from `https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_N.ico`, where `N` is an unpadded day from 1 to 31. The checked-in PNGs use the 32 px ICO frame; the SHA-256 of their bytes concatenated in day order is `b1ee37f0360198f26389616dec16548b7d209e5bd74b42a60288c2607958cd46`. `npm run generate:calendar-icons` copies them byte-for-byte to `icons/calendar-days/`. This makes regeneration deterministic and offline. The runtime selects today's local day and refreshes after midnight.

The [review archive](https://archive.org/details/google-workspace-favicons) helped identify some shapes but does not provide a redistribution licence. A Google-hosted URL also does not itself establish redistribution rights.

## Private replacement packages

Create a gitignored `private-icons/` directory containing one SVG for each app:

- `gmail.svg`, `calendar.svg`, `drive.svg`, `docs.svg`, `sheets.svg`, `slides.svg`, `forms.svg`
- `meet.svg`, `chat.svg`, `keep.svg`, `contacts.svg`, `tasks.svg`, `voice.svg`, `admin.svg`

Run `npm run package:private`. The package process copies SVGs for unchanged runtime assets, renders the six PNG replacements from the private SVGs, and regenerates the 31 Calendar days from the private `calendar.svg`. It changes only the package under `dist/`, never the checked-in assets.

The extension icon files, `icons/extension-*.png`, are generated from `store-assets/store-icon-128.png`, which matches the store listing icon.

## Retained SVG sources

The retained bundled product SVGs came from Wikimedia Commons file pages and have the maintainer's existing project distribution confirmation:

- [Gmail icon (2020)](https://commons.wikimedia.org/wiki/File:Gmail_icon_(2020).svg)
- [Google Drive icon (2020)](https://commons.wikimedia.org/wiki/File:Google_Drive_icon_(2020).svg)
- [Google Meet icon (2020)](https://commons.wikimedia.org/wiki/File:Google_Meet_icon_(2020).svg)
- [Google Contacts icon](https://commons.wikimedia.org/wiki/File:Google_Contacts_icon.svg)
- [Google Tasks 2021](https://commons.wikimedia.org/wiki/File:Google_Tasks_2021.svg)
- [Google Voice icon (2020)](https://commons.wikimedia.org/wiki/File:Google_Voice_icon_(2020).svg)
- [Google Admin icon](https://commons.wikimedia.org/wiki/File:Google_Admin_icon.svg)

## Remote Icon URLs

Do not load favicons from Wikipedia, Wikimedia Commons, Google-hosted URLs, CDNs, or other third-party hosts at runtime. Bundled local assets keep the extension network-free and independent of remote URL stability.

Before publishing a replacement favicon, confirm the replacement asset can be redistributed in this public repository and in the Chrome Web Store package. Google Workspace product names and logos are trademarks of Google LLC. This project is not affiliated with, endorsed by, or sponsored by Google.

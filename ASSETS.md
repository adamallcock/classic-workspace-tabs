# Icon Assets

This repository includes bundled classic Google Workspace-style product favicons.

The maintainer has confirmed rights to use and distribute the bundled product favicon assets in this project.

The extension is also designed so users can build with replacement icon assets without committing those assets to git.

For replacement icon packages, create a gitignored `private-icons/` directory with these filenames:

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

The replacement icons are copied into the generated `dist/classic-workspace-tabs-0.1.0/` package only. They are not copied into tracked source files.

The extension icon files, `icons/extension-*.png`, are generated generic icons for this project and do not use Google's logo.

## SVG sources

The current bundled product favicons were pulled from Wikimedia Commons file pages and are retained here with confirmed project distribution rights:

- [Gmail icon (2020)](https://commons.wikimedia.org/wiki/File:Gmail_icon_(2020).svg)
- [Google Calendar icon (2020)](https://commons.wikimedia.org/wiki/File:Google_Calendar_icon_(2020).svg)
- [Google Drive icon (2020)](https://commons.wikimedia.org/wiki/File:Google_Drive_icon_(2020).svg)
- [Google Docs 2020 Logo](https://commons.wikimedia.org/wiki/File:Google_Docs_2020_Logo.svg)
- [Google Sheets 2020 Logo](https://commons.wikimedia.org/wiki/File:Google_Sheets_2020_Logo.svg)
- [Google Slides 2020 Logo](https://commons.wikimedia.org/wiki/File:Google_Slides_2020_Logo.svg)
- [Google Forms 2020 Logo](https://commons.wikimedia.org/wiki/File:Google_Forms_2020_Logo.svg)
- [Google Meet icon (2020)](https://commons.wikimedia.org/wiki/File:Google_Meet_icon_(2020).svg)
- [Google Chat icon (2020)](https://commons.wikimedia.org/wiki/File:Google_Chat_icon_(2020).svg)
- [Google Keep 2020 Logo](https://commons.wikimedia.org/wiki/File:Google_Keep_2020_Logo.svg)
- [Google Contacts icon](https://commons.wikimedia.org/wiki/File:Google_Contacts_icon.svg)
- [Google Tasks 2021](https://commons.wikimedia.org/wiki/File:Google_Tasks_2021.svg)
- [Google Voice icon (2020)](https://commons.wikimedia.org/wiki/File:Google_Voice_icon_(2020).svg)
- [Google Admin icon](https://commons.wikimedia.org/wiki/File:Google_Admin_icon.svg)

## Remote Icon URLs

Do not load favicons from Wikipedia, Wikimedia Commons, Google-hosted URLs, CDNs, or other third-party hosts.

Remote icon URLs would weaken the extension's core privacy claim by causing supported Google Workspace pages to request assets from an outside host. They also make the extension dependent on external URL stability, hosting policy, cache behavior, and network availability.

Bundled local assets keep the extension simple, auditable, and network-free.

Before replacing any bundled product favicon, confirm the replacement asset can be redistributed in this public repository and in the Chrome Web Store package.

Google Workspace product names and logos are trademarks of Google LLC. This project is not affiliated with, endorsed by, or sponsored by Google.

# Chrome Web Store Listing Draft

This is draft store copy for a future public release. Do not submit a package that bundles Google-owned icon assets unless the right to redistribute those assets has been confirmed.

## Name

Legacy Workspace Favicons

## Short Description

Restore distinct Google Workspace tab favicons with a tiny, privacy-first extension.

## Detailed Description

Legacy Workspace Favicons restores distinct tab favicons for supported Google Workspace apps, making it easier to tell Gmail, Calendar, Drive, Docs, Sheets, Slides, Meet, Chat, Keep, Forms, and related tabs apart at a glance.

The extension is intentionally small. It does one thing: it replaces the favicon link in supported Google Workspace pages with an icon bundled inside the extension.

Privacy and simplicity are the point:

- No analytics
- No tracking
- No server
- No remote code
- No account system
- No settings sync
- No browser history access
- No cookie access
- No bookmark access
- No tab API access
- No broad host permissions
- No arbitrary website rules
- No page content inspection

The extension only runs on explicitly supported Google Workspace URLs. It only touches favicon link elements in the document head. It does not read emails, documents, calendar events, chats, files, contacts, page text, cookies, browser history, or bookmarks.

Supported apps:

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

This project is not affiliated with, endorsed by, or sponsored by Google. Google Workspace product names and logos are trademarks of Google LLC.

## Single Purpose

Restore distinct tab favicons on supported Google Workspace pages.

## Permission Justification

The extension requests no Chrome extension permissions.

It uses content script URL matches for specific Google Workspace apps so it can replace favicon link elements on those pages. It does not request access to all websites and does not use broad Google host patterns.

## Privacy Practices

Legacy Workspace Favicons does not collect, store, transmit, sell, or analyze user data.

The extension has no backend, no analytics, no tracking, no remote code, and no account system. It only replaces tab favicon links on supported Google Workspace pages using icon files bundled inside the extension.

## Suggested Category

Productivity

## Suggested Screenshots

Use sanitized screenshots only. Do not show private email, calendar events, documents, chats, account names, profile photos, organization names, or browser history.

Suggested screenshot set:

1. A Chrome tab strip showing several supported Workspace apps with distinct favicons.
2. A minimal before/after comparison using empty or demo Workspace pages.
3. The Chrome extension details page showing the narrow site access and no requested permissions.

## Store Submission Checklist

- Confirm public package contains only legally distributable icon assets.
- Confirm screenshots contain no personal or customer data.
- Confirm copy does not imply Google affiliation, endorsement, or sponsorship.
- Confirm `manifest.json` still has `permissions: []`.
- Confirm there is no `host_permissions` field.
- Confirm there is no background service worker.
- Confirm there are no analytics, tracking, remote code, or network calls.
- Run `npm run validate`.
- Run `npm test`.
- Run `npm run package`.


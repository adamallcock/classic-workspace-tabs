# Chrome Web Store Dashboard Text

Use this as paste-ready copy for the Chrome Web Store Developer Dashboard.

## Name

Classic Workspace Tabs

## Short Description

Restore distinct Google Workspace tab icons with a tiny, privacy-first extension.

## Detailed Description

Classic Workspace Tabs restores distinct tab icons for supported Google Workspace apps, making it easier to tell Gmail, Calendar, Drive, Docs, Sheets, Slides, Meet, Chat, Keep, Forms, and related tabs apart at a glance.

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

## Host Permission Justification

The extension does not request `host_permissions`.

The manifest uses explicit content script matches for supported Google Workspace URLs only. The content script runs on those pages to replace favicon link elements in the document head.

## Privacy Practices

Classic Workspace Tabs does not collect, store, transmit, sell, or analyze user data.

The extension has no backend, no analytics, no tracking, no remote code, and no account system. It only replaces tab favicon links on supported Google Workspace pages using icon files bundled inside the extension.

## Data Usage Declaration

Data collection: no user data is collected.

Personally identifiable information: not collected.

Health information: not collected.

Financial and payment information: not collected.

Authentication information: not collected.

Personal communications: not collected.

Location: not collected.

Web history: not collected.

User activity: not collected.

Website content: not collected.

Limited Use statement: not applicable because the extension does not collect or transmit user data.

## Suggested Category

Productivity

## Distribution

Visibility: Public

Pricing: Free

Regions: All regions, unless you want to limit launch scope.

## Test Instructions

No test account or credentials are required.

To test:

1. Install the extension in Chrome.
2. Open a supported Google Workspace URL, such as Gmail, Calendar, Drive, Docs, Sheets, Slides, Meet, Chat, Keep, Contacts, Tasks, Voice, or Admin.
3. Confirm the tab favicon is replaced with the bundled app-specific icon.
4. Open an unsupported URL and confirm the extension does not change the favicon.

## Suggested Screenshots

Use sanitized screenshots only. Do not show private email, calendar events, documents, chats, account names, profile photos, organization names, or browser history.

Suggested screenshot set:

1. A Chrome tab strip showing several supported Workspace apps with distinct favicons.
2. A minimal before/after comparison using empty or demo Workspace pages.
3. The Chrome extension details page showing the narrow site access and no requested permissions.

## Store Submission Checklist

- Confirm bundled icon distribution rights still cover the submitted package.
- Confirm screenshots contain no personal or customer data.
- Confirm copy does not imply Google affiliation, endorsement, or sponsorship.
- Confirm `manifest.json` still has `permissions: []`.
- Confirm there is no `host_permissions` field.
- Confirm there is no background service worker.
- Confirm there are no analytics, tracking, remote code, or network calls.
- Run `npm run validate`.
- Run `npm test`.
- Run `npm run package`.

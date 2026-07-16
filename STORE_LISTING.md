# Chrome Web Store Dashboard Text

Use this as paste-ready copy for the Chrome Web Store Developer Dashboard.

Before publishing or updating the listing, compare this copy with the live
Chrome Web Store listing, `manifest.json`, `README.md`, and the release
checklist in `docs/runbooks/2026-07-02-release-checklist.md`.

The extension package supplies the localized name and short description through
`_locales/`. In the dashboard, select each supported language and paste the
matching detailed description below. Do not add a list of Google product names
to any description.

## English (`en`)

### Name

Classic Tab Icons for Google Workspace™

### Short Description

Restores familiar pre-2026 Google Workspace tab icons with no permissions, tracking, or remote requests.

### Detailed Description

Classic Tab Icons for Google Workspace™ restores the familiar, app-specific favicon design used before 2026 so busy tab strips are easier to scan.

Calendar tabs show today's date and update automatically after local midnight. Every icon is bundled inside the extension, so no outside server is contacted.

Features:

- Familiar, distinct tab icons that are easier to recognize at a glance
- A Calendar favicon that displays the current local date
- No Chrome extension permissions
- No tracking, analytics, remote requests, account, popup, or settings
- Explicit support for selected Google Workspace pages only

The extension only changes favicon link elements in the document head. It does not read emails, documents, events, chats, files, contacts, page text, cookies, browser history, or bookmarks.

This project is not affiliated with, endorsed by, or sponsored by Google. Google Workspace and related names and logos are trademarks of Google LLC.

## Spanish (`es`)

### Name

Iconos clásicos de pestañas para Google Workspace™

### Short Description

Restaura los iconos familiares anteriores a 2026 en las pestañas de Google Workspace, sin permisos ni seguimiento.

### Detailed Description

Iconos clásicos de pestañas para Google Workspace™ recupera el diseño familiar y específico de cada aplicación que se usaba antes de 2026, para que sea más fácil encontrar la pestaña correcta.

La pestaña de Calendar muestra la fecha de hoy y se actualiza automáticamente después de la medianoche local. Todos los iconos están incluidos en la extensión, por lo que no se contacta con ningún servidor externo.

Funciones:

- Iconos familiares y distintos que se reconocen de un vistazo
- Un icono de Calendar que muestra la fecha local actual
- Sin permisos de extensiones de Chrome
- Sin seguimiento, analíticas, solicitudes remotas, cuenta, ventana emergente ni ajustes
- Compatibilidad explícita solo con páginas seleccionadas de Google Workspace

La extensión solo cambia los enlaces de favicon del encabezado del documento. No lee correos, documentos, eventos, chats, archivos, contactos, texto de páginas, cookies, historial ni marcadores.

Este proyecto no está afiliado, respaldado ni patrocinado por Google. Google Workspace y los nombres y logotipos relacionados son marcas de Google LLC.

## German (`de`)

### Name

Klassische Tab-Symbole für Google Workspace™

### Short Description

Stellt vertraute Google Workspace-Tab-Symbole von vor 2026 wieder her - ohne Berechtigungen, Tracking oder Server.

### Detailed Description

Klassische Tab-Symbole für Google Workspace™ stellt das vertraute, app-spezifische Favicon-Design von vor 2026 wieder her. So lässt sich in einer vollen Tableiste der richtige Tab schneller erkennen.

Der Kalender-Tab zeigt das heutige Datum und aktualisiert sich automatisch nach der lokalen Mitternacht. Alle Symbole sind in der Erweiterung enthalten, sodass kein externer Server kontaktiert wird.

Funktionen:

- Vertraute, klar unterscheidbare Tab-Symbole
- Ein Kalender-Favicon mit dem aktuellen lokalen Datum
- Keine Chrome-Erweiterungsberechtigungen
- Kein Tracking, keine Analyse, keine externen Anfragen, kein Konto, Popup oder Einstellungsmenü
- Nur ausdrücklich unterstützte Google Workspace-Seiten

Die Erweiterung ändert ausschließlich Favicon-Links im Dokumentkopf. Sie liest keine E-Mails, Dokumente, Termine, Chats, Dateien, Kontakte, Seitentexte, Cookies, Browser-Verläufe oder Lesezeichen.

Dieses Projekt ist weder mit Google verbunden noch von Google unterstützt oder gesponsert. Google Workspace sowie zugehörige Namen und Logos sind Marken von Google LLC.

## Single Purpose

Restore familiar tab favicons on supported Google Workspace pages.

## Permission Justification

The extension requests no Chrome extension permissions.

It uses content script URL matches for specific Google Workspace apps so it can replace favicon link elements on those pages. It does not request access to all websites and does not use broad Google host patterns.

## Host Permission Justification

The extension does not request `host_permissions`.

The manifest uses explicit content script matches for supported Google Workspace URLs only. The content script runs on those pages to replace favicon link elements in the document head.

## Privacy Practices

Classic Tab Icons for Google Workspace™ does not collect, store, transmit, sell, or analyze user data.

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

Functionality & UI

## Distribution

Visibility: Public

Pricing: Free

Regions: All regions, unless you want to limit launch scope.

## Test Instructions

No test account or credentials are required.

To test:

1. Install the extension in Chrome.
2. Open a supported Google Workspace URL, such as Gmail or Calendar.
3. Confirm the tab favicon is replaced with the bundled app-specific icon.
4. On Calendar, confirm the favicon displays the current local day.
5. Open an unsupported URL and confirm the extension does not change the favicon.

## Suggested Screenshots

Use sanitized screenshots only. Do not show private email, calendar events, documents, chats, account names, profile photos, organization names, or browser history.

Use the existing carefully designed screenshot and promotional assets. Do not
replace them with synthetic browser mockups. Localized screenshots are optional
for the initial Spanish and German listings; the small and marquee promo tiles
cannot be localized in the dashboard.

If localized screenshots are added later, translate only the concise headline
within the existing source design and retain the same composition and quality.

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
- Run `npm run smoke:chrome` when local Chromium and `openssl` are available.
- Confirm the README Chrome Web Store badge and listing link match the current
  public store state.

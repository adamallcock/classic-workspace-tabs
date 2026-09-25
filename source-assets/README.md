# Calendar favicon source set

These 31 PNGs are native 32 px frames extracted on 2026-09-24 from Google's date-specific `https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_N.ico`, where `N` is 1 through 31 without padding. The local filenames are zero padded for the extension's runtime lookup. `npm run generate:calendar-icons` copies them to `icons/calendar-days/` without fetching or transforming them.

The SHA-256 of all 31 PNG byte sequences concatenated in ascending day order is `b1ee37f0360198f26389616dec16548b7d209e5bd74b42a60288c2607958cd46`. Distribution of this new source set requires maintainer confirmation before public release; see [ASSETS.md](../ASSETS.md).

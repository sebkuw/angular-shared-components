# Changelog

All notable changes to `@sebkuw/shared-ui-list` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

### Added

- Added library-specific development rules and a Codex skill for configurable lists, tables and data interactions.
- Defined permissions/claims, semantic table, keyboard, responsive, E2E and visual regression requirements for future list changes.
- Added access rules for tables, columns, actions, filters, selection, visibility and export.
- Added configurable table labels, accessible caption/`aria-sort`, keyboard sorting and cell activation.
- Replaced placeholder CSV rows with real data export, escaping, formula neutralization and SSR-safe browser access.
- Added locale/formatter providers, public API tests, export/SSR tests and Playwright responsive/visual coverage.

### Changed

- Changed the package coordinate from `@netdevs/shared-ui-list` to `@sebkuw/shared-ui-list`, migrated its core peer dependency and added GitHub Packages publication metadata. Consumers must update dependencies and imports; the new coordinate starts at `0.0.1`.
- Changed the filter panel to a responsive auto-fit grid with stacked range fields on narrow viewports.

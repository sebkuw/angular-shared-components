# Changelog

All notable changes to `@sebkuw/shared-ui-list` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

## [0.1.0] - 2026-08-17

### Added

- Added configurable empty and error states, retry/empty actions and an error signal to `DynamicTableComponent`.
- Added library-specific development rules and a Codex skill for configurable lists, tables and data interactions.
- Defined permissions/claims, semantic table, keyboard, responsive, E2E and visual regression requirements for future list changes.
- Added access rules for tables, columns, actions, filters, selection, visibility and export.
- Added configurable table labels, accessible caption/`aria-sort`, keyboard sorting and cell activation.
- Replaced placeholder CSV rows with real data export, escaping, formula neutralization and SSR-safe browser access.
- Added locale/formatter providers, public API tests, export/SSR tests and Playwright responsive/visual coverage.

### Changed

- Normalized library source, tests, metadata and documentation to the repository Prettier style.
- Changed the package coordinate from `@netdevs/shared-ui-list` to `@sebkuw/shared-ui-list`, migrated its core peer dependency and added GitHub Packages publication metadata. Consumers must update dependencies and imports; the new coordinate starts at `0.0.1`.
- Changed the filter panel to a responsive auto-fit grid with stacked range fields on narrow viewports.
- Migrated standard filter, export and selection actions plus the table loading overlay to shared primitives; retained native/Material buttons for menus and sortable headers where their focus semantics are integral.

### Fixed

- Fixed the clear-filter action so it reacts to filter-form changes and continues to do so after a dynamic column reconfiguration.

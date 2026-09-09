# Changelog

All notable changes to `@sebkuw/shared-ui-layout` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

### Changed

- Bumped the package and its internal shared UI peer dependencies to `0.2.1` for the synchronized GitHub Packages release.

## [0.1.0] - 2026-08-17

### Added

- Added typed badge configuration to menu items and responsive badge rendering in expanded and collapsed navigation.
- Added an SSR-safe skip link that reveals itself on keyboard focus and moves focus to the configured main-content target.
- Added library-specific development rules and a Codex skill for responsive page structure and navigation.
- Defined permissions/claims, landmark, focus, keyboard, Router integration, E2E and visual regression requirements for future layout changes.
- Added reactive access rules to menu items and the page-header information action.
- Rebuilt side navigation with a named `nav`, native group buttons, `aria-expanded`, keyboard operation and logical CSS properties.
- Added OnPush page headers, semantic `header` markup, configurable accessible names, token-based responsive styles and public API/E2E/visual coverage.

### Changed

- Normalized library source, tests, templates, styles, metadata and documentation to the repository Prettier style.
- Changed the package coordinate from `@netdevs/shared-ui-layout` to `@sebkuw/shared-ui-layout`, migrated its core peer dependency and added GitHub Packages publication metadata. Consumers must update dependencies and imports; the new coordinate starts at `0.0.1`.
- Migrated the page-header information action to the public icon-button primitive while retaining the native side-menu group trigger for full-row navigation semantics.

# Changelog

All notable changes to `@sebkuw/shared-ui-theme` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

### Changed

- Bumped the package to `0.2.1` for the synchronized GitHub Packages release.

## [0.1.0] - 2026-08-17

### Added

- Added semantic warning plus danger, success, info and warning contrast tokens for buttons and inline feedback in light, dark and forced-colors modes.
- Added library-specific development rules and a Codex skill for semantic design tokens and configurable theming.
- Defined WCAG 2.2 AA contrast, focus, reduced motion, forced colors, responsive and RTL requirements for future theme changes.
- Added typed semantic token names and a published `styles/tokens.css` entry point.
- Added light/dark palettes, visible focus, reduced-motion and forced-colors adaptations.
- Added token and public API contract tests plus visual coverage in the demo application.

### Changed

- Normalized library source, tests, metadata and documentation to the repository Prettier style.
- Changed the package coordinate and stylesheet entry point from `@netdevs/shared-ui-theme` to `@sebkuw/shared-ui-theme` and added GitHub Packages publication metadata. Consumers must update dependencies, imports and the `styles/tokens.css` path; the new coordinate starts at `0.0.1`.

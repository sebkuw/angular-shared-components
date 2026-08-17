# Changelog

All notable changes to `@sebkuw/shared-ui-feedback` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

### Added

- Added configurable empty and error states with optional icons, accessible announcements and access-aware actions.
- Added a focus-managed confirmation-dialog service with positive/negative actions and safe cancel-first initial focus.
- Added `NotificationService` and `provideSharedNotifications` for consistent message types, timeouts, placement and dismiss labels.
- Added library-specific development rules and a Codex skill for accessible dialogs and notifications.
- Defined live region, focus management, keyboard, timeout, permissions/claims, E2E and visual regression requirements for future feedback changes.
- Replaced raw HTML dialog rendering with safe text or explicit `TemplateRef` content.
- Added access-aware dialog/notification actions, configurable accessible labels and OnPush change detection.
- Added polite/assertive live-region semantics, responsive token-based notification styles and public API/E2E/visual coverage.

### Changed

- Normalized library source, tests, styles, metadata and documentation to the repository Prettier style.
- Changed the package coordinate from `@netdevs/shared-ui-feedback` to `@sebkuw/shared-ui-feedback`, migrated its core peer dependency and added GitHub Packages publication metadata. Consumers must update dependencies and imports; the new coordinate starts at `0.0.1`.
- Migrated dialog confirmation and notification action/dismiss controls to the public shared button primitives while preserving dialog close results and live-region behavior.

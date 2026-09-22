# Changelog

All notable changes to `@sebkuw/shared-ui-feedback` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

### Changed

- Bumped the package and its internal shared UI peer dependencies to `0.4.0` for the synchronized additive release.
- Bumped the package and its internal shared UI peer dependencies to `0.3.1` for the synchronized GitHub Packages release.

## [0.3.0] - 2026-09-15

### Added

- Added `FormModalService`, `FormModalRef` and `FormModalComponent` for hosting application-owned form templates with configurable title, description, cancel/submit actions and responsive dimensions.
- Added asynchronous loading, disabled and assertive error states, reactive submit access rules, inert form content, initial focus, focus trap/restore and Escape behavior.
- Added unit, host-overlay, public API, demo and Playwright regression coverage plus a supplier-assignment integration example.

## [0.2.1] - 2026-09-14

### Changed

- Bumped the package and its internal shared UI peer dependencies to `0.2.1` for the synchronized GitHub Packages release.

## [0.1.0] - 2026-08-17

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

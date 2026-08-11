# Changelog

All notable changes to `@netdevs/shared-ui-forms` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

### Added

- Added library-specific development rules and a Codex skill for typed, configurable Angular form components.
- Defined permissions/claims, accessibility, keyboard, responsive, integration, E2E and visual regression requirements for future form changes.
- Added shared access rules to forms, fields, details fields and details actions with deny-by-default behavior.
- Added configurable accessible names, autocomplete, file actions and nested-table row labels.
- Added semantic details markup, OnPush change detection, responsive token-based styling and public API/E2E/visual coverage.
- Added the `DynamicFormField` discriminated union to type-check the configuration of every supported field kind, including nested table columns.

### Changed

- Changed the form submit action to the filled Material button treatment so the primary action remains visually distinct.

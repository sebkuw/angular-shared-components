# Changelog

All notable changes to `@sebkuw/shared-ui-forms` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

### Changed

- Bumped the package and its internal shared UI peer dependencies to `0.2.1` for the synchronized GitHub Packages release.

## [0.1.0] - 2026-08-17

### Added

- Added `FormFieldShellComponent` for visible labels, required markers, hints, errors, stable ARIA ids and character counts.
- Added `FormErrorSummaryComponent` with focusable links to invalid controls and `FormCompletionIndicatorComponent` for percentage completion of visible, enabled required fields.
- Integrated configurable error summaries, completion guidance and shell-based labels/hints into `DynamicFormComponent` with host, accessibility and public API tests.
- Added library-specific development rules and a Codex skill for typed, configurable Angular form components.
- Defined permissions/claims, accessibility, keyboard, responsive, integration, E2E and visual regression requirements for future form changes.
- Added shared access rules to forms, fields, details fields and details actions with deny-by-default behavior.
- Added configurable accessible names, autocomplete, file actions and nested-table row labels.
- Added semantic details markup, OnPush change detection, responsive token-based styling and public API/E2E/visual coverage.
- Added the `DynamicFormField` discriminated union to type-check the configuration of every supported field kind, including nested table columns.

### Changed

- Changed invalid dynamic-form submission so the submit action remains operable, marks controls touched and focuses the linked error summary instead of being permanently disabled.
- Normalized library source, tests, templates, styles, metadata and documentation to the repository Prettier style.
- Changed the package coordinate from `@netdevs/shared-ui-forms` to `@sebkuw/shared-ui-forms`, migrated its core peer dependency and added GitHub Packages publication metadata. Consumers must update dependencies and imports; the new coordinate starts at `0.0.1`.
- Changed the form submit action to the filled Material button treatment so the primary action remains visually distinct.
- Migrated submit, details, file and editable-table row actions to the public shared button and icon-button primitives while retaining their configured labels, permissions and events.

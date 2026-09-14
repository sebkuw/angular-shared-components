# Changelog

## [Unreleased]

### Added

- Added a supplier-assignment form modal example with validation, asynchronous loading state, focus restoration and Playwright keyboard coverage.

### Added

- Added a notification popover example with a badge plus keyboard, focus-restoration and responsive Playwright coverage.

## [0.1.0] - 2026-08-17

### Added

- Added skeleton, badge and progress examples plus a navigation badge integration scenario.
- Added cancel-first destructive confirmation, reusable empty/error states and retryable table-state scenarios.
- Added centralized notification configuration and service usage in place of direct snack-bar setup.
- Added dynamic-form completion progress, shared field shells, associated hints and linked/focus-managed error-summary interactions.
- Added integrated icon-registry, action-link, icon-link, action-bar, visually-hidden and keyboard skip-link examples with Playwright coverage.
- Added integration examples for public text, text + image and image-only buttons, a visible required field label, block loading state and all inline alert tones with working action and dismiss interactions.
- Added a stable local preview at `http://127.0.0.1:4200/` through the standard `npm start`, `npm run dev` and `npm run start:demo` commands.
- Added the Angular 20 shared component gallery with reactive access-context examples.
- Added Playwright desktop and 320 px tests for permissions, keyboard sorting/dialogs, accessible names, notification announcements, focus visibility and reflow.
- Added reviewed Windows visual regression baselines for desktop and mobile viewports.
- Added self-hosted Apache-2.0-licensed Material Icons for deterministic offline rendering.
- Added every dynamic form field kind, editable/removable details with formatted values and a spacer, and locally functional table filter examples.

### Changed

- Normalized demo source and host configuration to the repository Prettier style.
- Migrated all ordinary demo actions and hosted forms, details, tables, page-header and feedback actions to the public shared button primitives, with menu/sort/navigation semantic exceptions retained.
- Updated the integration host to resolve all libraries through their new `@sebkuw/shared-ui-*` public package coordinates.
- Changed the development demo to resolve libraries from their public source entry points, removing the prerequisite to build `dist` packages before previewing and enabling live reload for library edits.
- Added the Angular Material `azure-blue` theme and clearer section/action presentation to prevent unthemed controls, overlapping form content and indistinct square buttons.

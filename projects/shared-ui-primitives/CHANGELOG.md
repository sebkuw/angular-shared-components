# Changelog

All notable changes to `@sebkuw/shared-ui-primitives` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

### Added

- Added `PopoverComponent` and `PopoverTriggerDirective` with projected content, dialog/menu semantics, viewport-aware placement, outside-click and Escape dismissal, focus restoration, responsive styling, public API tests and demo/E2E coverage.

### Changed

- Updated the package overview and linked the source demo with setup instructions for public repository readers.
- Bumped the package and its `@sebkuw/shared-ui-core` peer dependency to `0.4.0` for the synchronized additive release.
- Bumped the package and its `@sebkuw/shared-ui-core` peer dependency to `0.3.1` for the synchronized GitHub Packages release.
- Bumped the package and its `@sebkuw/shared-ui-core` peer dependency to `0.2.1` for the synchronized GitHub Packages release.
- Bumped `@sebkuw/shared-ui-primitives` to `0.2.0` and declared Angular CDK as a peer dependency for overlay positioning.

## [0.1.0] - 2026-08-17

### Added

- Added accessible skeleton placeholders, configurable badges and determinate/indeterminate progress indicators.
- Added a configurable icon registry and `IconComponent` supporting safe image URLs, projected icons, semantic sizes and decorative or named accessibility modes.
- Added native-anchor `ActionLinkComponent` and `IconLinkComponent`, a responsive `ActionBarComponent` and `VisuallyHiddenDirective`.
- Added configurable public button and image-only icon button components with positive, negative, primary and neutral tones, loading states and permission-aware inaccessible behaviors.
- Added a visible field label, accessible loading indicator and inline alert with polite/assertive announcements, dismiss and optional action support.
- Added unit, host integration, public API, accessibility, responsive demo and Playwright coverage.

### Changed

- Added projected-icon support to text and icon-only buttons so Angular Material icons and other consumer-provided icon components can reuse the public button behavior without an additional dependency, and migrated the inline-alert dismiss action to the shared icon button.

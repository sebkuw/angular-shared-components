# Changelog

All notable changes to `@sebkuw/shared-ui-primitives` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

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

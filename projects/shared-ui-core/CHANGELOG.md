# Changelog

All notable changes to `@sebkuw/shared-ui-core` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

### Changed

- Bumped the package and `NETDEVS_SHARED_UI_VERSION` to `0.3.1` for the synchronized GitHub Packages release.
- Bumped the package to `0.2.1` for the synchronized GitHub Packages release.

## [0.1.0] - 2026-08-17

### Added

- Added library-specific development rules and a Codex skill for stable shared contracts and provider-agnostic permissions/claims primitives.
- Defined deny-by-default, reactive `any`/`all`/`none` and typed claims requirements for future authorization-aware UI work.
- Added `AccessRule`, typed claim requirements, `PermissionContext` and stable public rule constants.
- Added pure access evaluators, `providePermissionContext`, reactive `PermissionService` and `CanAccessDirective` with fallback templates.
- Added rule, provider, reactive-session, directive and public API tests.

### Changed

- Normalized library source, tests, metadata and documentation to the repository Prettier style.
- Changed the package coordinate from `@netdevs/shared-ui-core` to `@sebkuw/shared-ui-core` and added GitHub Packages publication metadata. Consumers migrating from the previous coordinate must update dependencies and imports; the new coordinate starts at `0.0.1`.

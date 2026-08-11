# Changelog

All notable changes to `@netdevs/shared-ui-core` are documented in this file. The format follows Keep a Changelog, and releases follow Semantic Versioning.

## [Unreleased]

### Added

- Added library-specific development rules and a Codex skill for stable shared contracts and provider-agnostic permissions/claims primitives.
- Defined deny-by-default, reactive `any`/`all`/`none` and typed claims requirements for future authorization-aware UI work.
- Added `AccessRule`, typed claim requirements, `PermissionContext` and stable public rule constants.
- Added pure access evaluators, `providePermissionContext`, reactive `PermissionService` and `CanAccessDirective` with fallback templates.
- Added rule, provider, reactive-session, directive and public API tests.

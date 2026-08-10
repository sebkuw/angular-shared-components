# @netdevs/shared-ui-core

Core contracts and helpers shared by NetDevs UI libraries.

## Current public API

The package currently exports NETDEVS_SHARED_UI_VERSION. New cross-library contracts, injection tokens and provider functions belong here when they are independent of a particular UI package.

## Architectural role

- Keep shared contracts independent of Angular Material, the DOM and a particular identity provider.
- Host the common reactive permissions/claims contract used by UI components.
- Apply deny-by-default behavior and explicit any, all and none rule semantics.
- Keep backend authorization authoritative; frontend evaluation controls presentation and interaction only.
- Export supported symbols through src/public-api.ts and avoid deep imports.

## Required quality standard

New or changed APIs must retain Angular 20 and strict TypeScript compatibility, work with SSR/hydration, remain tree-shakeable and include unit, integration, public API and regression coverage. Permissions work must test loading, missing context, allow, deny, claims and reactive session changes.

## Development

- [Library agent instructions](AGENTS.md)
- [Core development skill](../../.agents/skills/develop-shared-ui-core/SKILL.md)
- [Changelog](CHANGELOG.md)
- [Repository package guide](../../README.md#1-core---netdevsshared-ui-core)

Verify changes with:

    npm run test:shared-ui-core
    npm run build:shared-ui-core

Update this README, src/public-api.ts when necessary, and the Unreleased section of CHANGELOG.md in the same change.

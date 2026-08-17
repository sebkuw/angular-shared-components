# Changelog

All notable repository-wide changes are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and released packages follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added icon-registry, semantic link, responsive action-bar, visually-hidden and skip-link foundations with unit, public API, demo and keyboard E2E coverage.
- Added the `@sebkuw/shared-ui-primitives` package with configurable text/image buttons, image-only icon buttons, visible field labels, loading indicators and inline alerts, including unit, integration, public API, accessibility, responsive demo and Playwright coverage.
- Added semantic warning and status contrast tokens for accessible positive, negative, warning and informational primitives in light, dark and forced-colors modes.
- Added GitHub Packages metadata, a scope-only `.npmrc` mapping and an automated GitHub Release workflow that tests, builds and publishes all seven libraries with the repository `GITHUB_TOKEN`.
- Added repository-wide and library-specific `AGENTS.md` guidance for Angular 20 architecture, free dependencies, reusable configuration, permissions/claims, WCAG 2.2 AA, keyboard support, responsive design, testing, documentation and releases.
- Added repository-scoped Codex skills for the monorepo and each shared UI library under `.agents/skills`.
- Established required changelog and documentation updates for every repository change.
- Added a reactive, deny-by-default permissions/claims foundation with `any`, `all`, `none`, typed claims, a provider function, service and structural directive.
- Added semantic theme tokens with light/dark, focus-visible, reduced-motion and forced-colors support.
- Added the Angular component gallery and Playwright desktop/320 px E2E, keyboard, access, accessibility and visual regression suites.
- Added public API contract tests and a stable Chrome Headless CI launcher for all libraries.

### Changed

- Normalized repository source, configuration, documentation and agent files to the enforced Prettier style so the global formatting check succeeds on a clean checkout.
- Migrated standard actions across forms, lists, page headers, feedback and the demo to `ButtonComponent`, `IconButtonComponent` and `LoadingComponent`; native/Material buttons remain only for menu, sortable-header and navigation-row semantics.
- Changed every public npm package coordinate from `@netdevs/shared-ui-*` to `@sebkuw/shared-ui-*`. Consumers must replace the old package names in dependencies, imports and stylesheet paths. The new GitHub Packages coordinates begin their own version history at `0.0.1`.
- Expanded and themed the component gallery with all form field kinds, editable details, working responsive filters and regression coverage for form geometry and primary actions.
- Strengthened dynamic form configuration with a discriminated field union and changed filter controls to an auto-fit responsive grid.
- Changed the demo preview to use public library source entry points with live reload and a stable `npm start` command at `http://127.0.0.1:4200/`, without requiring prebuilt `dist` packages.
- Updated the Angular 20 runtime and compiler family to 20.3.27 to resolve production dependency advisories while retaining the Angular 20 compatibility contract.
- Replaced the demo icon font package with the Apache-2.0-licensed `material-icons` package and verified all direct dependency licenses against the repository policy.
- Integrated shared access rules into forms, details, tables, columns, table features, actions, navigation, page headers, dialogs and notifications.
- Made form/list copy, accessible names and formatter behavior configurable and improved responsive/RTL-friendly styling.
- Reworked list semantics, keyboard sorting and cell activation, real CSV export, formula neutralization and SSR-safe storage/download behavior.
- Reworked side navigation to use a `nav` landmark, links and keyboard-operable native buttons.
- Reworked feedback components to use safe text/templates, live-region roles and accessible dismiss/action labels.

# @netdevs/shared-ui-theme

Shared theming contracts and design tokens for NetDevs UI libraries.

## Current public API

The package exports `NETDEVS_SHARED_UI_THEME_CLASS`, `NETDEVS_SHARED_UI_THEME_TOKENS` and `NETDEVS_SHARED_UI_THEME_STYLES`. The published stylesheet is `@netdevs/shared-ui-theme/styles/tokens.css`.

Include the stylesheet and apply `netdevs-shared-ui-theme` to the application shell. Set `data-theme="dark"` for the built-in dark palette. Consumer overrides can replace any documented CSS custom property at the shell boundary.

## Architectural role

- Provide semantic, fully configurable design tokens rather than component-specific hard-coded values.
- Support light and dark themes, visible focus, forced colors/high contrast and reduced motion.
- Maintain WCAG 2.2 AA contrast for every intended text and interactive state.
- Prefer logical CSS properties so components work with RTL.
- Treat renamed or removed public tokens and changed token semantics as public API changes.

## Required quality standard

Theme changes must retain Angular 20 compatibility and include tests for public exports, default values, consumer overrides, contrast, focus, reduced motion and high-contrast behavior. Representative components must receive visual regression coverage in the demo application once that infrastructure is present.

## Development

- [Library agent instructions](AGENTS.md)
- [Theme development skill](../../.agents/skills/develop-shared-ui-theme/SKILL.md)
- [Changelog](CHANGELOG.md)
- [Repository package guide](../../README.md#2-theme---netdevsshared-ui-theme)

Verify changes with:

    npm run test:shared-ui-theme
    npm run build:shared-ui-theme

Update this README, src/public-api.ts when necessary, and the Unreleased section of CHANGELOG.md in the same change.

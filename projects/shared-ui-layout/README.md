# @sebkuw/shared-ui-layout

Responsive page structure and navigation components for NetDevs Angular applications.

## Installation

Configure GitHub Packages as described in the [repository installation guide](../../README.md#installation), then install the package and its shared peers:

```bash
npm install @sebkuw/shared-ui-layout @sebkuw/shared-ui-core @sebkuw/shared-ui-primitives
```

## Current public API

The package exports PageHeaderComponent, SideMenu, MenuItem, SideMenuService, MENU_DATA_TOKEN and related page header data types. The authoritative export list is src/public-api.ts.

`MenuItem.access` filters entire navigation branches reactively. `PageHeaderComponent.infoAccess` controls the optional information action, which uses the public icon-button primitive. The side menu renders a named `nav` landmark; destinations are links and expandable groups remain native buttons with `aria-expanded`, so the full navigation-row interaction works without a pointer.

## Architectural role

- Provide configurable headers, navigation and side-menu state without application-specific business logic.
- Integrate with Angular Router without treating the router as the source of permissions.
- Filter inaccessible navigation items through the shared permissions/claims contract.
- Keep route protection and backend authorization as separate mandatory layers.
- Support SSR/hydration, long translations and RTL.

## Accessibility and interaction

Use appropriate header, nav, main and aside landmarks. Ordinary navigation should remain a semantic list of links. Menu triggers, overlays and nested navigation must work with the keyboard, retain visible focus, handle Escape and restore focus. Responsive collapse/overlay behavior must preserve content and function from 320 CSS px through zoom and reflow.

## Required tests

Cover active and nested routes, menu state, toggle/overlay behavior, permissions changes, Router integration, landmarks, keyboard, Escape, focus restoration, responsive viewports, RTL, public API, E2E, visual and regression cases.

## Development

- [Library agent instructions](AGENTS.md)
- [Layout development skill](../../.agents/skills/develop-shared-ui-layout/SKILL.md)
- [Changelog](CHANGELOG.md)
- [Repository package guide](../../README.md#5-layout---sebkuwshared-ui-layout)

Verify changes with:

    npm run test:shared-ui-layout
    npm run build:shared-ui-layout

Update this README, src/public-api.ts when necessary, and the Unreleased section of CHANGELOG.md in the same change.

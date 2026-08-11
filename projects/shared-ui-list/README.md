# @netdevs/shared-ui-list

Configurable data lists and tables for NetDevs Angular applications.

## Current public API

The package exports DynamicTableComponent, typed table/pagination/filter/feature/export models, TableExportService and ValueFormatterPipe. The authoritative export list is src/public-api.ts.

The component accepts a top-level `access` rule. Columns, cell actions, toolbar actions, filtering, selection, column visibility and CSV export can each define their own access rule. `labels` configures table copy and accessible names; `provideValueFormatterOptions` configures locale-sensitive boolean/empty values.

Sorting uses native buttons and `aria-sort`. Actionable cells support Enter and Space. Frontend CSV export uses the supplied rows, escapes RFC-style fields, neutralizes spreadsheet formulas and avoids browser APIs during SSR.

The filter panel lays out configured text, select, boolean and range controls in a responsive auto-fit grid. Numeric and date ranges stack at very small widths instead of forcing the whole filter panel to scroll horizontally.

## Architectural role

- Keep data transport separate from table state and rendering.
- Configure columns, sorting, filtering, pagination, selection, row actions, formatting and export through typed APIs.
- Apply the shared permissions/claims mechanism to columns and actions before rendering.
- Preserve all important data and actions at small viewport sizes through configurable responsive presentation.
- Avoid assumptions about a particular row schema, API or server-side pagination implementation.

## Accessibility and interaction

Tabular data must use table semantics, an accessible name and correctly associated headers. Sorting must expose aria-sort. Filters, selection, pagination and row actions need accessible names, keyboard operation and predictable focus. Loading, empty and error states must be perceivable without relying only on color or animation.

## Required tests

Cover empty, large and changing datasets, sort, filter, pagination, selection, actions, formatting, export and configuration updates. Add permissions/claims, semantic table, keyboard/focus, 320 CSS px/reflow, RTL, public API, E2E, visual and regression tests as applicable.

## Development

- [Library agent instructions](AGENTS.md)
- [List development skill](../../.agents/skills/develop-shared-ui-list/SKILL.md)
- [Changelog](CHANGELOG.md)
- [Repository package guide](../../README.md#4-list---netdevsshared-ui-list)

Verify changes with:

    npm run test:shared-ui-list
    npm run build:shared-ui-list

Update this README, src/public-api.ts when necessary, and the Unreleased section of CHANGELOG.md in the same change.

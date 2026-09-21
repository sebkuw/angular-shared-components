# @sebkuw/shared-ui-list

Configurable data lists and tables for NetDevs Angular applications.

## Installation

Configure GitHub Packages as described in the [repository installation guide](../../README.md#installation), then install the package and its shared peers:

```bash
npm install @sebkuw/shared-ui-list @sebkuw/shared-ui-core @sebkuw/shared-ui-primitives @sebkuw/shared-ui-feedback @sebkuw/shared-ui-forms
```

## Current public API

The package exports DynamicTableComponent, typed table/pagination/filter/feature/export models, TableExportService and ValueFormatterPipe. The authoritative export list is src/public-api.ts.

The component accepts a top-level `access` rule. Columns, cell actions, toolbar actions, filtering, selection, column visibility and CSV export can each define their own access rule. `labels` configures table copy and accessible names; `provideValueFormatterOptions` configures locale-sensitive boolean/empty values.

Sorting uses native buttons and `aria-sort`. Actionable cells support Enter and Space. Frontend CSV export uses the supplied rows, escapes RFC-style fields, neutralizes spreadsheet formulas and avoids browser APIs during SSR.

The filter panel lays out configured text, select, asynchronous select, boolean and range controls in a responsive auto-fit grid. Every control has one persistent visible label plus separate placeholder guidance. Numeric and date ranges stack at very small widths instead of forcing the whole filter panel to scroll horizontally.

Use `type: 'async-select'` for large remote datasets. Supply signal-backed options/loading/error state and handle `(asyncFilterQuery)` in the application; selecting an option stores its key in the normal table filter and produces an equality filter.

```ts
import { signal } from '@angular/core';
import { type AsyncSearchSelectOption } from '@sebkuw/shared-ui-forms';
import { type Column } from '@sebkuw/shared-ui-list';

const customerOptions = signal<AsyncSearchSelectOption[]>([]);
const customerLoading = signal(false);

const columns: Column[] = [
  {
    name: 'customerId',
    displayName: 'Customer',
    type: 'guid',
    filterable: true,
    filterFieldConfig: {
      type: 'async-select',
      filterType: 'single',
      placeholder: 'Search customers',
      asyncOptions: customerOptions,
      asyncLoading: customerLoading,
      emptyText: 'No customers found',
    },
  },
];
```

```html
<shared-dynamic-table
  [columns]="columns"
  [data]="rows"
  [totalItems]="totalItems"
  [pageSize]="pageSize"
  [pageIndex]="pageIndex"
  [loading]="loading"
  (asyncFilterQuery)="loadCustomers($event.columnName, $event.query)"
/>
```

The table only emits queries and never performs transport work. Localize labels, placeholders and state text through `TableLabels` and `FilterFieldConfig`.

Pass an `errorMessage` signal to replace table content with `ErrorStateComponent`; configure `errorState` and handle `(retry)` to load data again. When a successful request returns no rows, `emptyState` and `(emptyStateAction)` provide an actionable empty result without inventing application-specific copy inside the library.

```html
<shared-dynamic-table
  [data]="rows"
  [errorMessage]="loadError"
  [emptyState]="{ title: 'No matching invoices' }"
  [errorState]="{ title: 'Invoices unavailable', action: { label: 'Try again' } }"
  (retry)="loadInvoices()"
/>
```

Standard toolbar, filter and selection actions use the public button primitives, and the table loading state uses the public loading component. Native/Material buttons remain only where their directives provide menu-trigger, menu-item or sortable-header focus and keyboard semantics.

## Architectural role

- Keep data transport separate from table state and rendering.
- Configure columns, sorting, filtering, pagination, selection, row actions, formatting and export through typed APIs.
- Apply the shared permissions/claims mechanism to columns and actions before rendering.
- Preserve all important data and actions at small viewport sizes through configurable responsive presentation.
- Avoid assumptions about a particular row schema, API or server-side pagination implementation.

## Accessibility and interaction

Tabular data must use table semantics, an accessible name and correctly associated headers. Sorting must expose aria-sort. Filters, selection, pagination and row actions need accessible names, keyboard operation and predictable focus. Loading, empty and error states are exposed as accessible status regions without relying only on color or animation.

## Required tests

Cover empty, large and changing datasets, sort, filter, pagination, selection, actions, formatting, export and configuration updates. Add permissions/claims, semantic table, keyboard/focus, 320 CSS px/reflow, RTL, public API, E2E, visual and regression tests as applicable.

## Development

- [Library agent instructions](AGENTS.md)
- [List development skill](../../.agents/skills/develop-shared-ui-list/SKILL.md)
- [Changelog](CHANGELOG.md)
- [Repository package guide](../../README.md#4-list---sebkuwshared-ui-list)

Verify changes with:

    npm run test:shared-ui-list
    npm run build:shared-ui-list

Update this README, src/public-api.ts when necessary, and the Unreleased section of CHANGELOG.md in the same change.

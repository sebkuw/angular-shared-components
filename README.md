# NetDevs Shared UI

Angular 20 workspace for reusable NetDevs UI packages.

This repository contains shared UI libraries used across internal Angular applications. The goal is to keep common business screens consistent: dynamic forms, details views, lists, navigation, page headers, dialogs and notifications should look and behave the same everywhere.

The workspace is split into smaller npm packages. Consuming applications can install only the parts they need instead of depending on one large package.

## Project Governance

- [Repository agent instructions](AGENTS.md)
- [Repository changelog](CHANGELOG.md)
- [Monorepo development skill](.agents/skills/develop-angular-shared-components/SKILL.md)

All contributions must preserve Angular 20 compatibility, use only approved free and open-source dependencies, keep components reusable and fully configurable, implement the shared permissions/claims visibility contract, meet WCAG 2.2 AA and keyboard requirements, include the complete required test matrix, and update documentation plus the appropriate changelog.

## Table of Contents

- [Project Governance](#project-governance)
- [Packages](#packages)
- [Requirements](#requirements)
- [Installation](#installation)
- [Package Guide](#package-guide)
  - [1. Core - `@sebkuw/shared-ui-core`](#1-core---sebkuwshared-ui-core)
  - [2. Theme - `@sebkuw/shared-ui-theme`](#2-theme---sebkuwshared-ui-theme)
  - [3. Forms - `@sebkuw/shared-ui-forms`](#3-forms---sebkuwshared-ui-forms)
  - [4. List - `@sebkuw/shared-ui-list`](#4-list---sebkuwshared-ui-list)
  - [5. Layout - `@sebkuw/shared-ui-layout`](#5-layout---sebkuwshared-ui-layout)
  - [6. Feedback - `@sebkuw/shared-ui-feedback`](#6-feedback---sebkuwshared-ui-feedback)
  - [7. Primitives - `@sebkuw/shared-ui-primitives`](#7-primitives---sebkuwshared-ui-primitives)
- [Development](#development)
- [Local Package Testing](#local-package-testing)
- [Publishing](#publishing)
- [Versioning](#versioning)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Packages

| Package                        | Responsibility                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `@sebkuw/shared-ui-core`       | Shared foundation for cross-package contracts and helpers.                                     |
| `@sebkuw/shared-ui-theme`      | Semantic CSS tokens, light/dark modes, focus, high-contrast and reduced-motion defaults.       |
| `@sebkuw/shared-ui-forms`      | Dynamic details view, create/edit form view, form field controls and form models.              |
| `@sebkuw/shared-ui-list`       | Dynamic table/list view with filtering, sorting, selection, pagination and CSV export support. |
| `@sebkuw/shared-ui-layout`     | Application layout components: page header and side menu.                                      |
| `@sebkuw/shared-ui-feedback`   | Dialogs, notifications, confirmations and reusable empty/error states.                         |
| `@sebkuw/shared-ui-primitives` | Accessible actions, icons, labels, loading, badges, progress and inline alerts.                |

## Requirements

| Tool        | Version                                                                             |
| ----------- | ----------------------------------------------------------------------------------- |
| Angular     | `20.x`                                                                              |
| Angular CLI | `20.x`                                                                              |
| TypeScript  | `~5.9`                                                                              |
| Node.js     | Use a Node.js version supported by Angular 20. Node 20 LTS or newer is recommended. |
| npm         | Use the npm version bundled with the selected Node.js runtime.                      |

The UI components use Angular Material and CDK. Consuming applications should configure an Angular Material theme and use compatible Angular 20 dependencies.

## Installation

GitHub Packages requires authentication for npm package installation, including public packages. Create a GitHub Personal Access Token (classic) with `read:packages`, expose it as `GITHUB_PACKAGES_TOKEN`, and configure the consuming application without committing the token value:

```ini
@sebkuw:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

Install only the packages needed by the application:

```bash
npm install @sebkuw/shared-ui-forms
npm install @sebkuw/shared-ui-list @sebkuw/shared-ui-feedback
npm install @sebkuw/shared-ui-layout
npm install @sebkuw/shared-ui-feedback
npm install @sebkuw/shared-ui-primitives
```

For applications using the full component set:

```bash
npm install \
  @sebkuw/shared-ui-core \
  @sebkuw/shared-ui-theme \
  @sebkuw/shared-ui-forms \
  @sebkuw/shared-ui-list \
  @sebkuw/shared-ui-layout \
  @sebkuw/shared-ui-feedback \
  @sebkuw/shared-ui-primitives
```

Angular Material and CDK are peer dependencies for UI packages that render Material components:

```bash
npm install @angular/material @angular/cdk
```

## Package Guide

The former `@netdevs/shared-ui-*` coordinates are not aliases. Existing consumers must replace those dependency names, TypeScript imports and the theme stylesheet path with `@sebkuw/shared-ui-*`.

### 1. Core - `@sebkuw/shared-ui-core`

Core owns the provider-agnostic, reactive permissions/claims contract used by every UI package.

Current exports:

| Export                                          | Description                                                  |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `NETDEVS_SHARED_UI_VERSION`                     | Current shared UI package version constant.                  |
| `AccessRule`, `PermissionContext`               | Typed `any`, `all`, `none` and claims contracts.             |
| `providePermissionContext`, `PermissionService` | Reactive access context provider and evaluator.              |
| `CanAccessDirective`                            | Structural UI visibility with an optional fallback template. |

Install:

```bash
npm install @sebkuw/shared-ui-core
```

Use:

```ts
import { NETDEVS_SHARED_UI_VERSION } from '@sebkuw/shared-ui-core';

console.info(`NetDevs Shared UI: ${NETDEVS_SHARED_UI_VERSION}`);
```

When to put code here:

- Shared public types used by more than one package.
- Framework-neutral helpers used by more than one package.
- Shared injection tokens that are not owned by a specific feature package.

Avoid putting feature components here. Forms, lists, layout and feedback should stay in their dedicated packages.

### 2. Theme - `@sebkuw/shared-ui-theme`

Theme is the styling foundation package. Its `styles/tokens.css` entry point defines semantic light/dark tokens and accessible platform adaptations.

Current exports:

| Export                           | Description                                            |
| -------------------------------- | ------------------------------------------------------ |
| `NETDEVS_SHARED_UI_THEME_CLASS`  | Shared root CSS class name: `netdevs-shared-ui-theme`. |
| `NETDEVS_SHARED_UI_THEME_TOKENS` | Stable CSS custom-property names.                      |
| `NETDEVS_SHARED_UI_THEME_STYLES` | Published stylesheet entry point.                      |

Install:

```bash
npm install @sebkuw/shared-ui-theme
```

Use:

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NETDEVS_SHARED_UI_THEME_CLASS } from '@sebkuw/shared-ui-theme';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main [class]="themeClass">
      <router-outlet />
    </main>
  `,
})
export class AppShellComponent {
  readonly themeClass = NETDEVS_SHARED_UI_THEME_CLASS;
}
```

Include `@sebkuw/shared-ui-theme/styles/tokens.css`, add `netdevs-shared-ui-theme` to the application shell and keep an Angular Material theme configured in the consuming application.

### 3. Forms - `@sebkuw/shared-ui-forms`

Forms contains schema-driven UI for common create, edit and details screens.

Main exports:

| Export                                                                            | Description                                         |
| --------------------------------------------------------------------------------- | --------------------------------------------------- |
| `DynamicFormComponent`                                                            | Renders create/edit forms from `DynamicFormConfig`. |
| `DynamicDetailsComponent`                                                         | Renders a details view from `DetailsConfig`.        |
| `DynamicFormConfig`, `FormField` and related field interfaces                     | Form configuration contracts.                       |
| `DetailsConfig`, `DetailField`                                                    | Details view configuration contracts.               |
| `FormInputTextComponent`, `FormInputNumberComponent`, `FormSelectComponent`, etc. | Reusable form field controls.                       |
| `AsyncSearchSelectComponent`                                                      | Remote-data combobox with debounced query output.   |
| `CastPipe`                                                                        | Template helper used by the dynamic form controls.  |

Install:

```bash
npm install @sebkuw/shared-ui-forms
```

Use `DynamicFormComponent`:

```ts
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicFormComponent, type DynamicFormConfig } from '@sebkuw/shared-ui-forms';

@Component({
  selector: 'app-user-form-page',
  standalone: true,
  imports: [DynamicFormComponent],
  template: `
    <shared-dynamic-form
      [config]="formConfig"
      [initialData]="initialData"
      [isEditMode]="isEditMode"
      [isSubmitting]="isSaving"
      (formSubmit)="save($event)"
    />
  `,
})
export class UserFormPageComponent {
  isEditMode = false;
  isSaving = false;
  initialData: Record<string, unknown> | null = null;

  formConfig: DynamicFormConfig = {
    columns: 2,
    submitButton: {
      labelCreate: 'Create',
      labelEdit: 'Save changes',
      position: 'right',
    },
    fields: [
      {
        key: 'firstName',
        label: 'First name',
        type: 'text',
        validators: [Validators.required],
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        validators: [Validators.required, Validators.email],
      },
      {
        key: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { key: 'admin', value: 'Administrator' },
          { key: 'user', value: 'User' },
        ],
      },
    ],
  };

  save(value: Record<string, unknown>): void {
    // Persist form value in the consuming application.
  }
}
```

Use `DynamicDetailsComponent`:

```ts
import { Component } from '@angular/core';
import { DynamicDetailsComponent, type DetailsConfig } from '@sebkuw/shared-ui-forms';

@Component({
  selector: 'app-user-details-page',
  standalone: true,
  imports: [DynamicDetailsComponent],
  template: `
    <shared-dynamic-details
      [data]="user"
      [config]="detailsConfig"
      (edit)="edit()"
      (remove)="remove()"
    />
  `,
})
export class UserDetailsPageComponent {
  user = {
    firstName: 'Anna',
    email: 'anna@example.com',
    active: true,
  };

  detailsConfig: DetailsConfig = {
    columns: 2,
    fields: [
      { key: 'firstName', label: 'First name' },
      { key: 'email', label: 'Email' },
      {
        key: 'active',
        label: 'Status',
        render: (value) => (value ? 'Active' : 'Inactive'),
      },
    ],
  };

  edit(): void {
    // Navigate to edit page.
  }

  remove(): void {
    // Confirm and remove entity.
  }
}
```

### 4. List - `@sebkuw/shared-ui-list`

List contains the dynamic table component and models used to build server-driven list views.

Main exports:

| Export                                                                       | Description                                                                             |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `DynamicTableComponent`                                                      | Server-side table with filtering, sorting, pagination, selection and column visibility. |
| `BaseRow`, `Column`, `CustomButton`                                          | Table row and column contracts.                                                         |
| `TableDataRequestEvent`, `AsyncFilterQueryEvent`, `TableFilter`, `TableSort` | Events and state emitted by the table, including remote filter queries.                 |
| `toPaginationRequestDto`                                                     | Helper that maps table request state to a .NET-style pagination DTO.                    |
| `TableExportService`                                                         | CSV export helper used by the table export workflow.                                    |
| `ValueFormatterPipe`                                                         | Formats displayed table cell values.                                                    |

Install:

```bash
npm install @sebkuw/shared-ui-list @sebkuw/shared-ui-forms
```

Use:

```ts
import { Component, signal } from '@angular/core';
import {
  DynamicTableComponent,
  toPaginationRequestDto,
  type BaseRow,
  type Column,
  type TableDataRequestEvent,
} from '@sebkuw/shared-ui-list';

interface UserRow extends BaseRow {
  Id: string;
  firstName: string;
  email: string;
  createdAt: string;
}

@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [DynamicTableComponent],
  template: `
    <shared-dynamic-table
      [columns]="columns"
      [data]="rows"
      [totalItems]="totalItems"
      [pageSize]="pageSize"
      [pageIndex]="pageIndex"
      [loading]="loading"
      (dataRequest)="loadData($event)"
      (rowClick)="openDetails($event.row)"
      (selectionChange)="selection = $event"
    />
  `,
})
export class UserListPageComponent {
  rows = signal<UserRow[]>([]);
  totalItems = signal(0);
  pageSize = signal(25);
  pageIndex = signal(0);
  loading = signal(false);
  selection: string[] = [];

  columns: Column[] = [
    {
      name: 'firstName',
      displayName: 'First name',
      type: 'string',
      sortable: true,
      filterable: true,
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      sortable: true,
      filterable: true,
    },
    {
      name: 'createdAt',
      displayName: 'Created',
      type: 'date',
      sortable: true,
      filterable: true,
      format: 'yyyy-MM-dd',
    },
  ];

  loadData(event: TableDataRequestEvent): void {
    const request = toPaginationRequestDto(event);
    // Send request to the API and update rows, totalItems, pageSize and pageIndex.
  }

  openDetails(row: UserRow): void {
    // Navigate to details page.
  }
}
```

The table expects data from the consuming application. It emits `dataRequest` whenever pagination, sorting or filtering changes.

### 5. Layout - `@sebkuw/shared-ui-layout`

Layout contains components used to compose the application shell and page-level navigation.

Main exports:

| Export                | Description                                         |
| --------------------- | --------------------------------------------------- |
| `PageHeaderComponent` | Consistent page title with optional info action.    |
| `SideMenu`            | Collapsible side menu component.                    |
| `MenuItem`            | Side menu item contract.                            |
| `SideMenuService`     | Menu state service.                                 |
| `MENU_DATA_TOKEN`     | Injection token used to provide menu configuration. |
| `InfoClickData`       | Event payload emitted by `PageHeaderComponent`.     |

Install:

```bash
npm install @sebkuw/shared-ui-layout
```

Use `PageHeaderComponent`:

```ts
import { Component } from '@angular/core';
import { PageHeaderComponent, type InfoClickData } from '@sebkuw/shared-ui-layout';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <shared-page-header
      headerText="Orders"
      infoTitle="Orders"
      infoContent="This page shows current customer orders."
      confirmationBtnText="Got it"
      (infoClick)="showInfo($event)"
    />
  `,
})
export class OrdersPageComponent {
  showInfo(data: InfoClickData): void {
    // Open a dialog or route this event to the application shell.
  }
}
```

Use `SideMenu`:

```ts
import { Component } from '@angular/core';
import { MENU_DATA_TOKEN, SideMenu, type MenuItem } from '@sebkuw/shared-ui-layout';

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    level: 0,
    route: '/dashboard',
  },
  {
    id: 'users',
    title: 'Users',
    icon: 'group',
    level: 0,
    children: [
      {
        id: 'users-list',
        title: 'User list',
        icon: 'list',
        level: 1,
        route: '/users',
      },
    ],
  },
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [SideMenu],
  providers: [
    {
      provide: MENU_DATA_TOKEN,
      useValue: MENU_ITEMS,
    },
  ],
  template: ` <shared-side-menu [collapsed]="collapsed" /> `,
})
export class AppShellComponent {
  collapsed = false;
}
```

`SideMenu` uses Angular Router links, so it should be used inside an application that has routing configured.

### 6. Feedback - `@sebkuw/shared-ui-feedback`

Feedback contains components for user-facing messages and informational overlays.

Main exports:

| Export                                              | Description                                                     |
| --------------------------------------------------- | --------------------------------------------------------------- |
| `InfoDialogComponent`, `InfoDialogData`             | Informational Angular Material dialog.                          |
| `ConfirmationDialogService`                         | Focus-managed positive/negative confirmation workflow.          |
| `FormModalService`, `FormModalRef`                  | Form host with asynchronous submit, loading and error states.   |
| `NotificationService`, `provideSharedNotifications` | Central notification API and configurable application defaults. |
| `EmptyStateComponent`, `ErrorStateComponent`        | Configurable page/list states with optional actions.            |

Install:

```bash
npm install @sebkuw/shared-ui-feedback
```

Use `InfoDialogComponent`:

```ts
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '@sebkuw/shared-ui-feedback';

@Component({
  selector: 'app-info-example',
  standalone: true,
  imports: [MatButtonModule],
  template: ` <button mat-raised-button type="button" (click)="openInfo()">Open info</button> `,
})
export class InfoExampleComponent {
  private readonly dialog = inject(MatDialog);

  openInfo(): void {
    this.dialog.open(InfoDialogComponent, {
      data: {
        title: 'Information',
        content: 'This action affects all selected records.',
        confirmationBtnText: 'Close',
      },
    });
  }
}
```

Use `NotificationService`:

```ts
import { Component, inject } from '@angular/core';
import { NotificationService } from '@sebkuw/shared-ui-feedback';
import { ButtonComponent } from '@sebkuw/shared-ui-primitives';

@Component({
  selector: 'app-notification-example',
  standalone: true,
  imports: [ButtonComponent],
  template: ` <shared-button (activated)="showSuccess()">Save</shared-button> `,
})
export class NotificationExampleComponent {
  private readonly notifications = inject(NotificationService);

  showSuccess(): void {
    this.notifications.success('Saved successfully.');
  }
}
```

Add `provideSharedNotifications()` to the application providers to customize defaults. The consuming application owns WebSocket connections and maps incoming domain events to this presentation service.

### 7. Primitives - `@sebkuw/shared-ui-primitives`

Primitives owns small, domain-independent building blocks used across application screens.

Current exports:

| Export                 | Description                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `ButtonComponent`      | Configurable text or text + image button with primary, positive, negative and neutral tones. |
| `IconButtonComponent`  | Image-only button with an explicit accessible label.                                         |
| `FieldLabelComponent`  | Visible native field label with a configurable required marker.                              |
| `LoadingComponent`     | Accessible inline, block or overlay loading status.                                          |
| `InlineAlertComponent` | Inline info, success, warning and error messages with optional actions.                      |
| `SkeletonComponent`    | Reduced-motion-aware text, rectangle and circle placeholders.                                |
| `BadgeComponent`       | Configurable counts, statuses and notification dots.                                         |
| `ProgressComponent`    | Determinate and indeterminate native progress indicator.                                     |
| `PopoverComponent`     | Accessible projected popover/dropdown with viewport-aware placement and focus restoration.   |

Install:

```bash
npm install @sebkuw/shared-ui-primitives @sebkuw/shared-ui-core @angular/cdk
```

Use:

```html
<shared-button tone="positive" (activated)="save()">Save</shared-button>
<shared-button tone="negative" appearance="outlined" (activated)="remove()"> Remove </shared-button>
<shared-icon-button iconSrc="/icons/refresh.svg" ariaLabel="Refresh results" />
<shared-popover ariaLabel="Notification options">
  <button sharedPopoverTrigger type="button">Notifications</button>
  <p>Three updates are ready.</p>
</shared-popover>
```

`ButtonComponent` also accepts `iconSrc`, so text + icon does not need a third component. See the [package README](projects/shared-ui-primitives/README.md) for loading, labels, alerts, permissions/claims, accessibility, responsive behavior, theming, i18n/RTL, SSR and testing details.

## Development

Install dependencies:

```bash
npm install
```

Build every package:

```bash
npm run build
```

Start the component gallery:

```bash
npm start
```

The same preview is available through `npm run dev` and `npm run start:demo` at <http://127.0.0.1:4200/>. It consumes the libraries through their public source entry points, so it does not require a separate `build:libs` step and live-reloads library changes.

Run every package test suite in Chrome Headless:

```bash
npm test
```

Run cross-browser interaction, responsive and visual regression checks:

```bash
npx playwright install
npm run test:e2e
npm run test:visual
```

Use `npm run test:visual:update` only after reviewing and accepting intentional visual changes. Baselines are stored next to the Playwright specification.

Build a single package:

```bash
npm run build:shared-ui-core
npm run build:shared-ui-theme
npm run build:shared-ui-primitives
npm run build:shared-ui-forms
npm run build:shared-ui-list
npm run build:shared-ui-layout
npm run build:shared-ui-feedback
```

Run tests for a single package:

```bash
npm run test:shared-ui-core
npm run test:shared-ui-theme
npm run test:shared-ui-primitives
npm run test:shared-ui-forms
npm run test:shared-ui-list
npm run test:shared-ui-layout
npm run test:shared-ui-feedback
```

Compiled packages are written to `dist/<package-name>/`.

## Local Package Testing

Build the package first:

```bash
npm run build:shared-ui-forms
```

Link it from the generated `dist` directory:

```bash
cd dist/shared-ui-forms
npm link
```

In the consuming Angular project:

```bash
npm link @sebkuw/shared-ui-forms
```

For more stable local verification, prefer `npm pack` and install the generated `.tgz` file in the consuming application.

```bash
npm pack ./dist/shared-ui-forms
```

## Publishing

The root workspace package is private and must not be published. The [GitHub Packages workflow](.github/workflows/publish.yml) runs when a GitHub Release is published. It uses the repository-scoped `GITHUB_TOKEN`, runs the complete test and build suites, and publishes all seven generated packages in dependency order.

Before creating a release:

1. Update each package version under `projects/<package-name>/package.json`.
2. When the core version changes, update its version in the peer dependencies of primitives, forms, list, layout and feedback.
3. Update the package and repository changelogs.
4. Run `npm run build` and then `npm test` locally so public-package import tests use fresh `dist` artifacts.
5. Push the commit, create a matching GitHub tag/release, and publish the release.

The packages are prepared in lockstep at version `0.2.1`. Published npm versions are immutable, so every later release must use a new version and matching tag.

## Versioning

Each publishable package has its own `package.json` under `projects/<package-name>/`.

Keep package versions aligned while the public API is still evolving. Once the library stabilizes, packages can either stay in lockstep or move to independent versioning.

Before publishing:

1. Update package versions.
2. Run `npm run build`.
3. Verify generated package manifests in `dist/`.
4. Publish from `dist/<package-name>/`.

## Troubleshooting

### Angular Material styles are missing

Make sure the consuming application includes an Angular Material theme and has compatible `@angular/material` and `@angular/cdk` versions installed.

### Dialog or snack-bar injection fails

Make sure Angular Material dialog and snack-bar are configured in the consuming application. The exact setup depends on whether the app uses standalone bootstrap or NgModules.

### Peer dependency warnings

Keep Angular package versions aligned between the consuming application and these libraries. For Angular 20 applications, use compatible versions of:

```json
{
  "@angular/core": "^20.3.0",
  "@angular/common": "^20.3.0",
  "@angular/forms": "^20.3.0",
  "@angular/material": "^20.2.14",
  "@angular/cdk": "^20.2.14"
}
```

### Registry authentication fails

Check that `.npmrc` maps `@sebkuw` to `https://npm.pkg.github.com`, that `GITHUB_PACKAGES_TOKEN` is available to npm, and that the Personal Access Token (classic) has `read:packages`. For private packages, the user or consuming repository must also have package access.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

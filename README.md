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
  - [1. Core - `@netdevs/shared-ui-core`](#1-core---netdevsshared-ui-core)
  - [2. Theme - `@netdevs/shared-ui-theme`](#2-theme---netdevsshared-ui-theme)
  - [3. Forms - `@netdevs/shared-ui-forms`](#3-forms---netdevsshared-ui-forms)
  - [4. List - `@netdevs/shared-ui-list`](#4-list---netdevsshared-ui-list)
  - [5. Layout - `@netdevs/shared-ui-layout`](#5-layout---netdevsshared-ui-layout)
  - [6. Feedback - `@netdevs/shared-ui-feedback`](#6-feedback---netdevsshared-ui-feedback)
- [Development](#development)
- [Local Package Testing](#local-package-testing)
- [Publishing](#publishing)
- [Versioning](#versioning)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Packages

| Package | Responsibility |
| --- | --- |
| `@netdevs/shared-ui-core` | Shared foundation for cross-package contracts and helpers. |
| `@netdevs/shared-ui-theme` | Theme hook and future home for design tokens, CSS variables and shared style assets. |
| `@netdevs/shared-ui-forms` | Dynamic details view, create/edit form view, form field controls and form models. |
| `@netdevs/shared-ui-list` | Dynamic table/list view with filtering, sorting, selection, pagination and CSV export support. |
| `@netdevs/shared-ui-layout` | Application layout components: page header and side menu. |
| `@netdevs/shared-ui-feedback` | User feedback components: info dialog and notification. |

## Requirements

| Tool | Version |
| --- | --- |
| Angular | `20.x` |
| Angular CLI | `20.x` |
| TypeScript | `~5.9` |
| Node.js | Use a Node.js version supported by Angular 20. Node 20 LTS or newer is recommended. |
| npm | Use the npm version bundled with the selected Node.js runtime. |

The UI components use Angular Material and CDK. Consuming applications should configure an Angular Material theme and use compatible Angular 20 dependencies.

## Installation

Configure the private npm registry in the consuming application:

```ini
@netdevs:registry=https://gitlab.nik.gov.pl/api/v4/projects/9/packages/npm/
//gitlab.nik.gov.pl/api/v4/projects/9/packages/npm/:_authToken=${NPM_TOKEN}
```

Install only the packages needed by the application:

```bash
npm install @netdevs/shared-ui-forms
npm install @netdevs/shared-ui-list
npm install @netdevs/shared-ui-layout
npm install @netdevs/shared-ui-feedback
```

For applications using the full component set:

```bash
npm install \
  @netdevs/shared-ui-core \
  @netdevs/shared-ui-theme \
  @netdevs/shared-ui-forms \
  @netdevs/shared-ui-list \
  @netdevs/shared-ui-layout \
  @netdevs/shared-ui-feedback
```

Angular Material and CDK are peer dependencies for UI packages that render Material components:

```bash
npm install @angular/material @angular/cdk
```

## Package Guide

### 1. Core - `@netdevs/shared-ui-core`

Core is intentionally small. It is reserved for contracts, helpers and constants that are truly shared by multiple UI packages.

Current exports:

| Export | Description |
| --- | --- |
| `NETDEVS_SHARED_UI_VERSION` | Current shared UI package version constant. |

Install:

```bash
npm install @netdevs/shared-ui-core
```

Use:

```ts
import { NETDEVS_SHARED_UI_VERSION } from '@netdevs/shared-ui-core';

console.info(`NetDevs Shared UI: ${NETDEVS_SHARED_UI_VERSION}`);
```

When to put code here:

- Shared public types used by more than one package.
- Framework-neutral helpers used by more than one package.
- Shared injection tokens that are not owned by a specific feature package.

Avoid putting feature components here. Forms, lists, layout and feedback should stay in their dedicated packages.

### 2. Theme - `@netdevs/shared-ui-theme`

Theme is the styling foundation package. It currently exposes a stable class hook and is the intended place for future design tokens, CSS variables, SCSS entry points and shared Material theme setup.

Current exports:

| Export | Description |
| --- | --- |
| `NETDEVS_SHARED_UI_THEME_CLASS` | Shared root CSS class name: `netdevs-shared-ui-theme`. |

Install:

```bash
npm install @netdevs/shared-ui-theme
```

Use:

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NETDEVS_SHARED_UI_THEME_CLASS } from '@netdevs/shared-ui-theme';

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

The consuming application is still responsible for including an Angular Material theme. This package will become the shared home for NetDevs-specific theme assets.

### 3. Forms - `@netdevs/shared-ui-forms`

Forms contains schema-driven UI for common create, edit and details screens.

Main exports:

| Export | Description |
| --- | --- |
| `DynamicFormComponent` | Renders create/edit forms from `DynamicFormConfig`. |
| `DynamicDetailsComponent` | Renders a details view from `DetailsConfig`. |
| `DynamicFormConfig`, `FormField` and related field interfaces | Form configuration contracts. |
| `DetailsConfig`, `DetailField` | Details view configuration contracts. |
| `FormInputTextComponent`, `FormInputNumberComponent`, `FormSelectComponent`, etc. | Reusable form field controls. |
| `CastPipe` | Template helper used by the dynamic form controls. |

Install:

```bash
npm install @netdevs/shared-ui-forms
```

Use `DynamicFormComponent`:

```ts
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  DynamicFormComponent,
  type DynamicFormConfig,
} from '@netdevs/shared-ui-forms';

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
import {
  DynamicDetailsComponent,
  type DetailsConfig,
} from '@netdevs/shared-ui-forms';

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
        render: (value) => value ? 'Active' : 'Inactive',
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

### 4. List - `@netdevs/shared-ui-list`

List contains the dynamic table component and models used to build server-driven list views.

Main exports:

| Export | Description |
| --- | --- |
| `DynamicTableComponent` | Server-side table with filtering, sorting, pagination, selection and column visibility. |
| `BaseRow`, `Column`, `CustomButton` | Table row and column contracts. |
| `TableDataRequestEvent`, `TableFilter`, `TableSort` | Events and state emitted by the table. |
| `toPaginationRequestDto` | Helper that maps table request state to a .NET-style pagination DTO. |
| `TableExportService` | CSV export helper used by the table export workflow. |
| `ValueFormatterPipe` | Formats displayed table cell values. |

Install:

```bash
npm install @netdevs/shared-ui-list
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
} from '@netdevs/shared-ui-list';

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

### 5. Layout - `@netdevs/shared-ui-layout`

Layout contains components used to compose the application shell and page-level navigation.

Main exports:

| Export | Description |
| --- | --- |
| `PageHeaderComponent` | Consistent page title with optional info action. |
| `SideMenu` | Collapsible side menu component. |
| `MenuItem` | Side menu item contract. |
| `SideMenuService` | Menu state service. |
| `MENU_DATA_TOKEN` | Injection token used to provide menu configuration. |
| `InfoClickData` | Event payload emitted by `PageHeaderComponent`. |

Install:

```bash
npm install @netdevs/shared-ui-layout
```

Use `PageHeaderComponent`:

```ts
import { Component } from '@angular/core';
import {
  PageHeaderComponent,
  type InfoClickData,
} from '@netdevs/shared-ui-layout';

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
import {
  MENU_DATA_TOKEN,
  SideMenu,
  type MenuItem,
} from '@netdevs/shared-ui-layout';

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
  template: `
    <shared-side-menu [collapsed]="collapsed" />
  `,
})
export class AppShellComponent {
  collapsed = false;
}
```

`SideMenu` uses Angular Router links, so it should be used inside an application that has routing configured.

### 6. Feedback - `@netdevs/shared-ui-feedback`

Feedback contains components for user-facing messages and informational overlays.

Main exports:

| Export | Description |
| --- | --- |
| `InfoDialogComponent` | Angular Material dialog content component for informational dialogs. |
| `InfoDialogData` | Dialog data contract. |
| `NotificationComponent` | Angular Material snack-bar component. |
| `NotificationData` | Snack-bar data contract. |

Install:

```bash
npm install @netdevs/shared-ui-feedback
```

Use `InfoDialogComponent`:

```ts
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '@netdevs/shared-ui-feedback';

@Component({
  selector: 'app-info-example',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <button mat-raised-button type="button" (click)="openInfo()">
      Open info
    </button>
  `,
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

Use `NotificationComponent`:

```ts
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '@netdevs/shared-ui-feedback';

@Component({
  selector: 'app-notification-example',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <button mat-raised-button type="button" (click)="showSuccess()">
      Save
    </button>
  `,
})
export class NotificationExampleComponent {
  private readonly snackBar = inject(MatSnackBar);

  showSuccess(): void {
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: 4000,
      data: {
        message: 'Saved successfully.',
        type: 'success',
      },
    });
  }
}
```

The consuming application must configure Angular Material dialog and snack-bar providers according to its app setup.

## Development

Install dependencies:

```bash
npm install
```

Build every package:

```bash
npm run build
```

Run every package test suite in Chrome Headless:

```bash
npm test
```

Build a single package:

```bash
npm run build:shared-ui-core
npm run build:shared-ui-theme
npm run build:shared-ui-forms
npm run build:shared-ui-list
npm run build:shared-ui-layout
npm run build:shared-ui-feedback
```

Run tests for a single package:

```bash
npm run test:shared-ui-core
npm run test:shared-ui-theme
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
npm link @netdevs/shared-ui-forms
```

For more stable local verification, prefer `npm pack` and install the generated `.tgz` file in the consuming application.

```bash
npm pack ./dist/shared-ui-forms
```

## Publishing

The root workspace package is private and should not be published. Publish packages from their generated `dist` directories.

```bash
npm run build

npm publish ./dist/shared-ui-core
npm publish ./dist/shared-ui-theme
npm publish ./dist/shared-ui-forms
npm publish ./dist/shared-ui-list
npm publish ./dist/shared-ui-layout
npm publish ./dist/shared-ui-feedback
```

Recommended CI flow:

```yaml
image: node:20

stages:
  - build
  - publish

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

publish:
  stage: publish
  dependencies:
    - build
  script:
    - echo "@netdevs:registry=https://gitlab.nik.gov.pl/api/v4/projects/9/packages/npm/" > .npmrc
    - echo "//gitlab.nik.gov.pl/api/v4/projects/9/packages/npm/:_authToken=${NPM_TOKEN}" >> .npmrc
    - npm publish ./dist/shared-ui-core
    - npm publish ./dist/shared-ui-theme
    - npm publish ./dist/shared-ui-forms
    - npm publish ./dist/shared-ui-list
    - npm publish ./dist/shared-ui-layout
    - npm publish ./dist/shared-ui-feedback
  rules:
    - if: $CI_COMMIT_TAG
```

Configure `NPM_TOKEN` in GitLab CI/CD with permission to publish to the package registry.

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

Check that `.npmrc` points to the correct GitLab package registry and that `NPM_TOKEN` has read or publish permissions for the target project.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

# Angular Shared Components

A modular Angular 20 UI library for building forms, data tables, navigation and feedback flows. Seven `@sebkuw/shared-ui-*` packages share typed configuration, reactive permissions and semantic design tokens while keeping application data and business logic in the consuming application.

The repository includes an **interactive demo where you can try all the main UI components**, with working examples, keyboard interactions and permission changes.

[Run the demo](#interactive-demo) · [Packages](#packages) · [Development](#development) · [Changelog](CHANGELOG.md) · [MIT license](LICENSE)

## Highlights

- **Configurable forms:** schema-driven create/edit forms, details views, validation summaries, completion guidance, asynchronous searchable selects and `FormArray` card repeaters.
- **Data tables:** filtering, sorting, pagination, selection, column visibility, loading/empty/error states and CSV export.
- **Navigation and workflows:** page headers, side navigation, skip links and a responsive linear stepper.
- **Feedback and primitives:** information and confirmation dialogs, asynchronous form modals, notifications, buttons, links, icons, popovers and status indicators.
- **Shared foundations:** provider-independent permissions/claims, standalone components with `OnPush`, Angular signals, strict TypeScript and public package entry points.
- **Adaptable presentation:** configurable labels, light/dark tokens, logical CSS for RTL, visible focus, reduced-motion and forced-colors styles.

## Interactive demo

The [component gallery](projects/demo/README.md) is both a playground and the integration host for the libraries. It uses local sample data and simulated asynchronous operations; no backend or GitHub Packages token is needed to run it from source.

From the repository root:

```bash
npm ci
npm start
```

Open [http://127.0.0.1:4200/](http://127.0.0.1:4200/) once compilation completes. `npm run dev` and `npm run start:demo` are equivalent commands. Library edits reload automatically through the public source entry points, without a separate library build.

| Gallery example                      | What you can try                                                                                                       |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Reactive access context              | Toggle admin permissions and watch protected fields, columns and navigation update.                                    |
| Public UI primitives                 | Activate buttons and links, open a popover, dismiss alerts and inspect icons, badges, loading, progress and skeletons. |
| All form field types                 | Enter values, use select/file/table controls, submit invalid data and follow linked validation errors.                 |
| Responsive stepper and form repeater | Validate a linear workflow, skip an optional step and add or remove grouped contact cards.                             |
| Form modal                           | Validate a supplier assignment, observe simulated saving and close the dialog with focus restoration.                  |
| Details with edit mode               | Edit, save, cancel, confirm removal and restore an empty details view.                                                 |
| Filterable data table                | Filter and sort sample rows, select records, change pagination/columns and trigger an error/retry state.               |
| Dialogs and notifications            | Open the page-header information dialog and trigger a live-region notification.                                        |

The preview address above is local. See the [demo README](projects/demo/README.md) for its implementation and test instructions.

## Packages

Each package has its own public API, README and changelog. Install the features you need together with their declared peer dependencies.

| Package                        | Responsibility                                                                                                         | Documentation                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `@sebkuw/shared-ui-core`       | Reactive access context, permissions/claims rules, evaluators, providers and a structural visibility directive.        | [README](projects/shared-ui-core/README.md) · [Changelog](projects/shared-ui-core/CHANGELOG.md)             |
| `@sebkuw/shared-ui-theme`      | Semantic color, spacing, radius and motion tokens; light/dark, focus and platform adaptations.                         | [README](projects/shared-ui-theme/README.md) · [Changelog](projects/shared-ui-theme/CHANGELOG.md)           |
| `@sebkuw/shared-ui-primitives` | Buttons, links, icons, action bars, labels, loading, alerts, skeletons, badges, progress and popovers.                 | [README](projects/shared-ui-primitives/README.md) · [Changelog](projects/shared-ui-primitives/CHANGELOG.md) |
| `@sebkuw/shared-ui-forms`      | Dynamic forms/details, individual controls, searchable selects, field shells, error/completion guidance and repeaters. | [README](projects/shared-ui-forms/README.md) · [Changelog](projects/shared-ui-forms/CHANGELOG.md)           |
| `@sebkuw/shared-ui-list`       | Signal-backed table, filters, sorting, selection, pagination, column visibility, formatting and CSV export.            | [README](projects/shared-ui-list/README.md) · [Changelog](projects/shared-ui-list/CHANGELOG.md)             |
| `@sebkuw/shared-ui-layout`     | Page header, side navigation, skip link and projected responsive stepper.                                              | [README](projects/shared-ui-layout/README.md) · [Changelog](projects/shared-ui-layout/CHANGELOG.md)         |
| `@sebkuw/shared-ui-feedback`   | Information/confirmation dialogs, form modals, notifications and empty/error states.                                   | [README](projects/shared-ui-feedback/README.md) · [Changelog](projects/shared-ui-feedback/CHANGELOG.md)     |

The source manifests are aligned at `0.4.0`; release notes are maintained in the [repository changelog](CHANGELOG.md) and the package changelogs above.

## Requirements

| Tool                   | Workspace requirement                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Angular / CLI          | `20.3.x`; published Angular peers start at `^20.3.0`.                                                                      |
| Angular Material / CDK | Compatible `20.2.x` versions for packages that use them; primitives use CDK without Material.                              |
| TypeScript             | `~5.9.2`, with strict compiler and template checks enabled.                                                                |
| Node.js                | `^20.19.0`, `^22.12.0` or `^24.0.0`, as listed in [Angular's compatibility table](https://angular.dev/reference/versions). |
| npm                    | Use npm with the committed `package-lock.json` and `npm ci` for a reproducible checkout.                                   |
| Google Chrome          | Required by the current Karma launcher and Playwright `channel: 'chrome'` configuration.                                   |

Consuming applications supply their Angular Material theme, translations, routing, data loading and backend authorization. The demo shows the provider and stylesheet setup in [main.ts](projects/demo/src/main.ts) and [angular.json](angular.json).

## Installation

To explore the project, use the [source demo](#interactive-demo). To consume released packages in another Angular application, configure GitHub Packages first.

GitHub's npm registry requires authentication even for public packages. Use a Personal Access Token (classic) with `read:packages` and the appropriate package access, following the [GitHub authentication guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

Expose the token through `GITHUB_PACKAGES_TOKEN` and add this configuration to the consuming application's `.npmrc`, keeping the token value outside version control:

```ini
@sebkuw:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

For example, install dynamic forms and their shared peers:

```bash
npm install @sebkuw/shared-ui-forms @sebkuw/shared-ui-core @sebkuw/shared-ui-primitives @sebkuw/shared-ui-theme
npm install @angular/material@^20.2.14 @angular/cdk@^20.2.14
```

See each package README for its installation command and `package.json` for the complete peer dependency contract. Import supported symbols from `@sebkuw/shared-ui-*`; implementation-level deep imports are not supported.

### A minimal form

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicFormComponent, type DynamicFormConfig } from '@sebkuw/shared-ui-forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [DynamicFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<shared-dynamic-form [config]="config" (formSubmit)="save($event)" />`,
})
export class ContactFormComponent {
  readonly config: DynamicFormConfig = {
    ariaLabel: 'Contact form',
    columns: 1,
    submitButton: { labelCreate: 'Create contact', labelEdit: 'Save contact' },
    fields: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        validators: [Validators.required],
        errorMessages: { required: 'Enter a name.' },
      },
      { key: 'email', label: 'Email', type: 'email', validators: [Validators.email] },
    ],
  };

  save(value: Record<string, unknown>): void {
    // Persist the submitted value in the consuming application.
  }
}
```

### Theme setup

Add an Angular Material theme and the shared tokens to the consuming application's global styles. For example, the `styles` array in `angular.json` can contain:

```json
[
  "node_modules/@angular/material/prebuilt-themes/azure-blue.css",
  "node_modules/@sebkuw/shared-ui-theme/styles/tokens.css",
  "src/styles.css"
]
```

Apply `class="netdevs-shared-ui-theme"` to the application shell. Add `data-theme="dark"` to that same element for the dark token palette; Angular Material's theme is configured separately. Override `--shared-ui-*` custom properties at the shell boundary to adapt the palette and spacing. The `NETDEVS_*` constants and `netdevs-shared-ui-theme` class remain part of the existing public API.

## Package guide

### 1. Core - `@sebkuw/shared-ui-core`

Use `providePermissionContext()` with an application-owned `Signal<PermissionContext>`. `PermissionService`, `evaluateAccess()` and `CanAccessDirective` share the same rule evaluation. See the [core guide](projects/shared-ui-core/README.md).

### 2. Theme - `@sebkuw/shared-ui-theme`

Use the published stylesheet and typed token names for consumer overrides. See the [theme guide](projects/shared-ui-theme/README.md).

### 3. Forms - `@sebkuw/shared-ui-forms`

Configure `DynamicFormComponent` and `DynamicDetailsComponent` through typed field models. Use standalone controls or projected `FormArray` rows for custom flows. See the [forms guide](projects/shared-ui-forms/README.md).

### 4. List - `@sebkuw/shared-ui-list`

`DynamicTableComponent` receives **signals** for `data`, `totalItems`, `pageSize`, `pageIndex` and `loading`: bind the signal itself, for example `[data]="rows"`. Handle `dataRequest` to supply updated data. Rows expose an `Id` for selection. CSV export supports supplied rows or an explicitly configured backend endpoint; `provideHttpClient()` is required by the injected export service. See the [list guide](projects/shared-ui-list/README.md).

### 5. Layout - `@sebkuw/shared-ui-layout`

Provide menu configuration through `MENU_DATA_TOKEN` and configure Angular Router for destination links. Project application content and form controls into `StepperStepComponent` for validated workflows. See the [layout guide](projects/shared-ui-layout/README.md).

### 6. Feedback - `@sebkuw/shared-ui-feedback`

Use `ConfirmationDialogService`, `FormModalService` and `NotificationService` for consistent overlays and messages. Application code owns persistence and notification transport. See the [feedback guide](projects/shared-ui-feedback/README.md).

### 7. Primitives - `@sebkuw/shared-ui-primitives`

Use native button/link semantics, configurable accessible labels and consumer-owned image or projected icons. Configure registered icons through `provideSharedIcons()`. See the [primitives guide](projects/shared-ui-primitives/README.md).

## Permissions and claims

Restricted rules deny access while the context is missing, loading, in error or unauthenticated. An unconstrained resource is public only through an explicit public rule; components that default to public use `PUBLIC_ACCESS_RULE`.

Rules combine permission `any`, `all` and `none` checks with typed claims. Denied `none` checks take precedence; `any: []` and `claims: []` deny, while `all: []` and `none: []` are neutral once the restricted context is ready and authenticated. Claim values use typed equality. Updates to the supplied context signal propagate to permission-aware UI.

Depending on the component, denied content can be removed, hidden or disabled. **Frontend visibility is a UX layer; the backend must enforce authorization.** See the [core documentation](projects/shared-ui-core/README.md) and [rule models](projects/shared-ui-core/src/lib/access/access-control.models.ts) for the contract.

## Accessibility, responsiveness and SSR

The libraries use semantic controls, configurable accessible names, keyboard interactions and focus management. Shared styles include visible focus, reduced-motion and forced-colors adaptations. Labels and messages can be supplied by the consuming application, and logical layout properties support RTL.

The gallery has explicit Playwright checks for accessible names, ARIA states, live regions, keyboard/focus behavior, RTL and 320 CSS px reflow. These checks support the project's WCAG 2.2 AA target; they are not a complete accessibility conformance audit.

Browser-only download, storage and focus work is guarded where implemented, with targeted server-platform unit tests. The current demo is a client-rendered application; the repository does not include an end-to-end SSR/hydration suite. Overlay opening belongs in browser-side interactions.

## Development

Run these commands from the repository root:

| Command                | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| `npm ci`               | Install locked workspace dependencies.                                |
| `npm start`            | Start the live component gallery.                                     |
| `npm run build`        | Build all seven libraries in dependency order, then the demo.         |
| `npm run build:libs`   | Build only the libraries.                                             |
| `npm run build:demo`   | Build the demo into `dist/demo/browser/`.                             |
| `npm test`             | Run all seven Karma/Jasmine library suites in Chrome Headless.        |
| `npm run test:e2e`     | Run gallery interaction, access, accessibility and responsive checks. |
| `npm run test:visual`  | Compare the gallery and form modal with committed visual baselines.   |
| `npm run format:check` | Check formatting with Prettier.                                       |

**Build before running library tests on a fresh checkout:** the public package import tests resolve through `dist/`. The source demo itself does not require this build.

```bash
npm ci
npm run build
npm test
npm run test:e2e
npm run test:visual
```

Playwright starts the demo automatically or reuses a local server. Both configured projects use installed Google Chrome: one desktop viewport and one 320 × 800 viewport. They do not currently run Firefox, WebKit or real-device tests. Committed screenshot baselines are platform-specific; review intentional changes before using `npm run test:visual:update`.

For one package, use `npm run build:shared-ui-forms` or `npm run test:shared-ui-forms`, replacing the suffix with the package name. Build its internal peers first when needed. Generated libraries are written to `dist/shared-ui-*/`.

### Local package testing

To check packaged output in another Angular application, build the libraries and create a tarball:

```bash
npm run build:libs
npm pack ./dist/shared-ui-forms
```

Install the generated `.tgz` file in the consuming application along with compatible shared peer packages. This exercises the packaged public API rather than source mappings.

## Publishing and versioning

The root workspace has `private: true` because it is a development workspace; published libraries have separate manifests under `projects/shared-ui-*/`. Repository visibility and package visibility are managed separately on GitHub.

The [GitHub Packages workflow](.github/workflows/publish.yml) runs on a published GitHub Release or manual dispatch. It installs dependencies, builds the workspace, runs library tests and publishes the seven generated packages in dependency order with the repository `GITHUB_TOKEN`. Already published package versions are skipped. E2E and visual checks are separate local commands.

For a release:

1. Update package versions, internal peer ranges and `NETDEVS_SHARED_UI_VERSION` together while releases remain in lockstep.
2. Update the relevant package changelogs and the [repository changelog](CHANGELOG.md), including migrations for breaking changes.
3. Run build, library tests and the applicable demo checks; inspect generated manifests.
4. Commit the release changes and publish a matching GitHub tag/release.

The former `@netdevs/shared-ui-*` coordinates are not aliases. Existing consumers must update dependency names, imports and the theme stylesheet path to `@sebkuw/shared-ui-*`; the retained `NETDEVS_*` symbols and theme class do not change.

## Contributing

Keep APIs typed, reusable and independent of application endpoints or identity providers. Preserve Angular 20 compatibility, strict checking, keyboard behavior and shared access semantics. Update examples and the appropriate changelog with each change.

See the [repository instructions](AGENTS.md), library-specific instructions and the [monorepo development guide](.agents/skills/develop-angular-shared-components/SKILL.md) for the required checks. Report bugs through [GitHub Issues](https://github.com/sebkuw/angular-shared-components/issues).

## Troubleshooting

- **Missing Material styles:** include a Material theme before the shared tokens and keep Angular/Material/CDK peer versions compatible.
- **Missing `dist` imports in tests:** run `npm run build:libs` before `npm test`.
- **Table injection error:** provide Angular's `HttpClient` with `provideHttpClient()`; the export service needs it even when using local rows.
- **Chrome cannot launch:** install Google Chrome or configure the appropriate executable for Karma; Playwright currently selects the `chrome` channel.
- **Registry access denied:** check the scope mapping, `GITHUB_PACKAGES_TOKEN`, `read:packages` scope and package permissions using the [registry guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## License

Copyright © 2026 Sebastian Wnorowski. Released under the [MIT License](LICENSE).

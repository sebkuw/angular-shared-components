# Angular Shared Components demo

An interactive Angular 20 gallery where you can try all the main UI components from the seven `@sebkuw/shared-ui-*` packages. It also serves as the libraries' integration and Playwright test host.

[Repository overview](../../README.md) · [Package documentation](../../README.md#packages) · [Demo changelog](CHANGELOG.md)

## Run the gallery

From the repository root, install the locked dependencies and start the preview:

```bash
npm ci
npm start
```

Open [http://127.0.0.1:4200/](http://127.0.0.1:4200/) after Angular reports that compilation is complete. `npm run dev` and `npm run start:demo` are equivalent aliases. The demo resolves every package through its public source entry point, so a separate library build is not required and library edits trigger a live reload.

The gallery uses local sample data and simulated asynchronous operations. Running it from source requires no backend, sign-in or GitHub Packages token. See the [workspace requirements](../../README.md#requirements) for the supported tool versions.

## What you can test

| Area                      | Interactive examples                                                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Permissions and claims    | Toggle admin access and observe protected form fields, details, table columns and navigation.                                                       |
| Buttons, links and icons  | Text/image/icon-only actions, registered icons, semantic navigation links, action bars and a keyboard skip link.                                    |
| Status and feedback       | Loading, skeletons, badges, progress, all inline-alert tones and action/dismiss controls.                                                           |
| Popover                   | Open projected content, dismiss with Escape or an outside click and check restored trigger focus.                                                   |
| Dynamic form              | All supported schema-driven field types, validation, required-field completion and linked error guidance.                                           |
| Stepper and repeater      | Linear validation, optional steps, responsive orientation and add/remove grouped contact cards.                                                     |
| Form modal                | Supplier assignment with validation, simulated saving, keyboard closing and focus restoration.                                                      |
| Details                   | Formatted values, a spacer, editing, cancellation, destructive confirmation and an empty-state restore action.                                      |
| Table                     | Text, asynchronous select, boolean, numeric-range and date-range filters; sorting, selection, pagination, column visibility and error/retry states. |
| Dialogs and notifications | Page-header information dialog, confirmation workflow and configurable live-region notifications.                                                   |

The demo does not expose a separate screen for every helper or every configuration combination. Its examples exercise the main public components; unit and public API tests cover additional library contracts.

The gallery loads Angular Material's free `azure-blue` theme together with the shared semantic tokens. It includes every supported dynamic form field, an editable details example with a spacer, and a table whose text, asynchronous searchable select, boolean, numeric-range and date-range filters operate on local demo data. The editable table also demonstrates left-aligned add-row placement.

## Automated checks

Install Google Chrome for the current Playwright `channel: 'chrome'` configuration, then run from the repository root:

```bash
npm run test:e2e
npm run test:visual
```

Playwright starts the gallery automatically and runs Chrome at desktop and 320 × 800 viewports. The suite checks interactions, permissions, accessible names, ARIA/live regions, keyboard focus, RTL and responsive layout. It does not currently run Firefox/WebKit, a complete automated accessibility audit or an end-to-end SSR/hydration suite.

Visual baselines cover the gallery and form modal and are platform-specific. Update them with `npm run test:visual:update` only after reviewing intentional UI changes. The test definition and browser setup live in [the gallery specification](../../e2e/component-gallery.spec.ts) and [playwright.config.ts](../../playwright.config.ts).

For a production build, run `npm run build:demo`; the static output is written to `dist/demo/browser/`.

The self-hosted Material Icons development dependency avoids external network requests during tests. Frontend visibility is a UX layer; the example does not imply that backend authorization can be omitted.

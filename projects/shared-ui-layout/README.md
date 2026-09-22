# @sebkuw/shared-ui-layout

Responsive page structure and navigation components for NetDevs Angular applications.

## Installation

Configure GitHub Packages as described in the [repository installation guide](../../README.md#installation), then install the package and its shared peers:

```bash
npm install @sebkuw/shared-ui-layout @sebkuw/shared-ui-core @sebkuw/shared-ui-primitives
```

## Current public API

The package exports PageHeaderComponent, SkipLinkComponent, SideMenu, MenuItem, SideMenuService, MENU_DATA_TOKEN, StepperComponent, StepperStepComponent and related data types. The authoritative export list is src/public-api.ts.

`MenuItem.access` filters entire navigation branches reactively. `MenuItem.badge` adds a typed value, tone, maximum, accessible label and announcement mode using the public badge primitive; provide a matching `MenuItem.ariaLabel` when the count should be part of the navigation item's accessible name. `PageHeaderComponent.infoAccess` controls the optional information action, which uses the public icon-button primitive. The side menu renders a named `nav` landmark; destinations are links and expandable groups remain native buttons with `aria-expanded`, so the full navigation-row interaction works without a pointer.

Place the skip link before the application shell and give the main landmark a matching stable id:

```html
<shared-skip-link targetId="main-content" label="Skip to main content" />
<main id="main-content">...</main>
```

The native fragment remains useful without JavaScript. In the browser, activation also makes a non-focusable target programmatically focusable and moves keyboard focus to it. DOM access is guarded for SSR.

### Responsive stepper

`StepperComponent` wraps Angular Material stepper behavior while keeping each step's application-owned content projected through `StepperStepComponent`. It supports horizontal and vertical orientation, switches to vertical below a configurable media query, and exposes linear validation, optional steps, explicit completion, editable steps and configurable navigation labels.

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperComponent, StepperStepComponent } from '@sebkuw/shared-ui-layout';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, StepperComponent, StepperStepComponent],
  template: `
    <shared-stepper
      ariaLabel="Create order"
      [linear]="true"
      orientation="horizontal"
      responsiveBreakpoint="(max-width: 48rem)"
      backLabel="Back"
      nextLabel="Next"
      skipLabel="Skip"
      finishLabel="Create"
      (finished)="createOrder()"
    >
      <shared-stepper-step label="Customer" [stepControl]="customerForm">
        <form [formGroup]="customerForm">
          <label for="customer-name">Customer name</label>
          <input id="customer-name" formControlName="name" />
        </form>
      </shared-stepper-step>
      <shared-stepper-step label="Notes" [optional]="true">
        <p>Optional projected content</p>
      </shared-stepper-step>
      <shared-stepper-step label="Review" [completed]="true">
        <p>Review the order.</p>
      </shared-stepper-step>
    </shared-stepper>
  `,
})
export class OrderWizardComponent {
  readonly customerForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  createOrder(): void {}
}
```

In linear mode, an invalid `stepControl` is marked touched and the first invalid enabled control receives focus when Next or Finish is attempted. `completed="true"` is an explicit override for application-controlled steps; a step without a control remains incomplete in linear mode until that input is true. Optional steps expose Skip and do not block progress. Material step headers retain their Arrow, Home and End keyboard behavior, while all navigation actions are native buttons through the shared button primitive.

All labels are configurable for localization. Logical CSS properties support RTL, long labels wrap, responsive behavior begins at 320 CSS px, and browser-only focus work is guarded for SSR/hydration. Consumers must load an Angular Material theme and the shared theme tokens.

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

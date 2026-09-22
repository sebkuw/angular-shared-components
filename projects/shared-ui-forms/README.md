# @sebkuw/shared-ui-forms

Configurable dynamic details, forms and form controls for NetDevs Angular applications.

## Installation

Configure GitHub Packages as described in the [repository installation guide](../../README.md#installation), then install the package and its shared peers:

```bash
npm install @sebkuw/shared-ui-forms @sebkuw/shared-ui-core @sebkuw/shared-ui-primitives
```

## Current public API

The package exports DynamicFormComponent, DynamicDetailsComponent, the form control components (including `AsyncSearchSelectComponent`), FormArrayRepeaterComponent, FormArrayRepeaterRowDirective, FormRepeaterGroupComponent, typed field/detail configuration models, FormFieldBaseComponent, FormFieldShellComponent, FormErrorSummaryComponent, FormCompletionIndicatorComponent and CastPipe. `DynamicFormConfig.fields` uses the exported `DynamicFormField` discriminated union, so options such as number bounds, select options, file types, table columns and spacer content are checked against the selected field type. The authoritative export list is src/public-api.ts.

`DynamicFormComponent`, individual fields, details fields and edit/remove actions accept shared `AccessRule` values. Form fields default to removal when denied and can set `inaccessibleBehavior: 'disable'`. Legacy `requiredPermissions` remains supported, but new code should use `access` with the reactive context from `@sebkuw/shared-ui-core`.

Labels, autocomplete tokens, accessible names, file actions and table row actions are typed configuration. Forms expose an accessible form name and collapse to one column on narrow viewports.

`DynamicFormConfig.guidance` can show completion of visible, enabled required fields and a linked error summary after an invalid submit attempt:

```ts
import { Validators } from '@angular/forms';
import { type DynamicFormConfig } from '@sebkuw/shared-ui-forms';

const config: DynamicFormConfig = {
  ariaLabel: 'Customer form',
  guidance: {
    showCompletion: true,
    showErrorSummary: true,
    completionLabel: 'Required fields completed',
    errorSummaryTitle: 'Complete the form',
  },
  fields: [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      hint: 'Use the legal name.',
      requiredText: 'Required',
      validators: [Validators.required],
      errorMessages: { required: 'Name is required.' },
    },
  ],
};
```

The submit action stays operable while the form is invalid. Activation marks controls touched, renders the summary and focuses it; its native links then move focus to the selected invalid field. Localize all guidance strings through the configuration.

For custom controls outside `DynamicFormComponent`, `FormFieldShellComponent` exposes stable `hintId`, `errorId`, `characterCountId` and `describedBy` values:

```html
<shared-form-field-shell #shell controlId="reference" label="Reference" hint="12 characters">
  <input id="reference" [attr.aria-describedby]="shell.describedBy" />
</shared-form-field-shell>
```

`FormFieldShellComponent.labelId` is the stable id of the visible label. `DynamicFormComponent` uses it to associate select comboboxes through `aria-labelledby`, so their accessible name comes from `field.label`, not from the placeholder. A standalone `FormSelectComponent` still falls back to `field.ariaLabel` or `field.label`; custom shells can pass their visible label id through `ariaLabelledBy`.

Submit, details, file and editable-table row actions use the public button primitives from `@sebkuw/shared-ui-primitives`. Material remains responsible for the form controls themselves. Applications must include an Angular Material theme; the repository demo loads the free `azure-blue` prebuilt theme before the shared semantic tokens.

### Asynchronous searchable select

`AsyncSearchSelectComponent` is a standalone Angular Forms control for remote datasets. Its form value is the selected option key, `(selectionChange)` emits the selected `{ key, value }`, and `(queryChange)` emits debounced text so the consuming application can load options. The component performs no HTTP requests.

```html
<shared-async-search-select
  label="Customer"
  placeholder="Search customers"
  [formControl]="customerId"
  [options]="customerOptions()"
  [loading]="customersLoading()"
  [error]="customersError()"
  [debounceMs]="300"
  (queryChange)="loadCustomers($event)"
  (selectionChange)="customerSelection.set($event)"
/>
```

The combobox exposes loading, empty and error states and supports Arrow Up/Down, Home, End, Enter, Escape and Tab. Keep the selected item in `options` when options are refreshed so its display value remains available.

Editable table fields accept `addActionAlignment: 'start' | 'end'`. The default is `end`, preserving the existing layout; use `start` for wide tables where the add-row action should begin at the left edge.

### FormArray card repeater

`FormArrayRepeaterComponent` renders consumer-owned `FormGroup` rows as accessible cards. The row template receives the row as both `$implicit` and `row`, its current `index`, and a `controlId(name)` function that produces a stable, unique id for labels and controls. `minRows` defaults to `0`; `maxRows`, row-card titles, empty text, action labels and the one-to-three-column group layout are configurable.

```ts
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormArrayRepeaterComponent,
  FormArrayRepeaterRowDirective,
  FormRepeaterGroupComponent,
} from '@sebkuw/shared-ui-forms';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormArrayRepeaterComponent,
    FormArrayRepeaterRowDirective,
    FormRepeaterGroupComponent,
  ],
  template: `
    <shared-form-array-repeater
      ariaLabel="Delivery addresses"
      idPrefix="delivery-address"
      [formArray]="addresses"
      [rowFactory]="createAddress"
      [minRows]="0"
      [groupColumns]="2"
      cardTitle="Address"
      addLabel="Add address"
      removeLabel="Remove"
    >
      <ng-template sharedFormArrayRepeaterRow let-row let-controlId="controlId">
        <shared-form-repeater-group label="Recipient" [formGroup]="row">
          <label [for]="controlId('name')">Name</label>
          <input [id]="controlId('name')" formControlName="name" />
        </shared-form-repeater-group>
        <shared-form-repeater-group label="Location" [formGroup]="row">
          <label [for]="controlId('city')">City</label>
          <input [id]="controlId('city')" formControlName="city" />
        </shared-form-repeater-group>
      </ng-template>
    </shared-form-array-repeater>
  `,
})
export class AddressEditorComponent {
  readonly addresses = new FormArray<FormGroup>([]);
  readonly createAddress = (): FormGroup =>
    new FormGroup({
      name: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true }),
    });
}
```

Use one to three direct `FormRepeaterGroupComponent` children in the row template. Each group is a semantic `fieldset` with a visible `legend` and border. The grid collapses to one column at 40rem and below, including 320 CSS px and 400% reflow. Add focuses the first enabled row control; Remove restores focus to a neighboring card action or Add. The component never replaces the supplied `FormArray`, marks user add/remove operations dirty, preserves row identity, and guards DOM focus for SSR/hydration. Localize every label input and use logical layout styles for RTL.

## Architectural role

- Build framework-level form components without application-specific models, endpoints or identity providers.
- Integrate with typed Angular reactive forms and preserve value, touched, dirty, disabled and reset semantics.
- Configure labels, hints, validation, errors, readonly/disabled behavior and presentation through typed APIs.
- Apply the shared permissions/claims mechanism to field and action visibility without replacing backend authorization.
- Support SSR/hydration, internationalization, long translations and RTL.

## Accessibility and interaction

Every control must have a programmatically associated label, hint and error where applicable. Placeholder text is not a label. All behavior must work with a keyboard, retain visible and predictable focus, support touch and reflow from 320 CSS px, and meet WCAG 2.2 AA.

## Required tests

Cover each public field type and configuration variant with unit and host/integration tests. Also cover Angular Forms behavior, permissions/claims, accessible names and errors, keyboard/focus behavior, responsive layouts, public API imports and regressions. Maintain Playwright E2E and visual cases in the required demo application.

## Development

- [Library agent instructions](AGENTS.md)
- [Forms development skill](../../.agents/skills/develop-shared-ui-forms/SKILL.md)
- [Changelog](CHANGELOG.md)
- [Repository package guide](../../README.md#3-forms---sebkuwshared-ui-forms)

Verify changes with:

    npm run test:shared-ui-forms
    npm run build:shared-ui-forms

Update this README, src/public-api.ts when necessary, and the Unreleased section of CHANGELOG.md in the same change.

# @sebkuw/shared-ui-primitives

Small, reusable Angular 20 UI primitives for application and shared-library interfaces.

## Installation

Configure GitHub Packages as described in the [repository installation guide](../../README.md#installation), then install the package and its core peer:

```bash
npm install @sebkuw/shared-ui-primitives @sebkuw/shared-ui-core
```

Include `@sebkuw/shared-ui-theme/styles/tokens.css` and apply `netdevs-shared-ui-theme` to the application shell for the default theme. Every component also provides safe CSS fallbacks.

## Public API

| Export                                                                                                                                          | Purpose                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `ButtonComponent`                                                                                                                               | Text button or text + image/projected icon button.        |
| `IconButtonComponent`                                                                                                                           | Image/projected-icon button with an accessible label.     |
| `FieldLabelComponent`                                                                                                                           | Visible native field label with optional required marker. |
| `LoadingComponent`                                                                                                                              | Inline, block or overlay loading status.                  |
| `InlineAlertComponent`                                                                                                                          | Inline info, success, warning or error message.           |
| `ButtonTone`, `ButtonAppearance`, `ButtonSize`, `ButtonType`, `IconPosition`, `LoadingMode`, `LoadingSize`, `InlineAlertTone`, `LivePoliteness` | Typed configuration contracts.                            |

## Buttons

`ButtonComponent` covers both text-only and text + icon use cases, so a third button component is not needed. `IconButtonComponent` is reserved for actions whose visible content is only an image.

```html
<shared-button tone="positive" iconSrc="/icons/save.svg" (activated)="save()"> Save </shared-button>

<shared-button tone="negative" appearance="outlined" (activated)="remove()"> Remove </shared-button>

<shared-button (activated)="save()">
  <mat-icon sharedButtonIcon aria-hidden="true">save</mat-icon>
  Save with a projected icon
</shared-button>

<shared-icon-button
  iconSrc="/icons/refresh.svg"
  ariaLabel="Refresh results"
  (activated)="refresh()"
/>

<shared-icon-button ariaLabel="Refresh results" (activated)="refresh()">
  <mat-icon aria-hidden="true">refresh</mat-icon>
</shared-icon-button>
```

Use `iconSrc` for an image URL or project an existing icon component. Add the `sharedButtonIcon` marker to an icon projected into `ButtonComponent`; `IconButtonComponent` treats all projected content as its icon. The projected icon is decorative, while the icon-only button's required `ariaLabel` provides its accessible name.

Available tones are `primary`, `positive`, `negative` and `neutral`. Appearances are `filled`, `outlined` and `text`; sizes are `small`, `medium` and `large`. Both components support `disabled`, `loading`, native button `type`, accessible descriptions, programmatic `focus()` and the shared `access` plus `inaccessibleBehavior` contract.

If an access rule is restricted, missing/loading/error permission context denies access. `remove` removes the native button, `hide` keeps it hidden, and `disable` renders a non-activatable disabled button. UI visibility is only a UX layer; backend authorization remains authoritative.

## Field label

```html
<shared-field-label forId="reference" text="Reference" [required]="true" />
<input id="reference" required />
```

The component renders a visible native `label`. Keep the control's native `required`/`aria-required` state synchronized with the label configuration. `requiredText` is configurable for localization.

## Loading

```html
<shared-loading label="Loading orders" mode="block" [showLabel]="true" />
```

`mode` accepts `inline`, `block` or `overlay`. An overlay positions itself over its nearest positioned ancestor. The indicator uses `role="status"`, a polite live region and reduced-motion/forced-colors adaptations.

## Inline alert

```html
<shared-inline-alert
  tone="warning"
  title="Check the values"
  [dismissible]="true"
  (dismissed)="hideWarning()"
>
  Two fields still require attention.
</shared-inline-alert>
```

Non-urgent alerts announce politely by default. Set `announcement="assertive"` only for urgent messages; this changes the role to `alert`. The visible status label prevents meaning from being conveyed by color alone. Labels and dismiss text are configurable for i18n, the layout uses logical properties for RTL, and long content reflows at 320 CSS px.

## Development

- [Library agent instructions](AGENTS.md)
- [Changelog](CHANGELOG.md)
- [Repository package guide](../../README.md)

Verify changes with:

```bash
npm run test:shared-ui-primitives
npm run build:shared-ui-primitives
npm run test:e2e
```

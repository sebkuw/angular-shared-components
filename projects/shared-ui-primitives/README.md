# @sebkuw/shared-ui-primitives

Small, reusable Angular 20 UI primitives for application and shared-library interfaces.

## Demo

Try this package's components and integrations in the [interactive component gallery](../demo/README.md). From the repository root, run `npm ci` and `npm start`, then open [http://127.0.0.1:4200/](http://127.0.0.1:4200/). The source demo uses local sample data and requires no GitHub Packages token or backend.

## Installation

Configure GitHub Packages as described in the [repository installation guide](../../README.md#installation), then install the package and its core peer:

```bash
npm install @sebkuw/shared-ui-primitives @sebkuw/shared-ui-core @angular/cdk
```

Include `@sebkuw/shared-ui-theme/styles/tokens.css` and apply `netdevs-shared-ui-theme` to the application shell for the default theme. Every component also provides safe CSS fallbacks.

## Public API

| Export                                                                                                                                                      | Purpose                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `ButtonComponent`, `IconButtonComponent`                                                                                                                    | Text, text + icon and icon-only buttons.                            |
| `ActionLinkComponent`, `IconLinkComponent`                                                                                                                  | Button-styled native links preserving navigation semantics.         |
| `IconComponent`, `provideSharedIcons`, `SHARED_ICON_REGISTRY`                                                                                               | Safe image/projected icons and application-owned icon registration. |
| `ActionBarComponent`                                                                                                                                        | Responsive grouping and alignment for related page/form actions.    |
| `VisuallyHiddenDirective`                                                                                                                                   | Screen-reader content that remains in the accessibility tree.       |
| `FieldLabelComponent`                                                                                                                                       | Visible native field label with optional required marker.           |
| `LoadingComponent`                                                                                                                                          | Inline, block or overlay loading status.                            |
| `InlineAlertComponent`                                                                                                                                      | Inline info, success, warning or error message.                     |
| `SkeletonComponent`                                                                                                                                         | Text, rectangular or circular loading placeholders.                 |
| `BadgeComponent`                                                                                                                                            | Counts, short statuses and notification dots.                       |
| `ProgressComponent`                                                                                                                                         | Determinate or indeterminate native progress indicator.             |
| `PopoverComponent`, `PopoverTriggerDirective`                                                                                                               | Positioned popover/dropdown with projected trigger and content.     |
| `ButtonTone`, `ButtonAppearance`, `ButtonSize`, `ButtonType`, `IconPosition`, `IconSize`, `LoadingMode`, `LoadingSize`, `InlineAlertTone`, `LivePoliteness` | Typed configuration contracts.                                      |

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

## Icons, links and action bars

Register application-owned image URLs during bootstrap. The registry never injects raw SVG markup:

```ts
import { provideSharedIcons } from '@sebkuw/shared-ui-primitives';

bootstrapApplication(AppComponent, {
  providers: [provideSharedIcons({ save: '/icons/save.svg' })],
});
```

```html
<shared-icon name="save" />
<shared-icon name="save" [decorative]="false" ariaLabel="Save" />

<a sharedActionLink routerLink="/orders/new">Create order</a>
<a sharedIconLink href="#filters" ariaLabel="Go to filters" iconName="save"></a>

<shared-action-bar ariaLabel="Editor actions" alignment="space-between">
  <shared-button sharedActionBarStart appearance="text">Back</shared-button>
  <shared-button tone="positive">Save</shared-button>
</shared-action-bar>
```

Links render as native anchors, retain browser navigation behavior and expose `aria-disabled` when disabled. Use the structural `*sharedCanAccess` directive when a permission-denied link must be removed from the DOM. `sharedVisuallyHidden` visually clips supporting text without applying `aria-hidden`.

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

## Skeleton, badge and progress

```html
<shared-skeleton label="Loading invoice" variant="rectangle" height="6rem" />
<shared-skeleton label="Loading invoice lines" [lines]="3" />

<shared-badge [value]="unreadCount" [max]="99" tone="negative" ariaLabel="Unread notifications" />

<shared-progress label="Upload progress" [value]="uploaded" [max]="total" tone="positive" />
```

Skeletons are marked busy, stop shimmering for reduced-motion users and adapt to forced colors. Badges hide empty/zero values by default, can render a dot, cap numeric counts and optionally announce updates; an unnamed dot is decorative. Progress uses the native `progress` element, clamps invalid values and accepts a localized `formatValue` callback. Set `mode="indeterminate"` when the amount of completed work is unknown.

## Popover and dropdown

```html
<shared-popover ariaLabel="Notification options" placement="bottom">
  <button sharedPopoverTrigger type="button">Notifications</button>
  <h2>Notifications</h2>
  <p>Three updates are ready.</p>
</shared-popover>
```

The projected trigger should be a native button (or another element with equivalent keyboard semantics). The directive keeps `aria-expanded`, `aria-controls` and `aria-haspopup` synchronized. The panel closes on Escape or an outside click and restores focus to the trigger. Set `role="menu"` only when the projected content follows the WAI-ARIA menu pattern; the default `dialog` role is appropriate for ordinary interactive content. `placement` accepts `top`, `bottom`, `start` and `end`, each with viewport-aware fallbacks. `matchTriggerWidth`, `autoFocus`, `closeOnPanelClick`, `disabled` and `panelClass` configure behavior without domain assumptions. The overlay is bounded to the viewport, supports RTL logical placement, long translations and 320 CSS px reflow, and remains SSR-safe through Angular CDK.

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

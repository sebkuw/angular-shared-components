# @sebkuw/shared-ui-feedback

Configurable dialogs and notifications for NetDevs Angular applications.

## Installation

Configure GitHub Packages as described in the [repository installation guide](../../README.md#installation), then install the package and its shared peers:

```bash
npm install @sebkuw/shared-ui-feedback @sebkuw/shared-ui-core @sebkuw/shared-ui-primitives
```

## Current public API

The package exports informational and confirmation dialogs, `NotificationService`, `EmptyStateComponent`, `ErrorStateComponent` and their typed configuration contracts. The low-level `NotificationComponent` remains public for advanced integrations. The authoritative export list is `src/public-api.ts`.

Dialog content is rendered as safe text by default or through an explicit Angular `TemplateRef`; raw `[innerHTML]` is not used. Confirmation, notification action and dismiss controls use the public button primitives. Confirmation and notification actions can define shared access rules. Notifications use `status`/polite announcements except errors, which use `alert`/assertive, and expose configurable dismiss labels.

## Reusable states

Use the states directly or configure them through `DynamicTableComponent`:

```html
<shared-empty-state
  title="No invoices"
  description="Create the first invoice to get started."
  actionLabel="Create invoice"
  (actionTriggered)="createInvoice()"
/>

<shared-error-state
  title="Invoices unavailable"
  description="Check the connection and try again."
  retryLabel="Try again"
  (retry)="reload()"
/>
```

Icons, announcement urgency, heading level, action tone, accessible labels and access rules are configurable. Titles and descriptions must be supplied by the application so they can be translated.

## Destructive confirmations

`ConfirmationDialogService.confirm()` returns `Observable<boolean>`. Cancel is the initial focus target, focus is trapped inside the dialog and restored to the invoking control after close.

```ts
confirmationDialog
  .confirm({
    title: 'Delete invoice?',
    message: 'This cannot be undone.',
    confirmLabel: 'Delete invoice',
    cancelLabel: 'Keep invoice',
    confirmTone: 'negative',
  })
  .subscribe((confirmed) => confirmed && deleteInvoice());
```

## Notifications

Configure defaults once and inject the service instead of configuring `MatSnackBar` in each consumer:

```ts
bootstrapApplication(AppComponent, {
  providers: [provideSharedNotifications({ dismissLabel: 'Close notification' })],
});

notificationService.success('Saved successfully.');
notificationService.error('Could not save.');
```

Success and info messages have configurable default timeouts; errors remain visible until dismissed by default. WebSocket setup, reconnect policy and event mapping belong to the consuming application. A WebSocket handler can translate its domain event and call `NotificationService` to keep presentation consistent.

## Architectural role

- Provide reusable feedback primitives without application-specific text, transport or global error handling.
- Configure content, urgency, actions, timeout, placement and closing behavior through typed APIs.
- Apply the shared permissions/claims mechanism to actions where appropriate.
- Do not hide an important security or status message merely because one related action is unavailable.
- Support SSR/hydration, internationalization, long content and RTL.

## Accessibility and interaction

Dialogs provide an accessible name, focus trap, safe initial focus, Escape behavior and focus restoration. State components expose headings and configurable polite/assertive live regions. Notifications use polite status announcements by default and assertive alerts for errors. Timed content is dismissible. Every action works by keyboard and exposes a visible label or accessible name.

## Required tests

Cover dialog labels/descriptions, focus trap/restore, Escape, backdrop, actions, live regions, queueing, timeout/dismiss, permissions, reduced motion, small viewports, RTL, host integration, public API, E2E, visual and regression cases.

## Development

- [Library agent instructions](AGENTS.md)
- [Feedback development skill](../../.agents/skills/develop-shared-ui-feedback/SKILL.md)
- [Changelog](CHANGELOG.md)
- [Repository package guide](../../README.md#6-feedback---sebkuwshared-ui-feedback)

Verify changes with:

    npm run test:shared-ui-feedback
    npm run build:shared-ui-feedback

Update this README, src/public-api.ts when necessary, and the Unreleased section of CHANGELOG.md in the same change.

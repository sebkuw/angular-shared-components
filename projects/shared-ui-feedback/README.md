# @netdevs/shared-ui-feedback

Configurable dialogs and notifications for NetDevs Angular applications.

## Current public API

The package exports InfoDialogComponent, InfoDialogData, NotificationComponent and NotificationData. The authoritative export list is src/public-api.ts.

Dialog content is rendered as safe text by default or through an explicit Angular `TemplateRef`; raw `[innerHTML]` is not used. Confirmation and notification actions can define shared access rules. Notifications use `status`/polite announcements except errors, which use `alert`/assertive, and expose configurable dismiss labels.

## Architectural role

- Provide reusable feedback primitives without application-specific text, transport or global error handling.
- Configure content, urgency, actions, timeout, placement and closing behavior through typed APIs.
- Apply the shared permissions/claims mechanism to actions where appropriate.
- Do not hide an important security or status message merely because one related action is unavailable.
- Support SSR/hydration, internationalization, long content and RTL.

## Accessibility and interaction

Dialogs need an accessible name, optional description, focus trap, safe initial focus, Escape behavior and focus restoration. Notifications should use polite status announcements by default and assertive alerts only when truly urgent. Timed content must be dismissible and provide sufficient interaction time. Every action must work by keyboard and expose a visible label or accessible name.

## Required tests

Cover dialog labels/descriptions, focus trap/restore, Escape, backdrop, actions, live regions, queueing, timeout/dismiss, permissions, reduced motion, small viewports, RTL, host integration, public API, E2E, visual and regression cases.

## Development

- [Library agent instructions](AGENTS.md)
- [Feedback development skill](../../.agents/skills/develop-shared-ui-feedback/SKILL.md)
- [Changelog](CHANGELOG.md)
- [Repository package guide](../../README.md#6-feedback---netdevsshared-ui-feedback)

Verify changes with:

    npm run test:shared-ui-feedback
    npm run build:shared-ui-feedback

Update this README, src/public-api.ts when necessary, and the Unreleased section of CHANGELOG.md in the same change.

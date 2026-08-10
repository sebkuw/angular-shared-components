# @netdevs/shared-ui-forms

Configurable dynamic details, forms and form controls for NetDevs Angular applications.

## Current public API

The package exports DynamicFormComponent, DynamicDetailsComponent, the form control components, typed field/detail configuration models, FormFieldBaseComponent and CastPipe. The authoritative export list is src/public-api.ts.

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
- [Repository package guide](../../README.md#3-forms---netdevsshared-ui-forms)

Verify changes with:

    npm run test:shared-ui-forms
    npm run build:shared-ui-forms

Update this README, src/public-api.ts when necessary, and the Unreleased section of CHANGELOG.md in the same change.

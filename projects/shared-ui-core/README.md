# @sebkuw/shared-ui-core

Provider-independent access contracts and reactive permissions/claims helpers shared by the Angular UI packages.

## Demo

Try this package's components and integrations in the [interactive component gallery](../demo/README.md). From the repository root, run `npm ci` and `npm start`, then open [http://127.0.0.1:4200/](http://127.0.0.1:4200/). The source demo uses local sample data and requires no GitHub Packages token or backend.

## Installation

Configure GitHub Packages as described in the [repository installation guide](../../README.md#installation), then install the package:

```bash
npm install @sebkuw/shared-ui-core
```

## Current public API

The package exports `NETDEVS_SHARED_UI_VERSION`, access models, `evaluateAccess`, `PERMISSION_CONTEXT`, `providePermissionContext`, `PermissionService` and `CanAccessDirective`.

Provide a signal once during bootstrap:

```ts
const accessContext = signal<PermissionContext>({
  status: 'ready',
  authenticated: true,
  permissions: ['orders.read'],
  claims: { tenant: 'acme' },
});

bootstrapApplication(AppComponent, {
  providers: [providePermissionContext(accessContext)],
});
```

Restricted rules are denied while the context is loading, missing or in error. `none` has deny precedence. Use `{ public: true }` for an explicitly public resource. UI filtering complements backend authorization and never replaces it.

## Architectural role

- Keep shared contracts independent of Angular Material, the DOM and a particular identity provider.
- Host the common reactive permissions/claims contract used by UI components.
- Apply deny-by-default behavior and explicit any, all and none rule semantics.
- Keep backend authorization authoritative; frontend evaluation controls presentation and interaction only.
- Export supported symbols through src/public-api.ts and avoid deep imports.

## Required quality standard

New or changed APIs must retain Angular 20 and strict TypeScript compatibility, work with SSR/hydration, remain tree-shakeable and include unit, integration, public API and regression coverage. Permissions work must test loading, missing context, allow, deny, claims and reactive session changes.

## Development

- [Library agent instructions](AGENTS.md)
- [Core development skill](../../.agents/skills/develop-shared-ui-core/SKILL.md)
- [Changelog](CHANGELOG.md)
- [Repository package guide](../../README.md#1-core---sebkuwshared-ui-core)

Verify changes with:

    npm run test:shared-ui-core
    npm run build:shared-ui-core

Update this README, src/public-api.ts when necessary, and the Unreleased section of CHANGELOG.md in the same change.

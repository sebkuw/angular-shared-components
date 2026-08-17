# Shared UI demo

The Angular 20 demo is the integration host for every `@sebkuw/shared-ui-*` package. It demonstrates reactive permissions/claims, theme tokens, keyboard interaction, public buttons and field labels, loading and inline feedback, forms, details, navigation and semantic tables. All ordinary demo and hosted-library actions use the public button primitives; only menu/sort/navigation controls with specialized native or Material behavior remain exceptions.

The gallery loads Angular Material's free `azure-blue` theme together with the shared semantic tokens. It includes every supported dynamic form field, an editable details example with a spacer, and a table whose text, select, boolean, numeric-range and date-range filters operate on local demo data.

Run the live preview directly from the repository root:

```bash
npm start
```

`npm run dev` and `npm run start:demo` are equivalent aliases. Open <http://127.0.0.1:4200/> after Angular reports that compilation is complete. The demo resolves every package through its public source entry point, so a separate library build is not required and edits under `projects/shared-ui-*` trigger a live reload.

Playwright uses this application for desktop and 320 px E2E checks. Run `npm run test:e2e` for interaction/accessibility/responsive tests and `npm run test:visual` for committed visual baselines. Update baselines with `npm run test:visual:update` only after reviewing intentional UI changes.

The self-hosted Material Icons development dependency avoids external network requests during tests. Frontend visibility is a UX layer; the example does not imply that backend authorization can be omitted.

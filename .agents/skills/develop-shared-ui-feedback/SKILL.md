---
name: develop-shared-ui-feedback
description: 'Rozwijaj bibliotekę @netdevs/shared-ui-feedback w Angular 20. Używaj przy zmianach w projects/shared-ui-feedback, dialogs, notifications, live regions, focus traps, timeoutach, akcjach komunikatów, responsywnych overlays oraz permissions/claims dla akcji.'
---

# Rozwijanie Shared UI Feedback

## Przygotuj kontekst

1. Przeczytaj główny AGENTS.md i projects/shared-ui-feedback/AGENTS.md.
2. Przeczytaj README.md, CHANGELOG.md, package.json i src/public-api.ts.
3. Określ poziom pilności komunikatu, model interakcji, początkowy focus, zamknięcie i zachowanie po zamknięciu.

## Projektuj dialog

- Zapewnij dostępną nazwę, opcjonalny opis, poprawny focus trap i focus restore.
- Ustaw bezpieczny początkowy focus; nie preferuj destrukcyjnej akcji.
- Obsłuż Escape zgodnie z jawną konfiguracją i nie pozostawiaj aktywnego tła.
- Zapewnij pełną klawiaturę, visible focus, reflow i mały viewport.
- Stosuj permissions/claims do akcji, zachowując deny by default.

## Projektuj powiadomienie

- Użyj status i polite live region dla zwykłej informacji.
- Użyj alert i assertive wyłącznie dla pilnego komunikatu wymagającego natychmiastowej uwagi.
- Pozwól zamknąć komunikat, skonfiguruj czas i zatrzymaj lub przedłuż timeout podczas interakcji, gdy wymaga tego dostępność.
- Nie polegaj wyłącznie na kolorze lub ikonie; dodaj tekst i accessible names.
- Nie ukrywaj użytkownikowi istotnego komunikatu bezpieczeństwa na podstawie permission przypisanej tylko do akcji.

## Testuj i kończ

- Testuj accessible name/description, role, live region, focus trap/restore, Escape, backdrop, akcje i klawiaturę.
- Testuj kolejkę, timeout, dismiss, interakcję, reduced motion, viewporty i RTL.
- Testuj permissions/claims dla akcji oraz host component z prawdziwą nakładką CDK/Material.
- Dodaj public API test i test regresyjny.
- Zaktualizuj README.md, CHANGELOG.md i src/public-api.ts.
- Uruchom npm run test:shared-ui-feedback i npm run build:shared-ui-feedback.
- Uruchom odpowiednie Playwright E2E i visual tests aplikacji demonstracyjnej lub jawnie zgłoś brak infrastruktury.

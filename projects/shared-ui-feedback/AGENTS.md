# Instrukcje dla shared-ui-feedback

## Odpowiedzialność biblioteki

- Utrzymuj tutaj dialogi informacyjne, powiadomienia, komunikaty stanu i ich konfigurowalne kontrakty.
- Nie koduj tekstów domenowych, globalnego systemu błędów ani transportu danych.
- Pozwalaj konsumentowi konfigurować treść, poziom ważności, akcje, czas, pozycję i zachowanie zamknięcia z bezpiecznymi wartościami domyślnymi.

## Dostępność i zachowanie

- Dialog musi mieć dostępną nazwę i opcjonalny opis, poprawny focus trap, początkowy focus, obsługę Escape zgodną z konfiguracją i przywracanie fokusu.
- Nie ustawiaj początkowego fokusu na destrukcyjnej akcji, jeśli bezpieczniejszy element jest dostępny.
- Używaj `status`/polite live region dla informacji i `alert`/assertive tylko dla komunikatów naprawdę pilnych.
- Powiadomienie czasowe musi dawać wystarczająco dużo czasu, pozwalać na zamknięcie oraz zatrzymywać lub przedłużać czas podczas interakcji, gdy wymaga tego dostępność.
- Każda akcja musi działać klawiaturą, mieć widoczną etykietę lub accessible name i nie polegać wyłącznie na kolorze/ikonie.
- Stosuj permissions/claims do akcji dialogów i powiadomień, nie do samego komunikatu bezpieczeństwa, który użytkownik musi poznać.

## Testy i dokumentacja

- Testuj focus trap/restore, Escape, akcje, live regions, role, kolejkę, timeout, dismiss, reduced motion, małe viewporty i permissions.
- Testuj dialogi i powiadomienia w host component z prawdziwymi bindingami i nakładką CDK/Material.
- Aktualizuj `README.md`, `CHANGELOG.md`, konfigurację przykładów i `src/public-api.ts`.
- Weryfikuj przez `npm run test:shared-ui-feedback` i `npm run build:shared-ui-feedback` oraz właściwe scenariusze Playwright aplikacji demonstracyjnej.

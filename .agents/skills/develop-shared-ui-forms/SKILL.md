---
name: develop-shared-ui-forms
description: 'Rozwijaj bibliotekę @netdevs/shared-ui-forms w Angular 20. Używaj przy zmianach w projects/shared-ui-forms, dynamic forms, dynamic details, kontrolkach Angular Forms, walidacji, konfiguracji pól, uploadzie, dostępności formularzy oraz widoczności pól i akcji według permissions/claims.'
---

# Rozwijanie Shared UI Forms

## Przygotuj kontekst

1. Przeczytaj główny AGENTS.md i projects/shared-ui-forms/AGENTS.md.
2. Przeczytaj README.md, CHANGELOG.md, package.json i src/public-api.ts.
3. Zidentyfikuj wszystkie typy pól i host forms dotknięte zmianą.

## Projektuj kontrolkę

- Utrzymuj typed reactive forms i zgodny kontrakt ControlValueAccessor, gdy komponent reprezentuje wartość.
- Zapewnij typowaną konfigurację, wartości domyślne, validators, disabled, readonly, opisy i błędy.
- Powiąż programowo label, hint i error. Nie używaj placeholdera jako jedynej etykiety.
- Zachowaj poprawne value, touched, dirty, disabled, reset i update-on semantics.
- Nie wykonuj HTTP i nie zależ od domenowego modelu, tekstów ani serwisu tożsamości.
- Użyj wspólnego mechanizmu permissions/claims dla pól i akcji z jawnym remove, hidden, readonly lub disabled.

## Zapewnij interakcję

1. Użyj natywnej semantyki i pełnej obsługi klawiatury.
2. Utrzymuj logiczny focus, dostępne błędy i brak nieuzasadnionych skoków fokusu.
3. Zapewnij reflow od 320 CSS px, zoom, dotyk, długie teksty i RTL.
4. Dla plików zapewnij dostępny wybór, walidację, komunikat błędu i usunięcie klawiaturą.
5. Nie utracaj wartości użytkownika podczas reaktywnej zmiany konfiguracji bez jawnej reguły.

## Testuj i kończ

- Testuj każdy publiczny typ pola, wartości i stany forms, walidację, reset, konfigurację reaktywną i przypadki brzegowe.
- Testuj host form, bindingi, DI, permissions/claims, accessible name, komunikaty, klawiaturę i focus.
- Testuj małe viewporty, długie tłumaczenia, RTL i SSR/hydration, gdy dotyczy.
- Dodaj public API test i test regresyjny.
- Zaktualizuj README.md, CHANGELOG.md i src/public-api.ts.
- Uruchom npm run test:shared-ui-forms i npm run build:shared-ui-forms.
- Uruchom odpowiednie Playwright E2E i visual tests aplikacji demonstracyjnej lub jawnie zgłoś brak infrastruktury.

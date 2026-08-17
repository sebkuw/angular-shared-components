# Instrukcje dla shared-ui-primitives

## Odpowiedzialność biblioteki

- Umieszczaj tutaj małe, niezależne od domeny elementy interfejsu używane w wielu bibliotekach i aplikacjach.
- Zachowuj natywną semantykę HTML, pełną obsługę klawiatury, widoczny fokus i bezpieczne wartości domyślne.
- Nie dodawaj zależności od Angular Material ani od konkretnego systemu ikon. Obrazy i treści mają być dostarczane przez publiczne inputs lub content projection.
- Używaj semantycznych tokenów z `@sebkuw/shared-ui-theme` przez CSS custom properties, bez twardego powiązania pakietowego.

## Permissions i claims

- Akcje interaktywne korzystają ze wspólnego kontraktu `@sebkuw/shared-ui-core`.
- Domyślna akcja może być publiczna wyłącznie przez jawny `PUBLIC_ACCESS_RULE`.
- Dla braku dostępu obsługuj `remove`, `hide` i `disable`; stan disabled nie może emitować zdarzeń.
- Widoczność frontendu jest warstwą UX i nie zastępuje autoryzacji backendowej.

## Testy i dokumentacja

- Testuj semantykę, accessible name, klawiaturę, focus, loading, disabled, permissions, warianty i zdarzenia.
- Testuj integrację hosta z template bindings oraz eksporty przez nazwę pakietu.
- Utrzymuj demo oraz testy Playwright dla desktopu, 320 CSS px i regresji wizualnej.
- Aktualizuj `README.md`, `CHANGELOG.md` i `src/public-api.ts` wraz ze zmianą publicznego API.

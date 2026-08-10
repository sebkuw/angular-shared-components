# Instrukcje dla shared-ui-forms

## Odpowiedzialność biblioteki

- Utrzymuj tutaj dynamiczne formularze, widoki szczegółów, kontrolki formularza, ich konfigurację i modele.
- Integruj kontrolki z Angular Forms w sposób zgodny z typed reactive forms. Implementuj ControlValueAccessor tylko dla rzeczywistych kontrolek wartości.
- Nie wiąż komponentów z modelem domenowym, endpointem, konkretnym formatem tłumaczeń ani usługą autoryzacji aplikacji.

## Zachowanie formularzy

- Zapewniaj silnie typowane konfiguracje pól, wartości domyślne, walidatory, stany disabled/readonly, opisy, prefix/suffix i formatowanie.
- Każda kontrolka musi mieć programowo powiązaną etykietę, instrukcję i błąd; nie używaj placeholdera jako jedynej etykiety.
- Ogłaszaj błędy w dostępny sposób, zachowuj wartości użytkownika i nie przenoś fokusu bez uzasadnienia.
- Obsługuj klawiaturę zgodnie z natywną kontrolką lub wzorcem ARIA, w tym wybór, czyszczenie, rozwijanie i zamykanie.
- Dla uploadu zapewniaj dostępny przycisk, ograniczenia typu/rozmiaru jako walidację, czytelny błąd i możliwość usunięcia pliku klawiaturą.
- Stosuj wspólny mechanizm permissions/claims do pól i akcji. Rozróżniaj usunięcie, readonly i disabled bez przyznawania dostępu przy braku kontekstu.

## Testy i dokumentacja

- Testuj value/touched/dirty/disabled, walidację, reset, aktualizację konfiguracji, długie treści, klawiaturę, focus, permissions i integrację z host form.
- Pokrywaj każdy publiczny typ pola i każdy wariant jego konfiguracji; dodawaj test regresyjny dla każdego naprawionego przypadku.
- Aktualizuj `README.md`, przykłady konfiguracji, `CHANGELOG.md` i `src/public-api.ts`.
- Weryfikuj przez `npm run test:shared-ui-forms` i `npm run build:shared-ui-forms` oraz właściwe scenariusze Playwright aplikacji demonstracyjnej.

# Instrukcje dla shared-ui-layout

## Odpowiedzialność biblioteki

- Utrzymuj tutaj strukturę strony, nagłówki, nawigację, menu boczne, modele menu i usługi stanu layoutu.
- Nie implementuj autoryzacji backendowej ani reguł routingu właściwych jednej aplikacji.
- Traktuj Angular Router jako opcjonalną integrację komponentu, nie jako źródło permissions.

## Nawigacja i responsywność

- Używaj landmarków `header`, `nav`, `main` i `aside` zgodnie z rolą treści oraz zapewniaj dostępne nazwy wielu obszarów nawigacji.
- Stosuj semantykę listy linków dla zwykłej nawigacji; używaj roli `menu` wyłącznie przy pełnej implementacji wzorca menu aplikacyjnego.
- Zapewniaj obsługę klawiatury, widoczny focus, aktywny link, Escape dla warstw i przywracanie fokusu do elementu otwierającego.
- Po nawigacji umożliwiaj aplikacji prawidłowe zarządzanie fokusem głównej treści; nie przechwytuj fokusu bez konfiguracji.
- Ukrywaj lub usuwaj niedostępne pozycje wspólnym mechanizmem permissions/claims przed renderowaniem. Ochrona tras i backend pozostają osobną warstwą.
- Zapewniaj mobile-first collapse/overlay bez utraty pozycji menu, tekstu, powiększenia i obsługi RTL.

## Testy i dokumentacja

- Testuj aktywną trasę, zagnieżdżone pozycje, toggle, focus, Escape, klawiaturę, permissions, zmianę sesji, małe viewporty i RTL.
- Dodawaj testy integracji Routera oraz semantyki landmarków i nawigacji.
- Aktualizuj `README.md`, `CHANGELOG.md`, modele menu i `src/public-api.ts`.
- Weryfikuj przez `npm run test:shared-ui-layout` i `npm run build:shared-ui-layout` oraz właściwe scenariusze Playwright aplikacji demonstracyjnej.

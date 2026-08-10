# Instrukcje dla shared-ui-list

## Odpowiedzialność biblioteki

- Utrzymuj tutaj reużywalne listy i tabele danych, modele konfiguracji, filtrowanie, sortowanie, paginację, selekcję, akcje i eksport.
- Oddzielaj stan tabeli od renderowania i transportu danych. Nie wykonuj niejawnych zapytań HTTP.
- Nie zakładaj konkretnego schematu rekordu, backendu paginacji ani formatu eksportu bez jawnej konfiguracji.

## Dostępność i zachowanie

- Używaj semantyki tabeli dla danych tabelarycznych: caption lub dostępna nazwa, prawidłowe nagłówki i powiązania komórek.
- Synchronizuj sortowanie z `aria-sort`; zapewniaj dostępne nazwy filtrów, selekcji, paginacji i menu akcji.
- Każda akcja wiersza, zaznaczenie, sortowanie i paginacja muszą działać klawiaturą z przewidywalnym fokusem.
- Zapewniaj dostępne empty, loading i error states. Nie ukrywaj informacji wyłącznie przez skeleton lub kolor.
- Dla małych viewportów utrzymuj komplet danych i akcji przez przewijanie, układ kart lub konfigurację kolumn; nie usuwaj funkcji bez jawnej decyzji konsumenta.
- Filtruj niedostępne kolumny i akcje wspólnym mechanizmem permissions/claims przed ich renderowaniem.

## Testy i dokumentacja

- Testuj dane puste/duże, sortowanie, filtry, paginację, selekcję, akcje, eksport, formatowanie, reaktywną konfigurację i permissions.
- Dodaj testy semantyki tabeli, klawiatury, fokusu, reflow, długich treści, RTL oraz publicznych eksportów.
- Aktualizuj `README.md`, `CHANGELOG.md`, modele konfiguracji i `src/public-api.ts` w jednym zadaniu.
- Weryfikuj przez `npm run test:shared-ui-list` i `npm run build:shared-ui-list` oraz właściwe scenariusze Playwright aplikacji demonstracyjnej.

---
name: develop-shared-ui-list
description: 'Rozwijaj bibliotekę @netdevs/shared-ui-list w Angular 20. Używaj przy zmianach w projects/shared-ui-list, dynamic table, modelach tabeli, filtrowaniu, sortowaniu, paginacji, selekcji, akcjach wiersza, eksporcie, responsywnych listach i permissions/claims.'
---

# Rozwijanie Shared UI List

## Przygotuj kontekst

1. Przeczytaj główny AGENTS.md i projects/shared-ui-list/AGENTS.md.
2. Przeczytaj README.md, CHANGELOG.md, package.json i src/public-api.ts.
3. Zidentyfikuj wpływ na modele konfiguracji, stan tabeli, formattery, export i publiczne typy.

## Projektuj dane i stan

- Oddziel transport danych od renderowania; nie wykonuj niejawnych żądań HTTP.
- Zapewnij typowane modele dla kolumn, filtrów, sortowania, paginacji, selekcji, akcji i eksportu.
- Utrzymuj kontrolowany i niekontrolowany stan tylko z jednoznaczną dokumentacją.
- Zachowaj stabilne identyfikatory wierszy i przewidywalne zdarzenia.
- Filtruj niedostępne kolumny i akcje wspólnym mechanizmem permissions/claims przed renderowaniem.
- Nie usuwaj danych lub funkcji na małym ekranie bez jawnej konfiguracji konsumenta.

## Zapewnij dostępny interfejs

1. Użyj semantycznej tabeli z dostępną nazwą, poprawnymi nagłówkami i aria-sort.
2. Zapewnij accessible names dla filtrów, selekcji, paginacji i akcji.
3. Obsłuż sortowanie, wybór, akcje i paginację klawiaturą z przewidywalnym fokusem.
4. Zapewnij dostępne loading, empty i error states.
5. Obsłuż 320 CSS px, reflow, długą treść, zoom, dotyk i RTL bez utraty funkcji.

## Testuj i kończ

- Testuj dane puste, duże i zmienne oraz sortowanie, filtry, paginację, selekcję, akcje, eksport i formatowanie.
- Testuj permissions/claims, reaktywną zmianę sesji i brak niedostępnych elementów w DOM.
- Testuj semantykę tabeli, klawiaturę, focus, viewporty, RTL i publiczne API.
- Dodaj test regresyjny dla błędu.
- Zaktualizuj README.md, CHANGELOG.md i src/public-api.ts.
- Uruchom npm run test:shared-ui-list i npm run build:shared-ui-list.
- Uruchom odpowiednie Playwright E2E i visual tests aplikacji demonstracyjnej lub jawnie zgłoś brak infrastruktury.

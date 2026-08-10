---
name: develop-shared-ui-layout
description: "Rozwijaj bibliotekę @netdevs/shared-ui-layout w Angular 20. Używaj przy zmianach w projects/shared-ui-layout, page headers, side menu, modelach nawigacji, Router integration, responsywnym layoucie, focus management, klawiaturze oraz filtrowaniu menu według permissions/claims."
---

# Rozwijanie Shared UI Layout

## Przygotuj kontekst

1. Przeczytaj główny AGENTS.md i projects/shared-ui-layout/AGENTS.md.
2. Przeczytaj README.md, CHANGELOG.md, package.json i src/public-api.ts.
3. Sprawdź wpływ zmiany na menu models, service, injection token, Router i wszystkie breakpointy.

## Projektuj strukturę i nawigację

- Użyj właściwych landmarków header, nav, main i aside z dostępnymi nazwami.
- Dla zwykłej nawigacji użyj listy linków; wybierz wzorzec menu aplikacyjnego tylko z pełną semantyką i klawiaturą APG.
- Zachowaj aktywny link, logiczną kolejność fokusu, Escape dla warstw i focus restore do triggera.
- Udostępnij aplikacji sposób przeniesienia fokusu do głównej treści po nawigacji.
- Utrzymuj Router jako konfigurowalną integrację, nie jako źródło autoryzacji.
- Filtruj pozycje wspólnym mechanizmem permissions/claims przed renderowaniem; nadal wymagaj ochrony tras i backendu.

## Zapewnij responsywność

1. Projektuj mobile first od 320 CSS px.
2. Zapewnij collapse lub overlay bez utraty tekstu, pozycji, akcji i focus.
3. Obsłuż zoom, reflow, dotyk, długie tłumaczenia, RTL, reduced motion i forced colors.
4. Nie blokuj scrollowania ani klawiatury po zamknięciu nakładki.
5. Nie używaj stałych wymiarów zależnych od konkretnego urządzenia.

## Testuj i kończ

- Testuj aktywną i zagnieżdżoną trasę, toggle, overlay, focus, Escape, klawiaturę i zmianę viewportu.
- Testuj permissions/claims, zmianę sesji i brak niedostępnych pozycji w DOM.
- Testuj landmarki, nazwy nawigacji, Router host, RTL i publiczne API.
- Dodaj test regresyjny dla błędu.
- Zaktualizuj README.md, CHANGELOG.md i src/public-api.ts.
- Uruchom npm run test:shared-ui-layout i npm run build:shared-ui-layout.
- Uruchom odpowiednie Playwright E2E i visual tests aplikacji demonstracyjnej lub jawnie zgłoś brak infrastruktury.

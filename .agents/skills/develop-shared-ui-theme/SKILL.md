---
name: develop-shared-ui-theme
description: "Rozwijaj bibliotekę @netdevs/shared-ui-theme w Angular 20. Używaj przy zmianach w projects/shared-ui-theme, design tokens, CSS custom properties, kontraktach motywu, kolorach, typografii, spacingu, focus styles, reduced motion, high contrast i RTL."
---

# Rozwijanie Shared UI Theme

## Przygotuj kontekst

1. Przeczytaj główny AGENTS.md i projects/shared-ui-theme/AGENTS.md.
2. Przeczytaj README.md, CHANGELOG.md, package.json i src/public-api.ts.
3. Sprawdź użycie zmienianych tokenów w pozostałych bibliotekach przed zmianą nazwy lub semantyki.

## Projektuj tokeny

- Użyj nazw semantycznych niezależnych od konkretnego koloru lub komponentu.
- Zapewnij bezpieczne wartości domyślne i możliwość nadpisania przez konsumenta.
- Tokenizuj kolory, typografię, spacing, focus ring, motion, warstwy i breakpointy, gdy są współdzielone.
- Preferuj CSS custom properties i logiczne właściwości CSS.
- Zachowaj light, dark, forced colors/high contrast, reduced motion i RTL.
- Nie umieszczaj logiki funkcjonalnej ani selektorów zależnych od prywatnego DOM komponentu.

## Sprawdź dostępność

1. Zweryfikuj WCAG 2.2 AA dla tekstu, interaktywnych stanów, focus, disabled, error i tekstu pomocniczego.
2. Nie usuwaj focus outline bez równoważnego, widocznego zamiennika.
3. Nie opieraj stanu wyłącznie na kolorze.
4. Zapewnij czytelność przy zoom, reflow i długich tłumaczeniach.
5. Ogranicz animacje zgodnie z prefers-reduced-motion.

## Testuj i kończ

- Testuj publiczne tokeny, wartości domyślne, nadpisania, kontrast, forced colors, reduced motion i stabilność eksportów.
- Dodaj test publicznego importu przez nazwę paczki.
- Traktuj usunięcie lub zmianę nazwy tokenu jako breaking change i opisz migrację.
- Zaktualizuj README.md, CHANGELOG.md i src/public-api.ts.
- Uruchom npm run test:shared-ui-theme i npm run build:shared-ui-theme.
- Sprawdź wizualnie reprezentatywne komponenty w aplikacji demonstracyjnej, gdy infrastruktura istnieje.

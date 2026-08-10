# Instrukcje dla shared-ui-theme

## Odpowiedzialność biblioteki

- Utrzymuj tutaj design tokens, CSS custom properties, kontrakty themingu i wspólne style niezawierające logiki funkcjonalnej.
- Nie uzależniaj publicznego motywu od struktury DOM konkretnego komponentu ani aplikacji.
- Zapewniaj stabilne wartości semantyczne zamiast tokenów nazwanych wyłącznie według konkretnego koloru.

## Dostępność i konfiguracja

- Zapewniaj warianty jasny, ciemny, forced colors/high contrast i reduced motion tam, gdzie dotyczą tokenów.
- Każda domyślna para kolorów musi spełniać WCAG 2.2 AA dla przewidzianego użycia, w tym focus, disabled, error i tekst pomocniczy.
- Tokenizuj spacing, typografię, breakpointy, focus ring, motion i warstwy; pozwalaj konsumentowi bezpiecznie nadpisywać wartości.
- Nie usuwaj widocznego fokusu i nie używaj samego koloru do przekazywania stanu.
- Utrzymuj zgodność z RTL i długimi tłumaczeniami; preferuj logiczne właściwości CSS.

## Testy i dokumentacja

- Testuj publiczne tokeny, wartości domyślne, kontrast, reduced motion, forced colors i stabilność eksportów.
- Dokumentuj sposób instalacji, nadpisania i zakres gwarantowanych tokenów w `README.md`.
- Aktualizuj `CHANGELOG.md` przy każdej zmianie tokenu lub wartości domyślnej; traktuj usunięcie/zmianę nazwy tokenu jako breaking change.
- Weryfikuj przez `npm run test:shared-ui-theme` i `npm run build:shared-ui-theme`.

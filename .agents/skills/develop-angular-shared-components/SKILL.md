---
name: develop-angular-shared-components
description: 'Prowadź zmiany przekrojowe w monorepo Angular 20 z bibliotekami @netdevs/shared-ui-*. Używaj przy dodawaniu lub modyfikowaniu komponentów, publicznego API, zależności, konfiguracji, permissions/claims, dostępności, responsywności, testów, dokumentacji, changelogów, buildów i wydań obejmujących jedną lub więcej bibliotek.'
---

# Rozwijanie Angular Shared Components

## Rozpocznij pracę

1. Przeczytaj główny AGENTS.md oraz package.json, angular.json i tsconfig.json.
2. Określ biblioteki dotknięte zmianą.
3. Dla każdej biblioteki przeczytaj jej AGENTS.md, README.md, CHANGELOG.md, package.json i src/public-api.ts.
4. Zastosuj również odpowiedni skill develop-shared-ui-* dla kodu biblioteki.
5. Sprawdź stan repozytorium i zachowaj niezwiązane zmiany użytkownika.

## Przypisz odpowiedzialność

- Umieszczaj kontrakty przekrojowe i provider-agnostic permissions/claims w shared-ui-core.
- Umieszczaj design tokens i współdzielony theming w shared-ui-theme.
- Umieszczaj dynamiczne formularze, szczegóły i kontrolki w shared-ui-forms.
- Umieszczaj listy, tabele, filtrowanie, paginację i eksport w shared-ui-list.
- Umieszczaj nagłówki, nawigację i menu w shared-ui-layout.
- Umieszczaj dialogi i powiadomienia w shared-ui-feedback.
- Nie twórz zależności cyklicznej ani nie przenoś logiki aplikacyjnej do biblioteki.

## Zaprojektuj zmianę

1. Zdefiniuj publiczny kontrakt, wartości domyślne, błędy i zachowanie brzegowe.
2. Zapewnij pełną konfigurację przez typowane inputs, outputs, modele, tokeny, provider functions lub content projection.
3. Zachowaj standalone components, OnPush, strict TypeScript, tree-shaking, SSR/hydration, i18n i RTL.
4. Oceń wpływ na publiczne eksporty, peer dependencies, bundle, Semantic Versioning i migrację.
5. Nie dodawaj zależności, dopóki istniejące Angular/CDK/Material lub platforma wystarczają. Dopuszczaj wyłącznie bezpłatne licencje zatwierdzone w AGENTS.md.

## Zastosuj permissions i claims

1. Użyj wspólnego kontraktu z shared-ui-core; nie integruj komponentu bezpośrednio z JWT ani konkretnym IdP.
2. Zastosuj deny by default dla brakującego lub nierozstrzygniętego kontekstu.
3. Obsłuż reguły any, all i none oraz typowane wartości claims.
4. Reaguj na zmianę sesji bez ponownego tworzenia komponentu.
5. Pozwól wybrać remove, hidden lub disabled tylko wtedy, gdy każdy wariant ma jasną semantykę i jest dostępny.
6. Zaznacz w dokumentacji, że frontendowa widoczność jest warstwą UX, a backend egzekwuje autoryzację.

## Zapewnij jakość interfejsu

1. Spełnij WCAG 2.2 AA i właściwy wzorzec WAI-ARIA APG.
2. Użyj semantycznego HTML, accessible names, logicznego fokusu i pełnej obsługi klawiatury.
3. Obsłuż małe viewporty od 320 CSS px, reflow przy 400%, zoom, dotyk, reduced motion, forced colors, długie tłumaczenia i RTL.
4. Nie przekazuj znaczenia wyłącznie kolorem, ikoną, ruchem lub położeniem.

## Zbuduj macierz testów

1. Dodaj testy jednostkowe wszystkich stanów, konfiguracji i przypadków brzegowych.
2. Dodaj test host/integracyjny z prawdziwymi bindingami, DI i używanymi integracjami Angular.
3. Sprawdź publiczne API bez deep imports.
4. Sprawdź permissions/claims, reaktywną zmianę kontekstu i deny by default.
5. Sprawdź automatycznie dostępność oraz jawnie semantykę, klawiaturę i focus management.
6. Sprawdź responsywność, długą treść, RTL oraz SSR/hydration, gdy dotyczy.
7. Dodaj test regresyjny dla naprawianego błędu.
8. Dodaj lub zaktualizuj scenariusze Playwright E2E i visual regression w bezpłatnej aplikacji demonstracyjnej. Jeśli infrastruktura jeszcze nie istnieje, zgłoś lukę zamiast uznać test za wykonany.

## Udokumentuj i zweryfikuj

1. Zaktualizuj README każdej zmienionej biblioteki wraz z konfiguracją, przykładami i ograniczeniami.
2. Dodaj wpis do Unreleased w changelogu każdej zmienionej biblioteki oraz do głównego changelogu dla zmiany przekrojowej.
3. Opisz migrację i wymagany wzrost wersji dla breaking change.
4. Uruchom testy i build zmienionych bibliotek; dla zmiany przekrojowej uruchom npm test i npm run build.
5. Uruchom właściwe E2E, visual, accessibility i SSR tests, gdy infrastruktura jest dostępna.
6. Przejrzyj diff, eksporty, licencje, dokumentację i changelogi.
7. Zakończ podaniem wykonanych weryfikacji oraz jawnych luk.

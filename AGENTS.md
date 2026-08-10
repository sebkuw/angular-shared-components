# Instrukcje dla agentów

## Zakres i pierwszeństwo

- Ten plik obowiązuje w całym repozytorium.
- Przed zmianą biblioteki przeczytaj także jej `projects/<library>/AGENTS.md`, `README.md`, `CHANGELOG.md`, `package.json` i `src/public-api.ts`.
- Instrukcje biblioteki uzupełniają ten plik. W razie konfliktu stosuj instrukcję położoną bliżej zmienianego kodu.
- Dla pracy przekrojowej użyj skill `develop-angular-shared-components`; dla pojedynczej biblioteki użyj również odpowiadającego jej skill `develop-shared-ui-*`.
- Nie modyfikuj wygenerowanych katalogów `.angular/`, `dist/` ani `node_modules/`.

## Stos technologiczny i zależności

- Używaj Angular 20, TypeScript zgodnego z wersją zadeklarowaną w repozytorium oraz npm.
- Zachowuj wszystkie opcje strict z głównego `tsconfig.json`; nie wyłączaj kontroli typów, aby obejść błąd.
- Twórz przede wszystkim standalone components. Stosuj `ChangeDetectionStrategy.OnPush` oraz signals/computed/effect, gdy poprawiają przewidywalność stanu.
- Preferuj Angular, przeglądarkowe API oraz już używane Angular CDK/Material zamiast nowych zależności.
- Dopuszczaj tylko bezpłatne zależności open source na licencjach MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause lub ISC. Przed dodaniem zależności sprawdź licencję, aktywność projektu, podatności, rozmiar paczki i zgodność z Angular 20.
- Nie dodawaj płatnych usług, bibliotek wymagających komercyjnej licencji ani zależności produkcyjnej bez wyraźnej zgody użytkownika.
- Zależności Angular używane przez konsumenta deklaruj jako `peerDependencies`. Zachowuj `sideEffects: false`, chyba że biblioteka faktycznie wymaga efektów ubocznych i zostało to udokumentowane.

## Architektura bibliotek

- Projektuj komponenty jako reużywalne, niezależne od konkretnej aplikacji, systemu logowania, endpointów i tekstów domenowych.
- Zapewniaj pełną konfigurację przez silnie typowane inputs, outputs, modele, injection tokens, content projection i provider functions. Dostarczaj bezpieczne, użyteczne wartości domyślne.
- Nie twórz konfiguracji typu `any`, nie używaj niejawnych globali i nie koduj na stałe kolorów, breakpointów, etykiet, formatów dat ani reguł uprawnień.
- Umieszczaj kontrakty i mechanizmy współdzielone przez co najmniej dwie biblioteki w `shared-ui-core`, a design tokens i style przekrojowe w `shared-ui-theme`.
- Eksportuj publiczne elementy wyłącznie przez `src/public-api.ts`. Nie wymagaj deep imports od konsumentów i nie eksportuj szczegółów implementacyjnych.
- Traktuj zmianę publicznych selektorów, typów, wartości domyślnych, inputs, outputs, tokenów, CSS custom properties i eksportów jako zmianę API.
- Zachowuj tree-shaking, brak efektów ubocznych i możliwie mały bundle. Unikaj cyklicznych zależności między bibliotekami.
- Kod korzystający z DOM, `window`, `document`, storage lub media queries musi być bezpieczny dla SSR i hydration.
- Projektuj teksty i układ z myślą o internacjonalizacji, dłuższych tłumaczeniach i kierunku RTL.

## Permissions i claims

- Traktuj frontendową widoczność jako dodatkową warstwę UX. Nigdy nie przedstawiaj jej jako zamiennika backendowej autoryzacji.
- Utrzymuj wspólny, niezależny od dostawcy tożsamości kontrakt permissions/claims w `shared-ui-core`.
- Stosuj zasadę deny by default: brak konfiguracji wymaganych uprawnień może oznaczać element publiczny tylko wtedy, gdy API komponentu deklaruje to jawnie; brak lub nierozstrzygnięty kontekst użytkownika nie może przyznawać dostępu.
- Obsługuj reguły `any`, `all` i `none` oraz claims z typowanym dopasowaniem wartości. Semantyka pustych kolekcji i konfliktujących reguł musi być jednoznaczna i udokumentowana.
- Reaguj na zmianę sesji, permissions i claims bez konieczności ponownego tworzenia komponentu.
- Pozwalaj konfigurować zachowanie niedostępnego elementu, gdy ma to sens: usuń z DOM, ukryj lub wyłącz. Element wyłączony nie może pozostać aktywowalny z klawiatury ani przez zdarzenie programowe.
- Nie ujawniaj w DOM niedostępnych akcji ani poufnych danych, gdy wybrano tryb usunięcia/ukrycia.
- Testuj stan oczekiwania, brak kontekstu, dostęp, odmowę, `any`, `all`, `none`, claims oraz reaktywną zmianę uprawnień.

## Dostępność, klawiatura i responsywność

- Spełniaj WCAG 2.2 na poziomie AA i stosuj właściwe wzorce WAI-ARIA Authoring Practices.
- Preferuj semantyczny HTML. Dodawaj ARIA tylko wtedy, gdy semantyka natywna nie wystarcza, i utrzymuj role, nazwy oraz stany w zgodzie z zachowaniem.
- Każda funkcja dostępna wskaźnikiem musi być dostępna klawiaturą. Zapewniaj logiczną kolejność fokusu, widoczny focus, poprawne Enter/Space/Escape/strzałki zgodnie z wzorcem komponentu oraz przywracanie fokusu po zamknięciu warstwy.
- Nie twórz pułapek klawiaturowych. Nie używaj dodatnich `tabindex` ani klikalnych `div`/`span`, jeżeli istnieje właściwy element natywny.
- Nie przekazuj znaczenia wyłącznie kolorem, ikoną, położeniem lub animacją. Zapewniaj odpowiedni kontrast, dostępne nazwy i komunikaty błędów.
- Obsługuj `prefers-reduced-motion`, forced colors/high contrast, powiększenie 200% i reflow przy 400%.
- Projektuj mobile first, bez nieuzasadnionych stałych szerokości. Komponent ma działać od 320 CSS px, przy dotyku, myszy i klawiaturze, bez utraty treści ani funkcji.
- Używaj elastycznego layoutu i kontenerowych/content-driven breakpointów. Unikaj założeń zależnych od konkretnego urządzenia.

## Wymagane testy

- Do każdego nowego lub zmienianego komponentu dodaj lub zaktualizuj testy jednostkowe jego logiki, wariantów konfiguracji, zdarzeń i stanów brzegowych.
- Dodaj test host/integracyjny obejmujący template binding, content projection, dependency injection oraz współpracę z Angular Forms/Router/CDK, jeśli komponent ich używa.
- Dodaj test kontraktu publicznego API: wymagane symbole muszą być dostępne przez nazwę paczki, bez deep import.
- Dodaj testy permissions/claims zgodnie z sekcją powyżej dla każdego elementu warunkowego.
- Dodaj automatyczne testy dostępności oraz jawne testy semantyki, accessible name, ARIA, focus management i pełnej obsługi klawiatury.
- Dodaj testy responsywności dla istotnych progów, 320 CSS px, powiększenia/reflow i długiej lub przetłumaczonej treści.
- Dodaj testy SSR/hydration dla kodu zależnego od platformy lub renderowania warunkowego.
- Każdy naprawiony błąd musi otrzymać test regresyjny, który nie przechodził przed poprawką.
- Nie opieraj pokrycia wyłącznie na snapshotach i nie usuwaj wartościowych asercji w celu uzyskania zielonego wyniku.
- Utrzymuj bezpłatną aplikację demonstracyjną jako host integracyjny. Realizuj w niej E2E i regresję wizualną przez Playwright dla wszystkich publicznych komponentów, wariantów, stanów permissions, viewportów i interakcji klawiaturowych.
- Jeśli wymaganej aplikacji demonstracyjnej lub warstwy testowej jeszcze nie ma, jawnie wskaż tę lukę; nie deklaruj testu jako wykonanego na podstawie samego testu jednostkowego.

## Dokumentacja i changelog

- Każda biblioteka musi mieć aktualny `README.md` opisujący instalację, publiczne API, konfigurację, przykłady, permissions/claims, dostępność, klawiaturę, responsywność, theming, i18n/RTL, SSR oraz testowanie w zakresie właściwym dla biblioteki.
- Aktualizuj dokumentację w tym samym zadaniu co zmiana zachowania lub publicznego API. Przykłady muszą się kompilować koncepcyjnie i korzystać wyłącznie z publicznych eksportów.
- Utrzymuj główny `CHANGELOG.md` dla zmian przekrojowych, narzędziowych i repozytoryjnych oraz osobny `projects/<library>/CHANGELOG.md` dla każdej biblioteki.
- Stosuj Keep a Changelog i Semantic Versioning. Zapisuj zmiany w `Unreleased` pod `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed` lub `Security`.
- Każde zadanie modyfikujące repozytorium musi zaktualizować co najmniej jeden właściwy changelog. Zmiana obejmująca bibliotekę musi zaktualizować changelog tej biblioteki; zmiana przekrojowa także changelog główny.
- Linkuj właściwy changelog z głównego README i każdego README biblioteki.
- Dla breaking change opisz migrację, poprzednie i nowe zachowanie oraz wymagany wzrost wersji major.

## Weryfikacja i zakończenie pracy

- Uruchom najwęższy test dla zmienionego obszaru podczas iteracji.
- Przed zakończeniem uruchom test każdej zmienionej biblioteki oraz jej build. Dla zmian przekrojowych uruchom `npm test` i `npm run build`.
- Uruchom odpowiednie testy E2E, wizualne, dostępności i SSR, gdy istnieje wymagana infrastruktura i zmiana ich dotyczy.
- Sprawdź `git diff`, publiczne eksporty, dokumentację, changelogi oraz przypadkowe zmiany wygenerowanych plików.
- Nie twierdź, że test przeszedł, jeśli nie został uruchomiony. Podaj dokładnie, czego nie udało się zweryfikować i dlaczego.

## Code Review Rules

- Zgłaszaj jako błąd przyznanie dostępu przy niepełnym kontekście, niespójną semantykę permissions/claims lub sugerowanie, że ukrycie UI zapewnia bezpieczeństwo.
- Zgłaszaj regresje WCAG 2.2 AA, brak pełnej obsługi klawiatury, niewidoczny focus, niepoprawne role/nazwy/stany i niedostępne komunikaty.
- Zgłaszaj nieudokumentowane breaking changes, deep imports, wycieki szczegółów implementacyjnych, płatne lub niezgodne licencyjnie zależności.
- Zgłaszaj zmianę komponentu bez adekwatnych testów, aktualizacji README i wpisu w changelogu.

# Instrukcje dla shared-ui-core

## Odpowiedzialność biblioteki

- Umieszczaj tutaj stabilne, niezależne od UI kontrakty, tokeny, provider functions i pomocniki używane przez co najmniej dwie biblioteki.
- Nie dodawaj Angular Material, Angular CDK ani logiki właściwej jednej bibliotece funkcjonalnej.
- Utrzymuj bibliotekę niezależną od DOM i dostawcy uwierzytelniania, aby działała w przeglądarce, SSR i testach.

## Permissions i claims

- Definiuj tutaj źródło kontekstu uprawnień, typowane modele reguł oraz jeden mechanizm ewaluacji `any`, `all` i `none`.
- Oddzielaj identyfikatory permissions od claims z wartościami. Nie zakładaj formatu JWT ani konkretnego IdP.
- Stosuj deny by default dla niegotowego, brakującego lub błędnego kontekstu.
- Zapewniaj reaktywny, readonly interfejs, który obsłuży logowanie, wylogowanie i zmianę sesji.
- Utrzymuj ewaluator jako czystą funkcję lub łatwo testowalny serwis bez efektów ubocznych.
- Udokumentuj prawdę logiczną dla pustych reguł, priorytet `none` oraz sposób porównywania wartości claims.

## Testy i dokumentacja

- Testuj pełną tablicę prawdy, duplikaty, puste wejścia, nieznane wartości, zmianę kontekstu oraz typowane wartości claims.
- Dodawaj test publicznych providerów, tokenów i eksportów bez deep import.
- Aktualizuj `README.md`, `CHANGELOG.md` i `src/public-api.ts` wraz ze zmianą kontraktu.
- Weryfikuj przez `npm run test:shared-ui-core` i `npm run build:shared-ui-core`.

---
name: develop-shared-ui-core
description: 'Rozwijaj bibliotekę @netdevs/shared-ui-core w Angular 20. Używaj przy zmianach w projects/shared-ui-core, wspólnych kontraktach, injection tokens, provider functions, metadanych paczek oraz mechanizmie widoczności opartym na permissions i claims.'
---

# Rozwijanie Shared UI Core

## Przygotuj kontekst

1. Przeczytaj główny AGENTS.md i projects/shared-ui-core/AGENTS.md.
2. Przeczytaj README.md, CHANGELOG.md, package.json, ng-package.json i src/public-api.ts biblioteki.
3. Ustal, czy kontrakt będzie używany przez co najmniej dwie biblioteki. Jeśli nie, pozostaw go w bibliotece funkcjonalnej.

## Projektuj stabilne kontrakty

- Zachowaj niezależność od Angular Material, CDK, DOM, JWT, endpointów i dostawcy tożsamości.
- Użyj strict TypeScript, readonly danych, typów generycznych i jawnych wartości domyślnych.
- Eksportuj tylko publiczne kontrakty przez src/public-api.ts.
- Nie wprowadzaj efektów ubocznych ani zależności od platformy.
- Traktuj zmianę typu, tokenu, provider function lub semantyki domyślnej jako zmianę publicznego API.

## Implementuj permissions i claims

1. Zdefiniuj provider-agnostic źródło reaktywnego kontekstu użytkownika.
2. Rozdziel permissions od claims z typowanymi wartościami.
3. Zaimplementuj jednoznaczną ewaluację any, all i none.
4. Zastosuj deny by default dla loading, error, braku kontekstu i nieznanych danych.
5. Zdefiniuj semantykę pustych kolekcji, priorytet none, duplikaty i porównywanie wartości.
6. Zapewnij aktualizację po login, logout, refresh i zmianie sesji.
7. Nie sugeruj, że wynik ewaluatora zastępuje backendową autoryzację.

## Testuj i kończ

- Testuj pełną tablicę prawdy, puste i błędne wejścia, typy wartości claims oraz reaktywną zmianę kontekstu.
- Testuj provider functions, injection tokens i import wszystkich publicznych symboli przez nazwę paczki.
- Dodaj test regresyjny dla każdego błędu.
- Zaktualizuj README.md, CHANGELOG.md i src/public-api.ts.
- Uruchom npm run test:shared-ui-core i npm run build:shared-ui-core.
- Sprawdź brak nowych zależności UI, efektów ubocznych i deep imports.

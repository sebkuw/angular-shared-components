/**
 * @interface ColumnVisibilityConfig
 * @description Konfiguracja dla obsługi widoczności kolumn
 * Pozwala na kontrolę, które kolumny są widoczne domyślnie
 */
export interface ColumnVisibilityConfig {
  /**
   * @property hidden
   * @description Czy kolumna jest domyślnie ukryta
   * @default false
   */
  hidden?: boolean;

  /**
   * @property hideable
   * @description Czy użytkownik może zmienić widoczność tej kolumny
   * Niektóre kolumny mogą być zawsze widoczne (np. ID, akcje)
   * @default true
   */
  hideable?: boolean;

  /**
   * @property persistVisibility
   * @description Czy zapisać preferencje widoczności (localStorage, sessionStorage, backend)
   * @default false
   */
  persistVisibility?: boolean;

  /**
   * @property persistKey
   * @description Klucz do zapisania preferencji (np. 'table_users_columns')
   * Używane gdy persistVisibility = true
   */
  persistKey?: string;
}

/**
 * @interface CSVExportConfig
 * @description Elastyczna konfiguracja dla eksportu do CSV
 * Pozwala na pełną kontrolę czy i kiedy button eksportu jest dostępny
 */
export interface CSVExportConfig {
  /**
   * @property enabled
   * @description Czy eksport CSV jest dostępny
   * @default false (wymagana jawna konfiguracja)
   */
  enabled: boolean;

  /**
   * @property filename
   * @description Nazwa pliku do eksportu (bez .csv)
   * Wspiera template variables: {date}, {time}, {timestamp}, {tableName}
   * @example 'users-export-{date}'
   */
  filename?: string;

  /**
   * @property includeFilters
   * @description Czy eksportować tylko filtered data, czy wszystko
   * @default false (eksportuj wszystko)
   */
  includeFilters?: boolean;

  /**
   * @property columns
   * @description Które kolumny eksportować
   * Jeśli undefined, eksportuj wszystkie (oprócz hidden)
   * Jeśli array, eksportuj tylko te kolumny
   * @example ['firstName', 'email', 'status']
   */
  columns?: string[];

  /**
   * @property delimiter
   * @description Delimiter dla CSV (comma, semicolon, tab)
   * @default ','
   */
  delimiter?: ',' | ';' | '\\t';

  /**
   * @property includeHeaders
   * @description Czy dodać nagłówki kolumn
   * @default true
   */
  includeHeaders?: boolean;

  /**
   * @property formatters
   * @description Custom formattery dla kolumn
   * Pozwala na transformację danych w pliku CSV
   * @example { price: (value) => `$${value}`, date: (value) => new Date(value).toLocaleDateString() }
   */
  formatters?: Record<string, (value: unknown) => string>;

  /**
   * @property requiredSelection
   * @description Czy wymagane zaznaczenie wierszy do eksportu
   * Jeśli true, button będzie disabled jeśli nic nie zaznaczone
   * @default false
   */
  requiredSelection?: boolean;

  /**
   * @property maxRecords
   * @description Maksymalna liczba rekordów do eksportu
   * Zapobiega eksportowaniu zbyt dużych plików
   */
  maxRecords?: number;
  access?: AccessRule;
}

/**
 * @interface TableFeatures
 * @description Kontrola dostępnych features w tabeli
 * Pozwala na granularne włączanie/wyłączanie funkcjonalności
 */
export interface TableFeatures {
  /**
   * @property columnVisibility
   * @description Feature do pokazania/ukrycia kolumn
   */
  columnVisibility?: ColumnVisibilityConfig;

  /**
   * @property csvExport
   * @description Feature do eksportu CSV
   */
  csvExport?: CSVExportConfig;

  /**
   * @property filtering
   * @description Czy filtry są dostępne
   * @default true
   */
  filtering?: boolean;

  /**
   * @property sorting
   * @description Czy sortowanie jest dostępne
   * @default true
   */
  sorting?: boolean;

  /**
   * @property selection
   * @description Czy selection checkboxów jest dostępne
   * @default true
   */
  selection?: boolean;

  /**
   * @property pagination
   * @description Czy paginacja jest dostępna
   * @default true
   */
  pagination?: boolean;
  filteringAccess?: AccessRule;
  selectionAccess?: AccessRule;
  columnVisibilityAccess?: AccessRule;
}
import { AccessRule } from '@sebkuw/shared-ui-core';

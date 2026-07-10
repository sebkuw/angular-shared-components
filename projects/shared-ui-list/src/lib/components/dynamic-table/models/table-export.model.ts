import { TableFilter, TableSort } from './dynamic-table.models';

/**
 * @interface ExportRequest
 * @description Żądanie eksportu wysyłane na backend
 * Zawiera wszystkie informacje potrzebne do wygenerowania danych na backendu
 */
export interface ExportRequest {
  /**
   * @property selectedRecordIds
   * @description IDs zaznaczonych rekordów
   * Jeśli ['*ALL*'], export wszystkie (z exclusions)
   * Jeśli ['*ALL*', '!id1', '!id2'], export wszystkie poza exclusions
   */
  selectedRecordIds?: string[];

  /**
   * @property filters
   * @description Aktywne filtry z tabeli
   * Backend stosuje te filtry do danych
   */
  filters: TableFilter[];

  /**
   * @property sort
   * @description Aktualny sort (column, direction)
   * Backend sortuje dane w tej kolejności
   */
  sort: TableSort;

  /**
   * @property visibleColumns
   * @description Nazwy kolumn które user chce eksportować
   * Format: ['firstName', 'email', 'status']
   * Backend eksportuje tylko te kolumny
   */
  visibleColumns: string[];

  /**
   * @property exportConfig
   * @description Konfiguracja eksportu (delimiter, headers, etc.)
   */
  exportConfig: {
    delimiter: ',' | ';' | '\\t';
    includeHeaders: boolean;
    format: 'csv' | 'json' | 'xlsx'; // ← Możliwe rozszerzenie
  };

  /**
   * @property maxRecords
   * @description Limit rekordów do eksportu
   */
  maxRecords?: number;

  /**
   * @property tableName
   * @description Nazwa tabeli (dla logowania na backend'u)
   */
  tableName?: string;
}

/**
 * @interface ExportResponse
 * @description Odpowiedź z backendu
 */
export interface ExportResponse {
  /**
   * @property data
   * @description CSV/JSON string albo binary blob
   */
  data: string | Blob;

  /**
   * @property filename
   * @description Sugerowana nazwa pliku
   */
  filename: string;

  /**
   * @property recordCount
   * @description Ile rekordów zostało wyeksportowanych
   */
  recordCount: number;

  /**
   * @property generatedAt
   * @description Timestamp generacji na backendu
   */
  generatedAt: string;

  /**
   * @property contentType
   * @description MIME type (text/csv, application/json, etc.)
   */
  contentType: string;
}

/**
 * @interface TableExportConfig
 * @description Rozszerzona konfiguracja eksportu
 * Wspiera zarówno frontend jak i backend export
 */
export interface TableExportConfig {
  /**
   * @property enabled
   * @description Czy eksport jest dostępny
   */
  enabled: boolean;

  /**
   * @property mode
   * @description 'frontend' = generuj na frontend'cie
   *             'backend' = wysyłaj request na backend
   *             'auto' = frontend dla małych zbiorów, backend dla dużych
   * @default 'frontend'
   */
  mode?: 'frontend' | 'backend' | 'auto';

  /**
   * @property backendThreshold
   * @description Liczba rekordów powyżej której wysyłamy na backend
   * Używane gdy mode='auto'
   * @default 1000
   */
  backendThreshold?: number;

  /**
   * @property backendEndpoint
   * @description URL dla backend export request
   * Wymagane jeśli mode='backend' lub mode='auto'
   * @example '/api/export'
   */
  backendEndpoint?: string;

  /**
   * @property filename
   * @description Template dla nazwy pliku
   */
  filename?: string;

  /**
   * @property includeFilters
   * @description Czy uwzględniać filtry przy eksporcie
   */
  includeFilters?: boolean;

  /**
   * @property includeSort
   * @description Czy uwzględniać sorting przy eksporcie
   */
  includeSort?: boolean;

  /**
   * @property columns
   * @description Które kolumny eksportować
   */
  columns?: string[];

  /**
   * @property delimiter
   * @description CSV delimiter
   */
  delimiter?: ',' | ';' | '\\t';

  /**
   * @property includeHeaders
   * @description Czy dodać nagłówki
   */
  includeHeaders?: boolean;

  /**
   * @property requiredSelection
   * @description Czy wymagać zaznaczenia wierszy
   */
  requiredSelection?: boolean;

  /**
   * @property maxRecords
   * @description Max rekordów do eksportu
   */
  maxRecords?: number;

  /**
   * @property formatters
   * @description Custom formattery dla kolumn
   */
  formatters?: Record<string, (value: any) => string>;
}

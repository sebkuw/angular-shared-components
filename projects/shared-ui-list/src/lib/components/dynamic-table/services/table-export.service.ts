import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ExportRequest,
  ExportResponse,
  TableExportConfig,
} from '../models/table-export.model';

/**
 * @service TableExportService
 * @description Serwis do obsługi eksportu danych z tabeli
 * Wspiera zarówno frontend jak i backend export
 *
 * Frontend Export:
 * - Generuje CSV na frontend'cie
 * - Szybko ale limitowane wielkością danych
 * - Offline capable
 *
 * Backend Export:
 * - Wysyła request na backend
 * - Backend generuje duże pliki
 * - Może obsługiwać formatowanie i złożone transformacje
 * - Lepszy dla dużych datasetów
 */
@Injectable({
  providedIn: 'root',
})
export class TableExportService {
  constructor(private http: HttpClient) {}

  /**
   * @method export
   * @description Eksportuje dane - automatycznie wybiera frontend/backend
   * @param {ExportRequest} request - Dane do eksportu
   * @param {TableExportConfig} config - Konfiguracja eksportu
   * @returns {Observable<ExportResponse>} Odpowiedź z danymi
   */
  export(
    request: ExportRequest,
    config: TableExportConfig,
  ): Observable<ExportResponse> {
    const mode = this.determineExportMode(request, config);

    if (mode === 'backend') {
      return this.exportViaBackend(request, config);
    } else {
      return this.exportFrontend(request, config);
    }
  }

  /**
   * @private
   * @method determineExportMode
   * @description Określa czy eksportować na frontend'cie czy backend'zie
   */
  private determineExportMode(
    request: ExportRequest,
    config: TableExportConfig,
  ): 'frontend' | 'backend' {
    if (config.mode === 'frontend') return 'frontend';
    if (config.mode === 'backend') return 'backend';

    // Auto mode - oceniaj na podstawie ilości danych
    const threshold = config.backendThreshold || 1000;
    const recordCount = this.estimateRecordCount(request);

    if (recordCount > threshold) {
      return 'backend';
    }
    return 'frontend';
  }

  /**
   * @private
   * @method estimateRecordCount
   * @description Estymuje ilość rekordów do eksportu
   */
  private estimateRecordCount(request: ExportRequest): number {
    if (request.selectedRecordIds) {
      return request.selectedRecordIds.length;
    }
    // Fallback - assume large dataset
    return 10000;
  }

  /**
   * @method exportViaBackend
   * @description Wysyła request eksportu na backend
   * Backend generuje plik i zwraca link/blob
   *
   * @param {ExportRequest} request - Dane request'u
   * @param {TableExportConfig} config - Konfiguracja
   * @returns {Observable<ExportResponse>} Odpowiedź z danymi
   *
   * @example
   * // Backend powinna zwrócić:
   * // {
   * //   data: \"first,last,email\
john,doe,john@...\",
   * //   filename: \"export_2025-11-07.csv\",
   * //   recordCount: 150,
   * //   generatedAt: \"2025-11-07T12:00:00Z\",
   * //   contentType: \"text/csv\"
   * // }
   */
  private exportViaBackend(
    request: ExportRequest,
    config: TableExportConfig,
  ): Observable<ExportResponse> {
    if (!config.backendEndpoint) {
      return throwError(
        () =>
          new Error('Backend endpoint nie jest skonfigurowany dla eksportu'),
      );
    }

    // Przygotuj payload do backendu
    const payload: ExportRequest = {
      selectedRecordIds: request.selectedRecordIds,
      filters: config.includeFilters !== false ? request.filters : [],
      sort:
        config.includeSort !== false
          ? request.sort
          : { column: '', direction: '' },
      visibleColumns: config.columns || request.visibleColumns,
      exportConfig: {
        delimiter: config.delimiter || ',',
        includeHeaders: config.includeHeaders !== false,
        format: 'csv', // Możliwe rozszerzenie na json, xlsx
      },
      maxRecords: config.maxRecords,
      tableName: request.tableName,
    };

    return this.http.post<ExportResponse>(config.backendEndpoint, payload).pipe(
      catchError((error) => {
        console.error('Backend export error:', error);
        return throwError(
          () => new Error(`Backend export failed: ${error.message}`),
        );
      }),
    );
  }

  /**
   * @method exportFrontend
   * @description Generuje CSV na frontend'cie
   * Szybko ale limitowane do aktualnie załadowanych danych
   *
   * @param {ExportRequest} request - Dane do eksportu
   * @param {TableExportConfig} config - Konfiguracja
   * @returns {Observable<ExportResponse>} Odpowiedź z danymi
   */
  private exportFrontend(
    request: ExportRequest,
    config: TableExportConfig,
  ): Observable<ExportResponse> {
    try {
      // To by był data z tabeli - w rzeczywistej implementacji
      // data przychodzi jako parametr
      const csv = this.generateCSV(request, config);
      const filename = this.generateFilename(config.filename);

      const response: ExportResponse = {
        data: csv,
        filename: filename,
        recordCount: this.estimateRecordCount(request),
        generatedAt: new Date().toISOString(),
        contentType: 'text/csv;charset=utf-8;',
      };

      return new Observable((subscriber) => {
        subscriber.next(response);
        subscriber.complete();
      });
    } catch (error) {
      return throwError(() => error);
    }
  }

  /**
   * @private
   * @method generateCSV
   * @description Generuje CSV string z danych
   */
  private generateCSV(
    request: ExportRequest,
    config: TableExportConfig,
  ): string {
    const delimiter = config.delimiter || ',';
    const lines: string[] = [];

    // Dla tego przykładu - generujemy dummy data
    // W rzeczywistości przychodzą dane z tabeli
    const headers = request.visibleColumns;

    if (config.includeHeaders !== false) {
      lines.push(headers.join(delimiter));
    }

    // Dummy data - w rzeczywistości z request.data
    for (let i = 0; i < 10; i++) {
      const row = headers.map((col) => `${col}_value_${i}`);
      lines.push(row.join(delimiter));
    }

    return lines.join(
      '\
',
    );
  }

  /**
   * @private
   * @method generateFilename
   * @description Generuje nazwę pliku z template variables
   */
  private generateFilename(template?: string): string {
    let filename = template || 'export';
    const now = new Date();

    filename = filename.replace('{date}', now.toISOString().split('T')[0]);
    filename = filename.replace(
      '{time}',
      now.toTimeString().split(' ')[0].replace(/:/g, '-'),
    );
    filename = filename.replace('{timestamp}', now.getTime().toString());

    return `${filename}.csv`;
  }

  /**
   * @method downloadFile
   * @description Pobiera plik eksportu (nowoczesne przeglądarki)
   * @param {ExportResponse} response - Odpowiedź z danymi z backendu
   */
  downloadFile(response: ExportResponse): void {
    const blob = new Blob([response.data], { type: response.contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = response.filename;
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}

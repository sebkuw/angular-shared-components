import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExportRequest, ExportResponse, TableExportConfig } from '../models/table-export.model';

@Injectable({ providedIn: 'root' })
export class TableExportService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private readonly http: HttpClient) {}

  export(request: ExportRequest, config: TableExportConfig): Observable<ExportResponse> {
    return this.determineExportMode(request, config) === 'backend'
      ? this.exportViaBackend(request, config)
      : this.exportFrontend(request, config);
  }

  downloadFile(response: ExportResponse): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const blob = new Blob([response.data], { type: response.contentType });
    const url = URL.createObjectURL(blob);
    const link = this.document.createElement('a');

    link.href = url;
    link.download = response.filename;
    link.hidden = true;
    this.document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  private determineExportMode(
    request: ExportRequest,
    config: TableExportConfig,
  ): 'frontend' | 'backend' {
    if (config.mode === 'frontend') {
      return 'frontend';
    }
    if (config.mode === 'backend') {
      return 'backend';
    }

    const threshold = config.backendThreshold ?? 1000;
    return this.estimateRecordCount(request) > threshold ? 'backend' : 'frontend';
  }

  private estimateRecordCount(request: ExportRequest): number {
    if (request.data) {
      return request.data.length;
    }
    if (request.selectedRecordIds && !request.selectedRecordIds.includes('*ALL*')) {
      return request.selectedRecordIds.length;
    }
    return 10000;
  }

  private exportViaBackend(
    request: ExportRequest,
    config: TableExportConfig,
  ): Observable<ExportResponse> {
    if (!config.backendEndpoint) {
      return throwError(() => new Error('A backend endpoint is required for backend export.'));
    }

    const payload: ExportRequest = {
      selectedRecordIds: request.selectedRecordIds,
      filters: config.includeFilters !== false ? request.filters : [],
      sort: config.includeSort !== false ? request.sort : { column: '', direction: '' },
      visibleColumns: config.columns ?? request.visibleColumns,
      exportConfig: {
        delimiter: config.delimiter ?? ',',
        includeHeaders: config.includeHeaders !== false,
        format: 'csv',
      },
      maxRecords: config.maxRecords,
      tableName: request.tableName,
    };

    return this.http
      .post<ExportResponse>(config.backendEndpoint, payload)
      .pipe(
        catchError((error: unknown) =>
          throwError(() => (error instanceof Error ? error : new Error('Backend export failed.'))),
        ),
      );
  }

  private exportFrontend(
    request: ExportRequest,
    config: TableExportConfig,
  ): Observable<ExportResponse> {
    try {
      const data = this.selectRows(request, config);
      return of({
        data: this.generateCsv(data, request.visibleColumns, config),
        filename: this.generateFilename(config.filename),
        recordCount: data.length,
        generatedAt: new Date().toISOString(),
        contentType: 'text/csv;charset=utf-8;',
      });
    } catch (error) {
      return throwError(() => error);
    }
  }

  private selectRows(
    request: ExportRequest,
    config: TableExportConfig,
  ): readonly Readonly<Record<string, unknown>>[] {
    let rows = request.data ?? [];
    const selected = request.selectedRecordIds;

    if (selected?.length && !selected.includes('*ALL*')) {
      const ids = new Set(selected);
      rows = rows.filter((row) => ids.has(String(row['Id'])));
    } else if (selected?.includes('*ALL*')) {
      const excluded = new Set(
        selected.filter((id) => id.startsWith('!')).map((id) => id.slice(1)),
      );
      rows = rows.filter((row) => !excluded.has(String(row['Id'])));
    }

    return rows.slice(0, config.maxRecords ?? rows.length);
  }

  private generateCsv(
    rows: readonly Readonly<Record<string, unknown>>[],
    visibleColumns: readonly string[],
    config: TableExportConfig,
  ): string {
    const delimiter = config.delimiter ?? ',';
    const columns = config.columns ?? [...visibleColumns];
    const lines: string[] = [];

    if (config.includeHeaders !== false) {
      lines.push(columns.map((column) => this.escapeCsv(column, delimiter)).join(delimiter));
    }

    for (const row of rows) {
      lines.push(
        columns
          .map((column) => {
            const value = config.formatters?.[column]
              ? config.formatters[column](row[column])
              : row[column];
            return this.escapeCsv(value, delimiter);
          })
          .join(delimiter),
      );
    }

    return `\uFEFF${lines.join('\r\n')}`;
  }

  private escapeCsv(value: unknown, delimiter: string): string {
    let text = value == null ? '' : String(value);
    if (/^[=+\-@]/.test(text)) {
      text = `'${text}`;
    }
    if (text.includes(delimiter) || /["\r\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  private generateFilename(template?: string): string {
    const now = new Date();
    const filename = (template ?? 'export')
      .replace('{date}', now.toISOString().split('T')[0])
      .replace('{time}', now.toTimeString().split(' ')[0].replace(/:/g, '-'))
      .replace('{timestamp}', String(now.getTime()));
    return filename.endsWith('.csv') ? filename : `${filename}.csv`;
  }
}

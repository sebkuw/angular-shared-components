import { PLATFORM_ID } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TableExportService } from './table-export.service';

describe('TableExportService', () => {
  it('exports real frontend rows and neutralizes spreadsheet formulas', (done) => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    const service = TestBed.inject(TableExportService);

    service
      .export(
        {
          data: [{ Id: 1, name: '=unsafe' }],
          filters: [],
          sort: { column: '', direction: '' },
          visibleColumns: ['Id', 'name'],
          exportConfig: {
            delimiter: ',',
            includeHeaders: true,
            format: 'csv',
          },
        },
        { enabled: true, mode: 'frontend' },
      )
      .subscribe((response) => {
        expect(response.recordCount).toBe(1);
        expect(String(response.data)).toContain("1,'=unsafe");
        done();
      });
  });

  it('does not access browser download APIs during SSR', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: PLATFORM_ID, useValue: 'server' }],
    });
    const service = TestBed.inject(TableExportService);

    expect(() =>
      service.downloadFile({
        data: 'value',
        filename: 'example.csv',
        recordCount: 1,
        generatedAt: '2026-08-10T00:00:00.000Z',
        contentType: 'text/csv',
      }),
    ).not.toThrow();
  });
});

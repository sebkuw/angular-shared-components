import {
  DEFAULT_TABLE_LABELS,
  DynamicTableComponent,
  provideValueFormatterOptions,
  TableExportService,
} from '@netdevs/shared-ui-list';

describe('shared-ui-list public API', () => {
  it('exports table components, services and configuration helpers', () => {
    expect(DynamicTableComponent).toBeDefined();
    expect(TableExportService).toBeDefined();
    expect(DEFAULT_TABLE_LABELS.caption).toBe('Data table');
    expect(provideValueFormatterOptions({ booleanTrue: 'Y' })).toBeDefined();
  });
});

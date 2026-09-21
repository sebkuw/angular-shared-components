import {
  DEFAULT_TABLE_LABELS,
  DynamicTableComponent,
  provideValueFormatterOptions,
  TableExportService,
  type AsyncFilterQueryEvent,
} from '@sebkuw/shared-ui-list';

describe('shared-ui-list public API', () => {
  it('exports table components, services and configuration helpers', () => {
    const asyncQuery: AsyncFilterQueryEvent = { columnName: 'customerId', query: 'acme' };
    expect(DynamicTableComponent).toBeDefined();
    expect(TableExportService).toBeDefined();
    expect(DEFAULT_TABLE_LABELS.caption).toBe('Data table');
    expect(provideValueFormatterOptions({ booleanTrue: 'Y' })).toBeDefined();
    expect(asyncQuery.columnName).toBe('customerId');
  });
});

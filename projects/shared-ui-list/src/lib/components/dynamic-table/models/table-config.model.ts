import { ColumnVisibilityConfig } from './table-features.models';
import { FilterFieldConfig } from './table-filter.model';

/**
 * @interface BaseRow
 * @description A base interface that every row data object passed to the dynamic table
 *              must implement. It ensures that each row has a unique identifier.
 * @property {string} id - The unique identifier for the data row.
 *                                  Using `string | number` provides flexibility for different data sources.
 */
export interface BaseRow {
  /**
   *  Unique row identifier used by selection logic.
   */
  Id: string | number;
}

/**
 * @interface NavigationAction
 * @description Defines navigation behavior when a cell is clicked
 */
export interface NavigationAction {
  type: 'navigate';
  /**
   * @description A function that receives the entire row object and returns a route array
   *              for Angular's router.navigate() method.
   * @param row The data object for the clicked row.
   * @returns An array of path segments for navigation (e.g., ['/details', 123]).
   */
  getRoute: (row: BaseRow) => readonly (string | number)[];
  access?: AccessRule;
}

export type ColumnAction = NavigationAction;

/**
 * @type ColumnType
 * @description Supported column data types for filtering and formatting
 */
export type ColumnType = 'string' | 'int' | 'decimal' | 'date' | 'boolean' | 'enum' | 'guid';

/**
 * @type FilterType
 * @description Defines how select-based filters should be treated
 * - 'enum': Uses enum values (numeric or string keys) for filtering
 * - 'guid': Uses GUID strings for filtering (typically for foreign key relationships)
 */
export type FilterType = 'enum' | 'guid';

/**
 * @interface Column
 * @description Describes a single table column configuration.
 * Defines how data is displayed, filtered, sorted and whether
 * the column can be shown/hidden.
 *
 * @property name Internal field name (must match row property).
 * @property displayName Header text shown in the table.
 * @property type Data type used for formatting and filtering.
 * @property filterable Enables/disables filtering for this column.
 * @property sortable Enables/disables sorting for this column.
 * @property width Optional CSS width (e.g. '150px', '20%').
 * @property format Optional text/number/date format string.
 * @property enumValues Optional mapping for enum display.
 * @property filterType How select filters interpret values ('enum'|'guid').
 * @property action Optional navigation / click action for cell.
 * @property filterFieldConfig Configuration of filter control (type, validators, etc.).
 * @property visibilityConfig Per-column visibility settings (hidden, hideable, persistence).
 * @property valueAccessor Optional function to compute cell value from row.
 */
export interface Column {
  name: string;
  displayName: string;
  type: ColumnType;
  filterable?: boolean;
  sortable?: boolean;
  width?: string;
  format?: string;
  enumValues?: { [key: string]: string };
  filterType?: FilterType;
  action?: ColumnAction;
  filterFieldConfig?: FilterFieldConfig;
  visibilityConfig?: ColumnVisibilityConfig;
  valueAccessor?: (row: BaseRow) => unknown;
  access?: AccessRule;
}

/**
 * @interface CustomButton
 * @description Configuration for custom action buttons in the table toolbar
 */
export interface CustomButton {
  /** Button label text */
  label: string;
  /** Material icon name */
  icon: string;
  /** Callback function executed when button is clicked */
  action: (selectedIds?: string[]) => void;
  /** Only show button when items are selected (default: false) */
  showOnlyWhenSelection?: boolean;
  access?: AccessRule;
  ariaLabel?: string;
}

export interface TableLabels {
  caption: string;
  filterShow: string;
  filterHide: string;
  filterClear: string;
  export: string;
  exportSelectionRequired: string;
  exportInProgress: string;
  columns: string;
  columnsShowAll: string;
  columnsHideAll: string;
  columnsReset: string;
  columnAlwaysVisible: string;
  actions: string;
  selectAll: string;
  selectRow: (id: string) => string;
  selected: (count: number) => string;
  clearSelection: string;
  empty: string;
  loading: string;
  rangeFrom: string;
  rangeTo: string;
  invalidDateRange: string;
  invalidNumberRange: string;
  booleanTrue: string;
  booleanFalse: string;
  booleanAll: string;
  total: (count: number) => string;
  page: (current: number, total: number) => string;
  sortAscending: (column: string) => string;
  sortDescending: (column: string) => string;
  sortNone: (column: string) => string;
}

export const DEFAULT_TABLE_LABELS: TableLabels = {
  caption: 'Data table',
  filterShow: 'Show filters',
  filterHide: 'Hide filters',
  filterClear: 'Clear filters',
  export: 'Export CSV',
  exportSelectionRequired: 'Select rows to export',
  exportInProgress: 'Exporting',
  columns: 'Column visibility',
  columnsShowAll: 'Show all columns',
  columnsHideAll: 'Hide all columns',
  columnsReset: 'Reset column visibility',
  columnAlwaysVisible: 'Always visible',
  actions: 'Actions',
  selectAll: 'Select all rows',
  selectRow: (id) => `Select row ${id}`,
  selected: (count) => `${count} selected`,
  clearSelection: 'Clear selection',
  empty: 'No data to display.',
  loading: 'Loading data',
  rangeFrom: 'From',
  rangeTo: 'To',
  invalidDateRange: 'The start date cannot be after the end date.',
  invalidNumberRange: 'The minimum cannot be greater than the maximum.',
  booleanTrue: 'Yes',
  booleanFalse: 'No',
  booleanAll: 'All',
  total: (count) => `${count} items total`,
  page: (current, total) => `Page ${current} of ${total}`,
  sortAscending: (column) => `${column}, sorted ascending`,
  sortDescending: (column) => `${column}, sorted descending`,
  sortNone: (column) => `${column}, not sorted`,
};
import { AccessRule } from '@sebkuw/shared-ui-core';

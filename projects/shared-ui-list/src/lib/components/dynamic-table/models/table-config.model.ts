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
  getRoute: (row: any) => any[];
}

export type ColumnAction = NavigationAction;

/**
 * @type ColumnType
 * @description Supported column data types for filtering and formatting
 */
export type ColumnType =
  | 'string'
  | 'int'
  | 'decimal'
  | 'date'
  | 'boolean'
  | 'enum'
  | 'guid';

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
  valueAccessor?: (row: any) => any;
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
}

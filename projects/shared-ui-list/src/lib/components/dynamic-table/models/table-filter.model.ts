import type { Signal } from '@angular/core';
import type { ValidatorFn } from '@angular/forms';
import type { AsyncSearchSelectOption } from '@sebkuw/shared-ui-forms';

export type AsyncFilterValue<T> = T | Signal<T>;

export interface AsyncFilterQueryEvent {
  columnName: string;
  query: string;
}

/**
 * @interface FilterFieldConfig
 * @description Configuration for a column's filter field, integrating with the form components system.
 * Allows specifying exactly which type of input/component should be used for filtering each column.
 * This replaces the hardcoded filter logic with a flexible, extensible system.
 *
 * @example
 * // Text filter
 * filterFieldConfig: {
 *   type: 'text',
 *   placeholder: 'Szukaj...',
 *   filterType: 'single'
 * }
 *
 * // Date range filter
 * filterFieldConfig: {
 *   type: 'date',
 *   filterType: 'range',
 *   minDate: new Date('2020-01-01'),
 *   maxDate: new Date()
 * }
 *
 * // Select/enum filter
 * filterFieldConfig: {
 *   type: 'select',
 *   filterType: 'single',
 *   options: [
 *     { key: '0', value: 'Inactive' },
 *     { key: '1', value: 'Active' }
 *   ]
 * }
 */
export interface FilterFieldConfig {
  /**
   * @property type
   * @description Filter field type - matches with form components (text, number, date, select, etc.)
   */
  type: 'text' | 'number' | 'date' | 'select' | 'multi-select' | 'boolean' | 'async-select';

  /**
   * @property filterType
   * @description Determines if filter is single input or range (from/to)
   * - 'single': Single input field (text, select, date)
   * - 'range': Two input fields for range (from/to for dates or numbers)
   */
  filterType: 'single' | 'range';

  /**
   * @property placeholder
   * @description Placeholder text for the filter input
   */
  placeholder?: string | undefined;

  /**
   * @property placeholderFrom
   * @description Placeholder for 'from' field in range filters
   */
  placeholderFrom?: string;

  /**
   * @property placeholderTo
   * @description Placeholder for 'to' field in range filters
   */
  placeholderTo?: string;

  /**
   * @property validators
   * @description Angular validators to apply to the filter field
   */
  validators?: ValidatorFn[];

  /**
   * @property options
   * @description Options for select/multi-select filters
   * @example [{ key: '1', value: 'Active' }, { key: '0', value: 'Inactive' }]
   */
  options?: { key: string; value: string }[];

  /** Remote options for `async-select`. Signals allow results to update without rebuilding columns. */
  asyncOptions?: AsyncFilterValue<readonly AsyncSearchSelectOption[]>;

  /** Loading state for `async-select`. */
  asyncLoading?: AsyncFilterValue<boolean>;

  /** Visible remote-load error for `async-select`. */
  asyncError?: AsyncFilterValue<string | null>;

  /** Debounce applied before the table emits an async-filter query. Defaults to 300 ms. */
  debounceMs?: number;

  /** Localized empty state for `async-select`. */
  emptyText?: string;

  /** Localized loading state for `async-select`. */
  loadingText?: string;
  /**
   * @property minDate
   * @description Minimum date for date range filters
   */
  minDate?: Date;

  /**
   * @property maxDate
   * @description Maximum date for date range filters
   */
  maxDate?: Date;

  /**
   * @property min
   * @description Minimum value for numeric filters
   */
  min?: number;

  /**
   * @property max
   * @description Maximum value for numeric filters
   */
  max?: number;

  /**
   * @property step
   * @description Step increment for numeric filters
   */
  step?: number;

  /**
   * @property isInteger
   * @description If true, only integer values are accepted in numeric filters
   */
  isInteger?: boolean;

  /**
   * @property minLength
   * @description Minimum character length for text filters
   */
  minLength?: number;

  /**
   * @property maxLength
   * @description Maximum character length for text filters
   */
  maxLength?: number;
}

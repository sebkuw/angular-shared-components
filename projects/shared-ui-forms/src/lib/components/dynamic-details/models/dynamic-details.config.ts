/**
 * @description
 * Defines the type of the item in the grid.
 * 'field' - A standard data field with a label and value.
 * 'spacer' - An empty cell used for layout purposes, which will be hidden on mobile.
 */
export type DetailFieldType = 'field' | 'spacer';

/**
 * @description
 * Defines the structure for a single item (field or spacer) to be displayed in the details component.
 */
export interface DetailField {
  /**
   * @property key
   * @description The key of the data object property to display. Required for type 'field'.
   */
  key?: string;

  /**
   * @property label
   * @description The label to display for this field. Required for type 'field'.
   */
  label?: string;

  /**
   * @property render
   * @description An optional function to format the value before displaying.
   * @param value The original value from the data object.
   * @returns The formatted string to be displayed.
   */
  render?: (value: unknown, data: Readonly<Record<string, unknown>>) => string;

  /** Permissions/claims rule used to filter this field. */
  access?: AccessRule;

  /**
   * @property colSpan
   * @description The number of columns this item should span in the grid. Defaults to 1.
   */
  colSpan?: number;

  /**
   * @property type
   * @description The type of the grid item. Use 'spacer' to create an empty cell. Defaults to 'field'.
   */
  type?: DetailFieldType;
}

/**
 * @description
 * Defines the main configuration for the DynamicDetailsComponent.
 */
export interface DetailsConfig {
  /**
   * @property fields
   * @description An array of field and spacer configurations to be displayed.
   */
  fields: DetailField[];

  /**
   * @property columns
   * @description The number of columns for the grid layout on larger screens. Defaults to 2.
   */
  columns?: number;

  ariaLabel?: string;

  actions?: {
    edit?: { visible?: boolean; label?: string; access?: AccessRule };
    remove?: { visible?: boolean; label?: string; access?: AccessRule };
  };
}
import { AccessRule } from '@netdevs/shared-ui-core';

import { ValidatorFn } from '@angular/forms';
import { AccessRule, InaccessibleBehavior } from '@sebkuw/shared-ui-core';

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'select'
  | 'multi-select'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'date'
  | 'file'
  | 'table'
  | 'spacer';

export type FormMode = 'create' | 'edit' | 'always';

export type FormConditionOperator =
  'eq' | 'neq' | 'in' | 'notIn' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'empty' | 'notEmpty';

export interface DynamicFormConfig {
  /**
   * @description Form fields rendered by the dynamic form component.
   */
  fields: DynamicFormField[];

  /**
   * @description Number of CSS Grid columns used by the form layout.
   */
  columns?: number;

  /** Accessible name announced for the form landmark. */
  ariaLabel?: string;

  /** Optional reusable guidance shown above the form fields. */
  guidance?: DynamicFormGuidanceConfig;

  /**
   * @description Optional submit button configuration.
   */
  submitButton?: {
    labelCreate?: string;
    labelEdit?: string;
    position?: 'left' | 'center' | 'right';
    disabled?: boolean;
    ariaLabel?: string;
  };
}

export interface DynamicFormGuidanceConfig {
  /** Shows completion of visible, enabled required fields. Defaults to false. */
  showCompletion?: boolean;
  /** Shows a linked error summary after an invalid submit attempt. Defaults to true. */
  showErrorSummary?: boolean;
  completionLabel?: string;
  errorSummaryTitle?: string;
  errorSummaryDescription?: string;
}

/**
 * @description Defines the configuration for a single field within a dynamic form.
 */
export interface FormField {
  /**
   * @description Unique key used to bind the field to the form control.
   */
  key: string;

  /**
   * @description Visible label displayed for the field.
   */
  label: string;

  /**
   * @description Field type used to select the rendered component.
   */
  type: FormFieldType;

  /**
   * @description Number of grid columns occupied by the field.
   */
  colSpan?: number;

  /**
   * @description Number of grid rows occupied by the field.
   */
  rowSpan?: number;

  /**
   * @description Explicit CSS Grid column start line.
   */
  colStart?: number;

  /**
   * @description Explicit CSS Grid row start line.
   */
  rowStart?: number;

  /**
   * @description Optional CSS class applied to the field wrapper.
   */
  customClass?: string;

  /**
   * @description Optional CSS width value. Prefer grid spans for layout.
   */
  width?: string;

  /**
   * @description Optional CSS max-width value.
   */
  maxWidth?: string;

  /**
   * @description Defines whether a field is rendered as a single value or a range filter.
   */
  filterType?: 'single' | 'range';

  /**
   * @description Angular validators assigned to the field control.
   */
  validators?: ValidatorFn[];

  /**
   * @description Optional custom validation messages mapped by Angular error key.
   */
  errorMessages?: Record<string, string>;

  /**
   * @description Visibility condition evaluated against other field values.
   */
  showWhen?: FormFieldVisibilityLogic;

  /** Central permissions/claims rule. Restricted rules are denied until context is ready. */
  access?: AccessRule;

  /** Whether a denied field is removed or retained as disabled. Defaults to `hide`. */
  inaccessibleBehavior?: InaccessibleBehavior;

  /**
   * @description Required permissions for rendering the field.
   */
  requiredPermissions?: string[];

  /**
   * @description Permission evaluation mode. Defaults to `ALL`.
   */
  permissionLogic?: 'ALL' | 'ANY';

  /**
   * @description Controls visibility in create/edit modes.
   */
  visibleOn?: FormMode;

  /**
   * @description Controls disabled state in create/edit modes.
   */
  disabledOn?: FormMode;

  /**
   * @description Makes the field read-only in edit mode.
   */
  readonlyOnEdit?: boolean;

  /**
   * @description Placeholder displayed inside the control.
   */
  placeholder?: string;

  /** Visible supporting text associated with the rendered control. */
  hint?: string;

  /** Localized text appended to the visible label when the control is required. */
  requiredText?: string;

  /** Accessible name when the visible label is not sufficient. */
  ariaLabel?: string;

  /** Browser autocomplete token, for example `name` or `email`. */
  autocomplete?: string;

  /**
   * @description Allows nullable values in select-like controls.
   */
  isNullable?: boolean;
}

export interface FormFieldText extends FormField {
  type: 'text' | 'email' | 'password';
  maxLength?: number;
}

export interface FormFieldNumber extends FormField {
  type: 'number';
  step?: number;
  min?: number;
  max?: number;
  isInteger?: boolean;
}

export interface FormFieldDate extends FormField {
  type: 'date';
  minDate?: Date;
  maxDate?: Date;
  startView?: 'month' | 'year' | 'multi-year';
}

export interface FormFieldSelect extends FormField {
  type: 'select';
  options: { key: string; value: string }[];
}

export interface FormFieldMultiSelect extends FormField {
  type: 'multi-select';
  options?: { key: string; value: string }[];
}

export interface FormFieldTextarea extends FormField {
  type: 'textarea';
  rows?: number;
  maxLength?: number;
}

export interface FormFieldFile extends FormField {
  type: 'file';
  acceptedFileTypes?: string;
  clearLabel?: string;
}

export interface FormFieldCheckbox extends FormField {
  type: 'checkbox';
}

export interface FormFieldTable extends FormField {
  type: 'table';
  columns: DynamicFormField[];
  minRows?: number;
  maxRows?: number;
  /** Alignment of the add-row action. Defaults to `end`. */
  addActionAlignment?: 'start' | 'end';
  rowIndexLabel?: string;
  addRowLabel?: string;
  removeRowLabel?: (index: number) => string;
}

export interface FormFieldSpacer extends FormField {
  type: 'spacer';
  text?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: string;
  fontWeight?: string | number;
  textColor?: string;
}

/** Strongly typed union of every field supported by DynamicFormComponent. */
export type DynamicFormField =
  | FormFieldText
  | FormFieldNumber
  | FormFieldDate
  | FormFieldSelect
  | FormFieldMultiSelect
  | FormFieldTextarea
  | FormFieldFile
  | FormFieldCheckbox
  | FormFieldTable
  | FormFieldSpacer;

export interface FormFieldCondition {
  /**
   * @description Field key used as the source value in the condition.
   */
  field: string;

  /**
   * @description Comparison operator. Defaults to `eq`.
   */
  operator?: FormConditionOperator;

  /**
   * @description Value used for comparison.
   */
  value?: unknown;
}

export interface FormFieldVisibilityLogic {
  /**
   * @description Conditions that must be evaluated.
   */
  conditions: FormFieldCondition[];

  /**
   * @description Aggregation logic used for all conditions.
   */
  logic: 'AND' | 'OR';
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, startWith, Subscription } from 'rxjs';
import {
  DynamicFormConfig,
  FormField,
  FormFieldCondition,
  FormFieldTable,
  FormFieldVisibilityLogic,
} from '../../models/form-field.interface';
import { CastPipe } from '../../pipes/cast.pipe';
import { FormCheckboxComponent } from '../form-controls/form-checkbox/form-checkbox';
import { FormDateComponent } from '../form-controls/form-date/form-date';
import { FormFileComponent } from '../form-controls/form-file/form-file';
import { FormInputNumberComponent } from '../form-controls/form-input-number/form-input-number';
import { FormInputTextComponent } from '../form-controls/form-input-text/form-input-text';
import { FormMultiSelectComponent } from '../form-controls/form-multi-select/form-multi-select';
import { FormSelectComponent } from '../form-controls/form-select/form-select';
import { FormSpacerComponent } from '../form-controls/form-spacer/form-spacer';
import { FormTableComponent } from '../form-controls/form-table/form-table';
import { FormTextareaComponent } from '../form-controls/form-textarea/form-textarea';

@Component({
  selector: 'shared-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormCheckboxComponent,
    FormDateComponent,
    FormFileComponent,
    FormInputTextComponent,
    FormInputNumberComponent,
    FormMultiSelectComponent,
    FormSpacerComponent,
    FormSelectComponent,
    FormTextareaComponent,
    FormTableComponent,
    CastPipe,
  ],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() config: DynamicFormConfig = { fields: [], columns: 1 };
  @Input() createButtonPosition: 'left' | 'right' | 'center' = 'left';
  @Input() createButtonDisabled = false;
  @Input() isEditMode = false;
  @Input() initialData: Record<string, unknown> | null = null;
  @Input() isSubmitting = false;
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() userPermissions: string[] = [];
  @Output() formSubmit = new EventEmitter<Record<string, unknown>>();

  form: FormGroup = new FormGroup({});
  private formSnapshot: Record<string, unknown> = {};
  private conditionalSubscriptions = new Subscription();

  constructor(private readonly fb: FormBuilder) {}

  /**
   * @description Initializes the form structure, initial values and conditional logic.
   * @returns Void.
   */
  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * @description Rebuilds the form when the configuration changes and patches values when initial data changes.
   * @param changes Angular input changes collection.
   * @returns Void.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.initializeForm();
      return;
    }

    if (changes['initialData'] && this.form) {
      this.patchForm(changes['initialData'].currentValue);
      this.formSnapshot = this.form.getRawValue();
    }
  }

  /**
   * @description Cleans all conditional logic subscriptions.
   * @returns Void.
   */
  ngOnDestroy(): void {
    this.conditionalSubscriptions.unsubscribe();
  }

  /**
   * @description Tracks fields by key to avoid unnecessary DOM recreation.
   * @param _index Field index.
   * @param field Field configuration.
   * @returns Stable track identifier.
   */
  trackByFieldKey(_index: number, field: FormField): string {
    return field.key;
  }

  /**
   * @description Returns CSS Grid placement styles for a field.
   * @param field Field configuration.
   * @returns CSS style map used by ngStyle.
   */
  getFieldStyles(field: FormField): Record<string, string> {
    const styles: Record<string, string> = {
      width: field.width || '100%',
      gridColumn: this.buildGridPlacement(field.colStart, field.colSpan),
      gridRow: this.buildGridPlacement(field.rowStart, field.rowSpan),
    };

    if (field.maxWidth) {
      styles['maxWidth'] = field.maxWidth;
    }

    return styles;
  }

  /**
   * @description Determines whether the field should be rendered.
   * @param field Field configuration.
   * @returns True when the field is visible.
   */
  isFieldVisible(field: FormField): boolean {
    if (!this.checkPermissions(field) || !this.isVisibleForMode(field)) {
      return false;
    }

    if (!field.showWhen) {
      return true;
    }

    return this.evaluateConditions(field.showWhen);
  }

  /**
   * @description Resolves submit button alignment.
   * @returns CSS justify-content value.
   */
  getButtonPosition(): string {
    const configuredPosition =
      this.config.submitButton?.position || this.createButtonPosition;

    switch (configuredPosition) {
      case 'right':
        return 'flex-end';
      case 'center':
        return 'center';
      default:
        return 'flex-start';
    }
  }

  /**
   * @description Resolves submit button label based on the form mode.
   * @returns Submit button label.
   */
  getSubmitButtonLabel(): string {
    if (this.isEditMode) {
      return this.config.submitButton?.labelEdit || 'Aktualizuj';
    }

    return this.config.submitButton?.labelCreate || 'Utwórz';
  }

  /**
   * @description Marks the form as touched and emits raw form values when the form is valid.
   * @returns Void.
   */
  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.formSubmit.emit(this.form.getRawValue());
  }

  /**
   * @description Compares current form values with the initial snapshot.
   * @returns Dictionary containing only changed visible field values.
   */
  getChangedValues(): Record<string, unknown> {
    const changedValues: Record<string, unknown> = {};
    const currentFormValue = this.form.getRawValue();

    for (const field of this.config.fields) {
      if (!this.isFieldVisible(field)) {
        continue;
      }

      if (currentFormValue[field.key] !== this.formSnapshot[field.key]) {
        changedValues[field.key] = currentFormValue[field.key];
      }
    }

    return changedValues;
  }

  /**
   * @description Recreates the form and all conditional subscriptions.
   * @returns Void.
   */
  private initializeForm(): void {
    this.conditionalSubscriptions.unsubscribe();
    this.conditionalSubscriptions = new Subscription();

    this.form = this.buildForm();
    this.formGroup = this.form;
    this.patchForm(this.initialData);
    this.setupConditionalFieldLogic();
    this.applyInitialConditionalState();
    this.formSnapshot = this.form.getRawValue();
  }

  /**
   * @description Builds the reactive form tree from field configuration.
   * @returns Created form group.
   */
  private buildForm(): FormGroup {
    const group = this.fb.group({});

    for (const field of this.config.fields) {
      if (field.type === 'spacer') {
        continue;
      }

      if (this.isTableField(field)) {
        const array = new FormArray<FormGroup>([]);
        const initialRows = this.initialData?.[field.key];

        if (Array.isArray(initialRows)) {
          for (const row of initialRows) {
            array.push(
              this.createTableRowGroup(
                field.columns,
                row as Record<string, unknown>,
              ),
            );
          }
        }

        group.addControl(field.key, array);
        continue;
      }

      group.addControl(
        field.key,
        new FormControl(
          { value: null, disabled: this.shouldBeDisabled(field) },
          this.bindValidators(field.validators),
        ),
      );
    }

    return group;
  }

  /**
   * @description Creates subscriptions for fields that depend on other field values.
   * @returns Void.
   */
  private setupConditionalFieldLogic(): void {
    for (const childField of this.config.fields) {
      if (!childField.showWhen?.conditions.length) {
        continue;
      }

      const parentStreams = childField.showWhen.conditions
        .map((condition) => this.form.get(condition.field))
        .filter((control): control is AbstractControl => !!control)
        .map((control) => control.valueChanges.pipe(startWith(control.value)));

      if (!parentStreams.length) {
        continue;
      }

      const subscription = combineLatest(parentStreams).subscribe(() => {
        this.updateChildFieldState(childField);
      });

      this.conditionalSubscriptions.add(subscription);
    }
  }

  /**
   * @description Applies conditional logic immediately after form creation.
   * @returns Void.
   */
  private applyInitialConditionalState(): void {
    for (const field of this.config.fields) {
      if (field.showWhen) {
        this.updateChildFieldState(field);
      }
    }
  }

  /**
   * @description Updates state of a conditionally visible child control.
   * @param childField Field controlled by showWhen logic.
   * @returns Void.
   */
  private updateChildFieldState(childField: FormField): void {
    const childControl = this.form.get(childField.key);

    if (!childControl) {
      return;
    }

    const shouldBeVisible = this.evaluateConditions(childField.showWhen!);

    if (!shouldBeVisible) {
      childControl.reset(null, { emitEvent: false });
      childControl.clearValidators();
      childControl.disable({ emitEvent: false });
      childControl.updateValueAndValidity({ emitEvent: false });
      return;
    }

    childControl.setValidators(this.bindValidators(childField.validators));

    if (this.shouldBeDisabled(childField)) {
      childControl.disable({ emitEvent: false });
    } else {
      childControl.enable({ emitEvent: false });
    }

    childControl.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * @description Evaluates all visibility conditions.
   * @param visibilityLogic Visibility logic configuration.
   * @returns True when conditions are satisfied.
   */
  private evaluateConditions(
    visibilityLogic: FormFieldVisibilityLogic,
  ): boolean {
    const results = visibilityLogic.conditions.map((condition) =>
      this.evaluateCondition(condition),
    );

    return visibilityLogic.logic === 'AND'
      ? results.every(Boolean)
      : results.some(Boolean);
  }

  /**
   * @description Evaluates a single visibility condition.
   * @param condition Condition configuration.
   * @returns True when the condition is satisfied.
   */
  private evaluateCondition(condition: FormFieldCondition): boolean {
    const currentValue = this.form.get(condition.field)?.value;
    const operator = condition.operator || 'eq';

    switch (operator) {
      case 'eq':
        return currentValue === condition.value;
      case 'neq':
        return currentValue !== condition.value;
      case 'in':
        return (
          Array.isArray(condition.value) &&
          condition.value.includes(currentValue)
        );
      case 'notIn':
        return (
          Array.isArray(condition.value) &&
          !condition.value.includes(currentValue)
        );
      case 'gt':
        return Number(currentValue) > Number(condition.value);
      case 'gte':
        return Number(currentValue) >= Number(condition.value);
      case 'lt':
        return Number(currentValue) < Number(condition.value);
      case 'lte':
        return Number(currentValue) <= Number(condition.value);
      case 'contains':
        return Array.isArray(currentValue)
          ? currentValue.includes(condition.value)
          : String(currentValue ?? '').includes(String(condition.value ?? ''));
      case 'empty':
        return (
          currentValue === null ||
          currentValue === undefined ||
          currentValue === ''
        );
      case 'notEmpty':
        return !(
          currentValue === null ||
          currentValue === undefined ||
          currentValue === ''
        );
      default:
        return false;
    }
  }

  /**
   * @description Checks whether the field is visible in the current form mode.
   * @param field Field configuration.
   * @returns True when the mode allows rendering.
   */
  private isVisibleForMode(field: FormField): boolean {
    const visibility = field.visibleOn || 'always';

    return this.isEditMode
      ? visibility === 'edit' || visibility === 'always'
      : visibility === 'create' || visibility === 'always';
  }

  /**
   * @description Checks user permissions required by the field.
   * @param field Field configuration.
   * @returns True when the user has required permissions.
   */
  private checkPermissions(field: FormField): boolean {
    const requiredPermissions = field.requiredPermissions;
    const permissionLogic = field.permissionLogic || 'ALL';

    if (!requiredPermissions?.length) {
      return true;
    }

    return permissionLogic === 'ANY'
      ? requiredPermissions.some((permission) =>
          this.userPermissions.includes(permission),
        )
      : requiredPermissions.every((permission) =>
          this.userPermissions.includes(permission),
        );
  }

  /**
   * @description Determines whether a field should start disabled.
   * @param field Field configuration.
   * @returns True when the field should be disabled.
   */
  private shouldBeDisabled(field: FormField): boolean {
    return (
      field.disabledOn === 'always' ||
      (field.disabledOn === 'create' && !this.isEditMode) ||
      (field.disabledOn === 'edit' && this.isEditMode) ||
      (!!field.readonlyOnEdit && this.isEditMode)
    );
  }

  /**
   * @description Converts optional validators to an array accepted by Angular.
   * @param validators Validators collection.
   * @returns Validators array.
   */
  private bindValidators(validators?: ValidatorFn[]): ValidatorFn[] {
    return validators || [];
  }

  /**
   * @description Patches initial form data without triggering conditional value streams.
   * @param data Initial values.
   * @returns Void.
   */
  private patchForm(data: Record<string, unknown> | null | undefined): void {
    if (!data) {
      return;
    }

    for (const field of this.config.fields) {
      if (!this.isTableField(field)) {
        continue;
      }

      const value = data[field.key];
      const array = this.form.get(field.key);

      if (!(array instanceof FormArray) || !Array.isArray(value)) {
        continue;
      }

      array.clear({ emitEvent: false });

      for (const row of value) {
        array.push(
          this.createTableRowGroup(
            field.columns,
            row as Record<string, unknown>,
          ),
          { emitEvent: false },
        );
      }
    }

    this.form.patchValue(data, { emitEvent: false });
  }

  /**
   * @description Creates a table row group used when initializing table values.
   * @param columns Table column configuration.
   * @param value Optional row value.
   * @returns Created table row form group.
   */
  private createTableRowGroup(
    columns: FormField[],
    value?: Record<string, unknown>,
  ): FormGroup {
    const group = new FormGroup({});

    for (const column of columns) {
      if (column.type === 'spacer' || column.type === 'table') {
        continue;
      }

      group.addControl(
        column.key,
        new FormControl(
          {
            value: value?.[column.key] ?? null,
            disabled: this.shouldBeDisabled(column),
          },
          this.bindValidators(column.validators),
        ),
      );
    }

    return group;
  }

  /**
   * @description Builds CSS Grid placement string.
   * @param start Optional explicit start line.
   * @param span Optional span length.
   * @returns CSS grid placement value.
   */
  private buildGridPlacement(start?: number, span?: number): string {
    const resolvedSpan = span || 1;

    if (start) {
      return `${start} / span ${resolvedSpan}`;
    }

    return `span ${resolvedSpan}`;
  }

  /**
   * @description Checks whether the provided field is a table field.
   * @param field Field configuration.
   * @returns True when the field is a table field.
   */
  private isTableField(field: FormField): field is FormFieldTable {
    return field.type === 'table';
  }
}

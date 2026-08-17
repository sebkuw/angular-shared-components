import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IconButtonComponent } from '@sebkuw/shared-ui-primitives';
import { FormField, FormFieldTable } from '../../../models/form-field.interface';
import { CastPipe } from '../../../pipes/cast.pipe';
import { FormInputNumberComponent } from '../form-input-number/form-input-number';
import { FormInputTextComponent } from '../form-input-text/form-input-text';
import { FormSelectComponent } from '../form-select/form-select';

@Component({
  selector: 'shared-form-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    IconButtonComponent,
    FormInputTextComponent,
    FormInputNumberComponent,
    FormSelectComponent,
    CastPipe,
  ],
  templateUrl: './form-table.html',
  styleUrl: './form-table.scss',
})
export class FormTableComponent implements OnInit, OnChanges {
  @Input({ required: true }) field!: FormFieldTable;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() isEditMode = false;

  tableArray!: FormArray<FormGroup>;

  /**
   * @description Initializes table FormArray and creates minimum rows.
   * @returns Void.
   */
  ngOnInit(): void {
    this.initializeTableArray();
  }

  /**
   * @description Reinitializes the table when field configuration changes.
   * @param changes Angular changes collection.
   * @returns Void.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field'] && !changes['field'].firstChange) {
      this.initializeTableArray();
    }
  }

  /**
   * @description Returns row form groups.
   * @returns Table row form groups.
   */
  get rows(): FormGroup[] {
    return this.tableArray?.controls as FormGroup[];
  }

  /**
   * @description Checks whether the add row button should be disabled.
   * @returns True when maxRows limit has been reached.
   */
  get addDisabled(): boolean {
    return !!this.field.maxRows && this.rows.length >= this.field.maxRows;
  }

  /**
   * @description Returns a table cell control when it exists and is a FormControl.
   * @param rowGroup Row group.
   * @param colKey Column field key.
   * @returns FormControl or null.
   */
  getFormControl(rowGroup: FormGroup, colKey: string): FormControl | null {
    const control = rowGroup.get(colKey);
    return control instanceof FormControl ? control : null;
  }

  /**
   * @description Adds a new table row if maxRows is not reached.
   * @returns Void.
   */
  addRow(): void {
    if (this.addDisabled) {
      return;
    }

    this.tableArray.push(this.createRowGroup());
    this.tableArray.markAsDirty();
    this.tableArray.updateValueAndValidity();
  }

  /**
   * @description Removes a row if minRows is not violated.
   * @param index Row index to remove.
   * @returns Void.
   */
  removeRow(index: number): void {
    if (this.rows.length <= (this.field.minRows || 1)) {
      return;
    }

    this.tableArray.removeAt(index);
    this.tableArray.markAsDirty();
    this.tableArray.updateValueAndValidity();
  }

  /**
   * @description Initializes the FormArray assigned to the table field.
   * @returns Void.
   */
  private initializeTableArray(): void {
    const existingControl = this.formGroup.get(this.field.key);

    if (existingControl instanceof FormArray) {
      this.tableArray = existingControl as FormArray<FormGroup>;
    } else {
      this.tableArray = new FormArray<FormGroup>([]);
      this.formGroup.setControl(this.field.key, this.tableArray);
    }

    const minRows = this.field.minRows || 1;

    while (this.tableArray.length < minRows) {
      this.tableArray.push(this.createRowGroup());
    }
  }

  /**
   * @description Creates a new row group based on table columns.
   * @returns New row form group.
   */
  private createRowGroup(): FormGroup {
    const group = new FormGroup({});

    for (const column of this.field.columns) {
      if (column.type === 'spacer' || column.type === 'table') {
        continue;
      }

      group.addControl(
        column.key,
        new FormControl(
          { value: null, disabled: this.shouldBeDisabled(column) },
          column.validators || [],
        ),
      );
    }

    return group;
  }

  /**
   * @description Determines whether a column should be disabled.
   * @param field Column field configuration.
   * @returns True when the column control should be disabled.
   */
  private shouldBeDisabled(field: FormField): boolean {
    return (
      field.disabledOn === 'always' ||
      (field.disabledOn === 'create' && !this.isEditMode) ||
      (field.disabledOn === 'edit' && this.isEditMode) ||
      (!!field.readonlyOnEdit && this.isEditMode)
    );
  }
}

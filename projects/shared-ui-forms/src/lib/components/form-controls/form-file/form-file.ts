import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent, IconButtonComponent } from '@sebkuw/shared-ui-primitives';
import { FormFieldFile } from '../../../models/form-field.interface';
import { FormFieldBaseComponent } from '../form-field-base.component';

@Component({
  selector: 'shared-form-file',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    ButtonComponent,
    IconButtonComponent,
  ],
  templateUrl: './form-file.html',
  styleUrl: './form-file.scss',
})
export class FormFileComponent
  extends FormFieldBaseComponent<FormFieldFile>
  implements OnInit, OnChanges
{
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileName: string | null = null;

  /**
   * @description Applies field state after initialization.
   * @returns Void.
   */
  ngOnInit(): void {
    this.applyDisabledState();
    this.syncFileNameFromControl();
  }

  /**
   * @description Reapplies field state when edit mode or field configuration changes.
   * @param changes Angular changes collection.
   * @returns Void.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEditMode'] || changes['field']) {
      this.applyDisabledState();
    }
  }

  /**
   * @description Returns the reactive form control assigned to this field.
   * @returns Form control or null.
   */
  get control(): AbstractControl | null {
    return this.getControl();
  }

  /**
   * @description Resolves Material color based on validation state.
   * @returns Material theme color.
   */
  get color(): 'primary' | 'warn' {
    return this.getControlColor();
  }

  /**
   * @description Returns true when the file field is disabled.
   * @returns True when the field is disabled.
   */
  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  /**
   * @description Handles file selection and writes the selected File object to the form control.
   * @param event Native file input change event.
   * @returns Void.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) ?? null;

    this.fileName = file?.name ?? null;
    this.control?.setValue(file);
    this.control?.markAsTouched();
    this.control?.updateValueAndValidity();
  }

  /**
   * @description Clears the selected file from the input and form control.
   * @returns Void.
   */
  clearFile(): void {
    this.fileName = null;
    this.control?.setValue(null);
    this.control?.markAsTouched();
    this.control?.updateValueAndValidity();

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  /**
   * @description Returns the first matching validation message.
   * @returns Validation message.
   */
  getErrorMessage(): string {
    return this.resolveErrorMessage();
  }

  /**
   * @description Synchronizes displayed file name from an existing File value.
   * @returns Void.
   */
  private syncFileNameFromControl(): void {
    const value = this.control?.value;
    this.fileName = value instanceof File ? value.name : null;
  }
}

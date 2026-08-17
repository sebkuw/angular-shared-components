import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormFieldTextarea } from '../../../models/form-field.interface';
import { FormFieldBaseComponent } from '../form-field-base.component';

@Component({
  selector: 'shared-form-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss',
})
export class FormTextareaComponent
  extends FormFieldBaseComponent<FormFieldTextarea>
  implements OnInit, OnChanges
{
  /**
   * @description Applies field state after initialization.
   * @returns Void.
   */
  ngOnInit(): void {
    this.applyDisabledState();
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
   * @description Returns the first matching validation message.
   * @returns Validation message.
   */
  getErrorMessage(): string {
    return this.resolveErrorMessage();
  }
}

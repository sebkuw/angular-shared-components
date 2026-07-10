import { Directive, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FormField } from '../../models/form-field.interface';

@Directive()
export abstract class FormFieldBaseComponent<
  TField extends FormField = FormField,
> {
  @Input({ required: true }) field!: TField;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() isEditMode = false;

  /**
   * @description Returns the form control assigned to the current field.
   * @returns The form control instance or null when the control does not exist.
   */
  protected getControl(): AbstractControl | null {
    return this.formGroup.get(this.field.key);
  }

  /**
   * @description Applies disabled rules based on field configuration and current mode.
   * @returns Void.
   */
  protected applyDisabledState(): void {
    const control = this.getControl();

    if (!control) {
      return;
    }

    const shouldDisable =
      this.field.disabledOn === 'always' ||
      (this.field.disabledOn === 'create' && !this.isEditMode) ||
      (this.field.disabledOn === 'edit' && this.isEditMode) ||
      (this.field.readonlyOnEdit && this.isEditMode);

    shouldDisable
      ? control.disable({ emitEvent: false })
      : control.enable({ emitEvent: false });
  }

  /**
   * @description Resolves Material color based on validation state.
   * @returns Material color.
   */
  protected getControlColor(): 'primary' | 'warn' {
    const control = this.getControl();
    return control && control.touched && control.invalid ? 'warn' : 'primary';
  }

  /**
   * @description Resolves validation message for the active error.
   * @returns Validation message.
   */
  protected resolveErrorMessage(): string {
    const control = this.getControl();

    if (!control?.errors || !control.touched) {
      return '';
    }

    const firstErrorKey = Object.keys(control.errors)[0];

    if (this.field.errorMessages?.[firstErrorKey]) {
      return this.field.errorMessages[firstErrorKey];
    }

    switch (firstErrorKey) {
      case 'required':
        return 'This field is required.';
      case 'email':
        return 'Please enter a valid email address.';
      case 'minlength':
        return `Minimum length is ${control.errors['minlength'].requiredLength}.`;
      case 'maxlength':
        return `Maximum length is ${control.errors['maxlength'].requiredLength}.`;
      case 'matDatepickerParse':
        return 'Invalid date format.';
      case 'matDatepickerMin':
        return 'Date is earlier than allowed.';
      case 'matDatepickerMax':
        return 'Date is later than allowed.';
      default:
        return 'Validation error.';
    }
  }
}

import { AbstractControl } from '@angular/forms';

export function resolveFormErrorMessage(
  control: AbstractControl,
  messages?: Readonly<Record<string, string>>,
): string {
  const firstErrorKey = Object.keys(control.errors ?? {})[0];
  if (!firstErrorKey) {
    return '';
  }

  if (messages?.[firstErrorKey]) {
    return messages[firstErrorKey];
  }

  switch (firstErrorKey) {
    case 'required':
    case 'requiredTrue':
      return 'This field is required.';
    case 'email':
      return 'Please enter a valid email address.';
    case 'minlength':
      return `Minimum length is ${control.errors?.['minlength']?.requiredLength}.`;
    case 'maxlength':
      return `Maximum length is ${control.errors?.['maxlength']?.requiredLength}.`;
    case 'min':
      return `Minimum value is ${control.errors?.['min']?.min}.`;
    case 'max':
      return `Maximum value is ${control.errors?.['max']?.max}.`;
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

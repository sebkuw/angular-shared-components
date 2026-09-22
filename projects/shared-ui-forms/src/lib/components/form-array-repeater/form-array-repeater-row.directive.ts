import { Directive, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface FormArrayRepeaterRowContext {
  $implicit: FormGroup;
  row: FormGroup;
  index: number;
  controlId: (controlName: string) => string;
}

@Directive({
  selector: 'ng-template[sharedFormArrayRepeaterRow]',
  standalone: true,
})
export class FormArrayRepeaterRowDirective {
  constructor(readonly templateRef: TemplateRef<FormArrayRepeaterRowContext>) {}

  static ngTemplateContextGuard(
    _directive: FormArrayRepeaterRowDirective,
    context: unknown,
  ): context is FormArrayRepeaterRowContext {
    return true;
  }
}

import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'shared-stepper-step',
  standalone: true,
  template: `
    <ng-template #stepContent>
      <ng-content />
    </ng-template>
  `,
})
export class StepperStepComponent {
  @Input({ required: true }) label!: string;
  @Input() stepControl?: AbstractControl;
  @Input() completed = false;
  @Input() optional = false;
  @Input() editable = true;
  @Input() errorMessage?: string;

  @ViewChild('stepContent', { static: true }) readonly content!: TemplateRef<unknown>;
}

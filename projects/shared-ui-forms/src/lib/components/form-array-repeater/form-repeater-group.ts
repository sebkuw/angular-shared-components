import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'shared-form-repeater-group',
  standalone: true,
  template: `
    <fieldset class="shared-form-repeater-group">
      <legend>{{ label }}</legend>
      <div class="shared-form-repeater-group__content">
        <ng-content />
      </div>
    </fieldset>
  `,
  styleUrl: './form-repeater-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRepeaterGroupComponent {
  @Input({ required: true }) label!: string;
}

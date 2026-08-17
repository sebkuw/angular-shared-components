import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'shared-field-label',
  standalone: true,
  templateUrl: './field-label.html',
  styleUrl: './field-label.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldLabelComponent {
  @Input({ required: true }) forId!: string;
  @Input({ required: true }) text!: string;
  @Input() required = false;
  @Input() requiredText = 'Required';
  @Input() disabled = false;
}

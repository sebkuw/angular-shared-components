import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FieldLabelComponent } from '@sebkuw/shared-ui-primitives';

export type CharacterCountFormatter = (currentLength: number, maxLength: number) => string;

@Component({
  selector: 'shared-form-field-shell',
  standalone: true,
  imports: [FieldLabelComponent],
  templateUrl: './form-field-shell.html',
  styleUrl: './form-field-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldShellComponent {
  @Input({ required: true }) controlId!: string;
  @Input({ required: true }) label!: string;
  @Input() showLabel = true;
  @Input() required = false;
  @Input() requiredText = 'Required';
  @Input() hint?: string;
  @Input() error?: string;
  @Input() currentLength?: number;
  @Input() maxLength?: number;
  @Input() characterCountFormatter: CharacterCountFormatter = (currentLength, maxLength) =>
    `${currentLength} of ${maxLength} characters`;

  get labelId(): string {
    return `${this.controlId}-label`;
  }

  get hintId(): string {
    return `${this.controlId}-hint`;
  }

  get errorId(): string {
    return `${this.controlId}-error`;
  }

  get characterCountId(): string {
    return `${this.controlId}-character-count`;
  }

  get describedBy(): string | null {
    const ids = [
      this.hint ? this.hintId : null,
      this.error ? this.errorId : null,
      this.hasCharacterCount ? this.characterCountId : null,
    ].filter((id): id is string => !!id);

    return ids.length ? ids.join(' ') : null;
  }

  get hasCharacterCount(): boolean {
    return this.currentLength !== undefined && this.maxLength !== undefined;
  }

  get characterCountText(): string {
    return this.characterCountFormatter(this.currentLength ?? 0, this.maxLength ?? 0);
  }
}

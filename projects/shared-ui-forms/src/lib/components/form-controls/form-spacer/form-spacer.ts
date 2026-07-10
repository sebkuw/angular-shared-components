import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormFieldSpacer } from '../../../models/form-field.interface';

@Component({
  selector: 'shared-form-spacer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-spacer.html',
  styleUrl: './form-spacer.scss',
})
export class FormSpacerComponent {
  @Input({ required: true }) field!: FormFieldSpacer;
  @Input() formGroup?: FormGroup;

  /**
   * @description Checks whether the spacer should render text content.
   * @returns True when the text property contains a non-empty value.
   */
  get hasText(): boolean {
    return !!this.field.text?.trim();
  }

  /**
   * @description Builds inline styles for the spacer content.
   * @returns CSS style map.
   */
  get spacerStyles(): Record<string, string> {
    const styles: Record<string, string> = {};

    if (this.field.maxWidth) {
      styles['max-width'] = this.field.maxWidth;
    }

    if (!this.hasText) {
      return styles;
    }

    styles['text-align'] = this.field.textAlign || 'left';

    if (this.field.fontSize) {
      styles['font-size'] = this.field.fontSize;
    }

    if (this.field.fontWeight !== undefined) {
      styles['font-weight'] = String(this.field.fontWeight);
    }

    if (this.field.textColor) {
      styles['color'] = this.field.textColor;
    }

    return styles;
  }

  /**
   * @description Resolves optional container width.
   * @returns CSS width or undefined.
   */
  get containerWidth(): string | undefined {
    return this.field.width;
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DetailField, DetailsConfig } from './models/dynamic-details.config';

@Component({
  selector: 'shared-dynamic-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dynamic-details.html',
  styleUrls: ['./dynamic-details.scss'],
})
export class DynamicDetailsComponent {
  /**
   * @Input data
   * @description The data object to display details for.
   */
  @Input() data: any = {};

  /**
   * @Input config
   * @description The configuration object that defines which fields to display and how.
   */
  @Input() config: DetailsConfig = { fields: [], columns: 2 };

  /**
   * @Output edit
   * @description Emits when the edit button is clicked.
   */
  @Output() edit = new EventEmitter<void>();

  /**
   * @Output remove
   * @description Emits when the delete button is clicked.
   */
  @Output() remove = new EventEmitter<void>();

  /**
   * @method getFieldValue
   * @description Retrieves and optionally formats the value for a given field.
   * It uses the 'render' function from the field config if provided.
   * @param field The field configuration.
   * @returns The value to be displayed.
   */
  getFieldValue(field: DetailField): any {
    if (!field.key || !this.data.hasOwnProperty(field.key)) {
      return '';
    }
    const value = this.data[field.key];
    return field.render ? field.render(value) : value;
  }

  /**
   * @method onEditClick
   * @description Handles the click event for the edit button and emits the 'edit' event.
   */
  onEditClick(): void {
    this.edit.emit();
  }

  /**
   * @method onRemoveClick
   * @description Handles the click event for the delete button and emits the 'remove' event.
   */
  onRemoveClick(): void {
    this.remove.emit();
  }
}

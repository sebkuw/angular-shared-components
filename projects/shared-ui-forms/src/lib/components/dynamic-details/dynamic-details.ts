import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  AccessRule,
  EMPTY_PERMISSION_CONTEXT,
  evaluateAccess,
  PermissionService,
  PUBLIC_ACCESS_RULE,
} from '@sebkuw/shared-ui-core';
import { DetailField, DetailsConfig } from './models/dynamic-details.config';

@Component({
  selector: 'shared-dynamic-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dynamic-details.html',
  styleUrls: ['./dynamic-details.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicDetailsComponent {
  private readonly permissionService: Pick<PermissionService, 'canAccess'>;

  constructor(@Optional() permissionService?: PermissionService) {
    this.permissionService = permissionService ?? {
      canAccess: (rule) => evaluateAccess(rule, EMPTY_PERMISSION_CONTEXT),
    };
  }
  /**
   * @Input data
   * @description The data object to display details for.
   */
  @Input() data: Readonly<Record<string, unknown>> = {};

  /**
   * @Input config
   * @description The configuration object that defines which fields to display and how.
   */
  @Input() config: DetailsConfig = { fields: [], columns: 2 };
  @Input() access: AccessRule = PUBLIC_ACCESS_RULE;

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
  getFieldValue(field: DetailField): unknown {
    if (!field.key || !Object.prototype.hasOwnProperty.call(this.data, field.key)) {
      return '';
    }
    const value = this.data[field.key];
    return field.render ? field.render(value, this.data) : value;
  }

  canAccess(rule: AccessRule | undefined): boolean {
    return this.permissionService.canAccess(rule ?? PUBLIC_ACCESS_RULE);
  }

  isFieldVisible(field: DetailField): boolean {
    return field.type === 'spacer' || this.canAccess(field.access);
  }

  isActionVisible(action: 'edit' | 'remove'): boolean {
    const config = this.config.actions?.[action];
    return config?.visible !== false && this.canAccess(config?.access);
  }

  getActionLabel(action: 'edit' | 'remove'): string {
    return (
      this.config.actions?.[action]?.label ?? (action === 'edit' ? 'Edit item' : 'Remove item')
    );
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

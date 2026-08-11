import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Optional, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  AccessRule,
  EMPTY_PERMISSION_CONTEXT,
  evaluateAccess,
  PermissionService,
  PUBLIC_ACCESS_RULE,
} from '@sebkuw/shared-ui-core';

export interface InfoDialogData {
  title: string;
  content: string;
  confirmationBtnText?: string;
  confirmationAriaLabel?: string;
  contentTemplate?: TemplateRef<unknown>;
  confirmationAccess?: AccessRule;
}

@Component({
  selector: 'shared-info-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './info-dialog.html',
  styleUrl: './info-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoDialogComponent {
  private readonly permissionService: Pick<PermissionService, 'canAccess'>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InfoDialogData,
    @Optional() permissionService?: PermissionService,
  ) {
    this.permissionService = permissionService ?? {
      canAccess: (rule) => evaluateAccess(rule, EMPTY_PERMISSION_CONTEXT),
    };
  }

  canConfirm(): boolean {
    return this.permissionService.canAccess(this.data.confirmationAccess ?? PUBLIC_ACCESS_RULE);
  }
}

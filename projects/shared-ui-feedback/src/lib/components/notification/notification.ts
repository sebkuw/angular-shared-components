import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import {
  AccessRule,
  EMPTY_PERMISSION_CONTEXT,
  evaluateAccess,
  PermissionService,
  PUBLIC_ACCESS_RULE,
} from '@sebkuw/shared-ui-core';

// The "contract" for the data our notification component will receive
export interface NotificationData {
  message: string;
  type: 'success' | 'error' | 'info';
  dismissLabel?: string;
  action?: {
    label: string;
    access?: AccessRule;
  };
}

@Component({
  selector: 'shared-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  private readonly permissionService: Pick<PermissionService, 'canAccess'>;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationData,
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Optional() permissionService?: PermissionService,
  ) {
    this.permissionService = permissionService ?? {
      canAccess: (rule) => evaluateAccess(rule, EMPTY_PERMISSION_CONTEXT),
    };
  }

  get ariaLive(): 'assertive' | 'polite' {
    return this.data.type === 'error' ? 'assertive' : 'polite';
  }

  get role(): 'alert' | 'status' {
    return this.data.type === 'error' ? 'alert' : 'status';
  }

  canShowAction(): boolean {
    return (
      !!this.data.action &&
      this.permissionService.canAccess(this.data.action.access ?? PUBLIC_ACCESS_RULE)
    );
  }

  // A getter to return the correct icon based on the notification type
  get iconName(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'notifications';
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

// The "contract" for the data our notification component will receive
export interface NotificationData {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'shared-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class NotificationComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationData,
    public snackBarRef: MatSnackBarRef<NotificationComponent>
  ) {}

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

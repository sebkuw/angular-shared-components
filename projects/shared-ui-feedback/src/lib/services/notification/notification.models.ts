import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NotificationData } from '../../components/notification/notification';

export type NotificationType = NotificationData['type'];

export interface NotificationDefaults {
  readonly durations: Readonly<Record<NotificationType, number | undefined>>;
  readonly horizontalPosition: MatSnackBarHorizontalPosition;
  readonly verticalPosition: MatSnackBarVerticalPosition;
  readonly dismissLabel: string;
}

export interface NotificationOptions {
  readonly duration?: number;
  readonly horizontalPosition?: MatSnackBarHorizontalPosition;
  readonly verticalPosition?: MatSnackBarVerticalPosition;
  readonly dismissLabel?: string;
  readonly action?: NotificationData['action'];
  readonly panelClass?: string | readonly string[];
}

export interface NotificationRequest extends NotificationOptions {
  readonly message: string;
  readonly type: NotificationType;
}

export const DEFAULT_NOTIFICATION_OPTIONS: NotificationDefaults = {
  durations: {
    success: 5000,
    info: 7000,
    error: undefined,
  },
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  dismissLabel: 'Dismiss notification',
};

export interface NotificationDefaultsOverride extends Partial<
  Omit<NotificationDefaults, 'durations'>
> {
  readonly durations?: Partial<NotificationDefaults['durations']>;
}

export function mergeNotificationDefaults(
  override: NotificationDefaultsOverride,
): NotificationDefaults {
  return {
    ...DEFAULT_NOTIFICATION_OPTIONS,
    ...override,
    durations: {
      ...DEFAULT_NOTIFICATION_OPTIONS.durations,
      ...override.durations,
    },
  };
}

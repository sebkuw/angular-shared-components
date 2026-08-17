import { Inject, Injectable, InjectionToken, Provider } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import {
  NotificationComponent,
  NotificationData,
} from '../../components/notification/notification';
import {
  DEFAULT_NOTIFICATION_OPTIONS,
  mergeNotificationDefaults,
  NotificationDefaults,
  NotificationDefaultsOverride,
  NotificationOptions,
  NotificationRequest,
} from './notification.models';

export const SHARED_NOTIFICATION_DEFAULTS = new InjectionToken<NotificationDefaults>(
  'SHARED_NOTIFICATION_DEFAULTS',
  {
    providedIn: 'root',
    factory: () => DEFAULT_NOTIFICATION_OPTIONS,
  },
);

export function provideSharedNotifications(override: NotificationDefaultsOverride = {}): Provider {
  return {
    provide: SHARED_NOTIFICATION_DEFAULTS,
    useValue: mergeNotificationDefaults(override),
  };
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(
    private readonly snackBar: MatSnackBar,
    @Inject(SHARED_NOTIFICATION_DEFAULTS) private readonly defaults: NotificationDefaults,
  ) {}

  show(request: NotificationRequest): MatSnackBarRef<NotificationComponent> {
    const data: NotificationData = {
      message: request.message,
      type: request.type,
      dismissLabel: request.dismissLabel ?? this.defaults.dismissLabel,
      action: request.action,
    };
    const panelClass = Array.isArray(request.panelClass)
      ? [...request.panelClass]
      : request.panelClass
        ? [request.panelClass]
        : [];

    return this.snackBar.openFromComponent(NotificationComponent, {
      data,
      duration: request.duration ?? this.defaults.durations[request.type],
      horizontalPosition: request.horizontalPosition ?? this.defaults.horizontalPosition,
      verticalPosition: request.verticalPosition ?? this.defaults.verticalPosition,
      panelClass: [
        'shared-notification-panel',
        `shared-notification-panel--${request.type}`,
        ...panelClass,
      ],
    });
  }

  success(
    message: string,
    options: NotificationOptions = {},
  ): MatSnackBarRef<NotificationComponent> {
    return this.show({ ...options, message, type: 'success' });
  }

  info(message: string, options: NotificationOptions = {}): MatSnackBarRef<NotificationComponent> {
    return this.show({ ...options, message, type: 'info' });
  }

  error(message: string, options: NotificationOptions = {}): MatSnackBarRef<NotificationComponent> {
    return this.show({ ...options, message, type: 'error' });
  }
}

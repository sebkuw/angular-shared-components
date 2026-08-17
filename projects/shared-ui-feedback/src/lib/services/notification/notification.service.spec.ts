import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationComponent } from '../../components/notification/notification';
import { mergeNotificationDefaults } from './notification.models';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  it('applies consistent defaults and keeps error messages persistent', () => {
    const reference = {} as MatSnackBarRef<NotificationComponent>;
    const snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['openFromComponent']);
    snackBar.openFromComponent.and.returnValue(reference);
    const service = new NotificationService(
      snackBar,
      mergeNotificationDefaults({ dismissLabel: 'Close message' }),
    );

    expect(service.error('Could not save')).toBe(reference);
    expect(snackBar.openFromComponent).toHaveBeenCalledWith(
      NotificationComponent,
      jasmine.objectContaining({
        duration: undefined,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        data: jasmine.objectContaining({
          message: 'Could not save',
          type: 'error',
          dismissLabel: 'Close message',
        }),
      }),
    );
  });

  it('allows request-level duration, position, action and panel-class overrides', () => {
    const snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['openFromComponent']);
    snackBar.openFromComponent.and.returnValue({} as MatSnackBarRef<NotificationComponent>);
    const service = new NotificationService(snackBar, mergeNotificationDefaults({}));

    service.success('Saved', {
      duration: 9000,
      verticalPosition: 'top',
      panelClass: 'orders-message',
      action: { label: 'Undo' },
    });

    expect(snackBar.openFromComponent).toHaveBeenCalledWith(
      NotificationComponent,
      jasmine.objectContaining({
        duration: 9000,
        verticalPosition: 'top',
        panelClass: jasmine.arrayContaining([
          'shared-notification-panel--success',
          'orders-message',
        ]),
      }),
    );
  });
});

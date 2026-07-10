import { MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification';

describe('NotificationComponent', () => {
  function createComponent(type: 'success' | 'error' | 'info'): NotificationComponent {
    return new NotificationComponent(
      {
        message: 'Message',
        type,
      },
      {} as MatSnackBarRef<NotificationComponent>,
    );
  }

  it('uses success icon for success notifications', () => {
    expect(createComponent('success').iconName).toBe('check_circle');
  });

  it('uses error icon for error notifications', () => {
    expect(createComponent('error').iconName).toBe('error');
  });

  it('uses info icon for info notifications', () => {
    expect(createComponent('info').iconName).toBe('info');
  });
});

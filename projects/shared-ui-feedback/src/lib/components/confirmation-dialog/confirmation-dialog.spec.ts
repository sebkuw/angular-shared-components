import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog';

describe('ConfirmationDialogComponent', () => {
  it('returns explicit false and true results for safe and destructive actions', () => {
    const dialogRef = jasmine.createSpyObj<MatDialogRef<ConfirmationDialogComponent>>(
      'MatDialogRef',
      ['close'],
    );
    const component = new ConfirmationDialogComponent(
      {
        title: 'Remove order?',
        message: 'This cannot be undone.',
        cancelLabel: 'Keep order',
        confirmLabel: 'Remove order',
        confirmTone: 'negative',
        actionsAriaLabel: 'Confirmation actions',
      },
      dialogRef,
    );

    component.cancel();
    component.confirm();

    expect(dialogRef.close).toHaveBeenCalledWith(false);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
